package com.firmatrack.service;

import com.firmatrack.dto.AnalyseRentabiliteDTO;
import com.firmatrack.model.*;
import com.firmatrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firmatrack.dto.AnimalRentabiliteDTO;
import java.util.ArrayList;
import java.util.Comparator;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FinanceService {

    @Autowired private DepenseRepository depenseRepository;
    @Autowired private ProductionLaitRepository productionLaitRepository;
    @Autowired private ProductionOeufRepository productionOeufRepository;
    @Autowired private FermierRepository fermierRepository;
    @Autowired private cheptelRepository cheptelRepo; // Correction de la majuscule de la classe
    
    // --- US 30 : ENREGISTRER UNE DÉPENSE ---
    @Transactional
    public Depense saveDepense(Depense depense, Long fermierId) {
        Fermier fermier = fermierRepository.findById(fermierId)
            .orElseThrow(() -> new RuntimeException("Fermier non trouvé avec l'ID: " + fermierId));
        
        depense.setFermier(fermier);
        if (depense.getDateDepense() == null) {
            depense.setDateDepense(LocalDate.now());
        }
        return depenseRepository.save(depense);
    }
    
    public List<Depense> getDepensesByFermier(Long fermierId) {
        return depenseRepository.findByFermierId(fermierId);
    }

    public void deleteDepense(Long id) {
        depenseRepository.deleteById(id);
    }

    // --- US 31, 32 & 33 : ANALYSE LAIT AVEC FILTRE PAR MOIS ---
    public AnalyseRentabiliteDTO calculerAnalyseLait(Long fermierId, Double prixVenteSaisi, int moisSelectionne) {
        List<Depense> toutesDepenses = depenseRepository.findByFermierId(fermierId);
        
        // 1. Filtrer les dépenses uniquement pour le mois sélectionné
        List<Depense> depensesDuMois = toutesDepenses.stream()
                .filter(d -> d.getDateDepense() != null && d.getDateDepense().getMonthValue() == moisSelectionne)
                .collect(Collectors.toList());

        // Trieur comptable sur le mois sélectionné
        double totalDepensesProduction = depensesDuMois.stream()
                .filter(d -> d.getCategorie() == CategorieDepense.ALIMENTATION || d.getCategorie() == CategorieDepense.EAU_ELECTRICITE)
                .mapToDouble(Depense::getMontant).sum();

        double totalFraisFixes = depensesDuMois.stream()
                .filter(d -> d.getCategorie() != CategorieDepense.ALIMENTATION && d.getCategorie() != CategorieDepense.EAU_ELECTRICITE)
                .mapToDouble(Depense::getMontant).sum();

        double totalToutesDepenses = totalDepensesProduction + totalFraisFixes;
        
        // 2. Filtrer la production uniquement pour le mois sélectionné
        double totalP = productionLaitRepository.findAll().stream()
                .filter(p -> p.getDateProduction() != null && p.getDateProduction().getMonthValue() == moisSelectionne)
                .filter(p -> {
                    if (p.getCheptel() != null && p.getCheptel().getFermier() != null) {
                        return p.getCheptel().getFermier().getId().equals(fermierId);
                    }
                    if (p.getLot() != null) {
                        List<Cheptel> animaux = cheptelRepo.findByLotId(p.getLot().getId());
                        if (!animaux.isEmpty()) {
                            return animaux.get(0).getFermier().getId().equals(fermierId);
                        }
                    }
                    return false;
                })
                .mapToDouble(ProductionLait::getQuantiteLitre)
                .sum();

        // Calculs unitaires
        double coutProdUnite = (totalP > 0) ? totalDepensesProduction / totalP : 0;
        double coutGlobalUnite = (totalP > 0) ? totalToutesDepenses / totalP : 0;

        double prixMarche = (prixVenteSaisi != null && prixVenteSaisi > 0) ? prixVenteSaisi : 1.340;
        
        // US 32 : Marge de production unitaire (Directe)
        double margeProductionUnitaire = prixMarche - coutProdUnite; 

        // US 33 : Marge Globale de l'exploitation (Toutes charges)
        double chiffreAffaires = totalP * prixMarche;
        double margeGlobale = chiffreAffaires - totalToutesDepenses; 

        // Statut basé sur la rentabilité de l'exploitation
        String status = (totalP == 0) ? "PAS DE PRODUCTION" : (margeGlobale < 0 ? "EN PERTE" : "RENTABLE");
        
        return new AnalyseRentabiliteDTO(
                totalDepensesProduction, totalFraisFixes, totalToutesDepenses, 
                totalP, coutProdUnite, coutGlobalUnite, prixMarche, margeProductionUnitaire, margeGlobale, status, "LAIT"
        );
    }

    // --- US 31, 32 & 33 : ANALYSE OEUFS AVEC FILTRE PAR MOIS ---
    public AnalyseRentabiliteDTO calculerAnalyseOeufs(Long fermierId, Double prixVenteSaisi, int moisSelectionne) {
        List<Depense> toutesDepenses = depenseRepository.findByFermierId(fermierId);
        
        // 1. Filtrer les dépenses du mois sélectionné
        List<Depense> depensesDuMois = toutesDepenses.stream()
                .filter(d -> d.getDateDepense() != null && d.getDateDepense().getMonthValue() == moisSelectionne)
                .collect(Collectors.toList());

        double totalDepensesProduction = depensesDuMois.stream()
                .filter(d -> d.getCategorie() == CategorieDepense.ALIMENTATION || d.getCategorie() == CategorieDepense.EAU_ELECTRICITE)
                .mapToDouble(Depense::getMontant).sum();

        double totalFraisFixes = depensesDuMois.stream()
                .filter(d -> d.getCategorie() != CategorieDepense.ALIMENTATION && d.getCategorie() != CategorieDepense.EAU_ELECTRICITE)
                .mapToDouble(Depense::getMontant).sum();

        double totalToutesDepenses = totalDepensesProduction + totalFraisFixes;

        // 2. Filtrer la production d'œufs uniquement pour le mois sélectionné
        double totalP = productionOeufRepository.findAll().stream()
                .filter(p -> p.getDateProduction() != null && p.getDateProduction().getMonthValue() == moisSelectionne)
                .filter(p -> p.getFermier() != null && p.getFermier().getId().equals(fermierId))
                .mapToDouble(p -> p.getQuantiteOeufs().doubleValue())
                .sum();

        // Calculs unitaires
        double coutProdUnite = (totalP > 0) ? totalDepensesProduction / totalP : 0;
        double coutGlobalUnite = (totalP > 0) ? totalToutesDepenses / totalP : 0;

        double prixMarche = (prixVenteSaisi != null && prixVenteSaisi > 0) ? prixVenteSaisi : 0.340;
        
        // US 32 : Marge de production unitaire
        double margeProductionUnitaire = prixMarche - coutProdUnite; 
        
        // US 33 : Marge Globale de l'exploitation
        double chiffreAffaires = totalP * prixMarche;
        double margeGlobale = chiffreAffaires - totalToutesDepenses; 

        String status = (totalP == 0) ? "PAS DE PRODUCTION" : (margeGlobale < 0 ? "EN PERTE" : "RENTABLE");

        return new AnalyseRentabiliteDTO(
                totalDepensesProduction, totalFraisFixes, totalToutesDepenses, 
                totalP, coutProdUnite, coutGlobalUnite, prixMarche, margeProductionUnitaire, margeGlobale, status, "OEUFS"
        );
    }

    public Map<String, Double> getRepartitionDepenses(Long fermierId, int moisSelectionne) {
        List<Depense> depenses = depenseRepository.findByFermierId(fermierId);
        
        return depenses.stream()
                // --- ON FILTRE PAR MOIS ICI POUR LA US 34 ---
                .filter(d -> d.getDateDepense().getMonthValue() == moisSelectionne) 
                .collect(Collectors.groupingBy(
                    d -> d.getCategorie().toString(), 
                    Collectors.summingDouble(Depense::getMontant)
                ));
    }

    public Map<String, Double> getEvolutionAlimentation(Long fermierId) {
        List<Depense> depenses = depenseRepository.findByFermierId(fermierId);
        
        return depenses.stream()
                .filter(d -> d.getCategorie() == CategorieDepense.ALIMENTATION)
                .collect(Collectors.groupingBy(
                    d -> d.getDateDepense().getYear() + "-" + String.format("%02d", d.getDateDepense().getMonthValue()),
                    Collectors.summingDouble(Depense::getMontant)
                ));
    }
    

    public List<AnimalRentabiliteDTO> getClassementAnimaux(Long fermierId, int moisSelectionne) {
        	 // 1. Dépenses du mois uniquement
            List<Depense> toutesDepenses = depenseRepository.findByFermierId(fermierId);
            double totalD = toutesDepenses.stream()
                    .filter(d -> d.getDateDepense().getMonthValue() == moisSelectionne)
                    .mapToDouble(Depense::getMontant).sum();

            // 2. Animaux actifs
            List<Cheptel> cheptel = cheptelRepo.findAll().stream()
                    .filter(c -> c.getFermier().getId().equals(fermierId) && "ALIVE".equalsIgnoreCase(c.getStatut()))
                    .toList();
            
            double nbAnimaux = cheptel.size();
            double coutEntretienMoyen = (nbAnimaux > 0) ? totalD / nbAnimaux : 0;

            List<AnimalRentabiliteDTO> classement = new ArrayList<>();


         // 3. Calcul par animal pour le mois sélectionné
            for (Cheptel animal : cheptel) {
                double prodIndiv = productionLaitRepository.findByCheptelId(animal.getId()).stream()
                        .filter(p -> p.getDateProduction().getMonthValue() == moisSelectionne) // FILTRE MOIS !
                        .mapToDouble(ProductionLait::getQuantiteLitre)
                        .sum();

                double revenus = prodIndiv * 1.340; 
                double margeNette = revenus - coutEntretienMoyen;

                int etoiles = 1;
                if (margeNette > 50) { // Adapté aux calculs mensuels
                    etoiles = 5;
                } else if (margeNette >= 0) {
                    etoiles = 3;
                }

                // On ajoute le type d'animal (ex: "vache") dans le DTO
                classement.add(new AnimalRentabiliteDTO(
                    animal.getId(), animal.getNom(), animal.getChepnumber(), 
                    animal.getType(), prodIndiv, margeNette, etoiles
                ));
            }

         // Tri décroissant
            classement.sort(Comparator.comparingDouble(AnimalRentabiliteDTO::getMargeNette).reversed());
            
            return classement;
        }
    
    
}