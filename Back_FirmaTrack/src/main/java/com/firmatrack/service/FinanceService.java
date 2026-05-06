package com.firmatrack.service;

import com.firmatrack.dto.AnalyseRentabiliteDTO;
import java.util.Map;
import java.util.stream.Collectors;
import com.firmatrack.model.*;
import com.firmatrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class FinanceService {

		@Autowired private DepenseRepository depenseRepository;
	    @Autowired private ProductionLaitRepository productionLaitRepository;
	    @Autowired private ProductionOeufRepository productionOeufRepository;
	    @Autowired private FermierRepository fermierRepository; // findById est dedans par héritage !
	    @Autowired private cheptelRepository cheptelRepo;
	    
	 // --- US 30 : ENREGISTRER UNE DÉPENSE ---
	    @Transactional
	    public Depense saveDepense(Depense depense, Long fermierId) {
	        // Utilisation de findById qui vient de JpaRepository
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

    // 2. ANALYSE RENTABILITÉ LAIT (US 31)
    public AnalyseRentabiliteDTO calculerAnalyseLait(Long fermierId, Double prixVenteSaisi) {
        List<Depense> depenses = depenseRepository.findByFermierId(fermierId);
        double totalD = depenses.stream().mapToDouble(Depense::getMontant).sum();

        double totalP = productionLaitRepository.findAll().stream()
            .filter(p -> {
                // Si la production est liée à une vache précise
                if (p.getCheptel() != null && p.getCheptel().getFermier() != null) {
                    return p.getCheptel().getFermier().getId().equals(fermierId);
                }
                // Si liée à un Lot (Logique d'Aya : on cherche le proprio d'un animal du lot)
                if (p.getLot() != null) {
                    List<Cheptel> animauxDuLot = cheptelRepo.findByLotId(p.getLot().getId());
                    if (!animauxDuLot.isEmpty()) {
                        return animauxDuLot.get(0).getFermier().getId().equals(fermierId);
                    }
                }
                return false;
            })
            .mapToDouble(ProductionLait::getQuantiteLitre)
            .sum();

        double coutRevient = (totalP > 0) ? totalD / totalP : 0;
        double prixFinal = (prixVenteSaisi != null && prixVenteSaisi > 0) ? prixVenteSaisi : 1.340;

        String status = (totalP == 0) ? "PAS DE PRODUCTION" : (coutRevient > prixFinal ? "EN PERTE" : "RENTABLE");

        return new AnalyseRentabiliteDTO(totalD, totalP, coutRevient, status, "LAIT");
    }

    // 3. ANALYSE RENTABILITÉ ŒUFS (US 31)
    public AnalyseRentabiliteDTO calculerAnalyseOeufs(Long fermierId, Double prixVenteSaisi) {
        List<Depense> depenses = depenseRepository.findByFermierId(fermierId);
        double totalD = depenses.stream().mapToDouble(Depense::getMontant).sum();

        double totalP = productionOeufRepository.findAll().stream()
            .filter(p -> p.getFermier() != null && p.getFermier().getId().equals(fermierId))
            .mapToDouble(p -> p.getQuantiteOeufs().doubleValue())
            .sum();

        double coutRevient = (totalP > 0) ? totalD / totalP : 0;
        double prixFinal = (prixVenteSaisi != null && prixVenteSaisi > 0) ? prixVenteSaisi : 0.340;

        String status = (totalP == 0) ? "PAS DE PRODUCTION" : (coutRevient > prixFinal ? "EN PERTE" : "RENTABLE");

        return new AnalyseRentabiliteDTO(totalD, totalP, coutRevient, status, "OEUFS");
    }
    public Map<String, Double> getRepartitionDepenses(Long fermierId) {
        // 1. Récupérer toutes les dépenses du fermier
        List<Depense> depenses = depenseRepository.findByFermierId(fermierId);

        // 2. Grouper par catégorie et sommer les montants
        return depenses.stream()
                .collect(Collectors.groupingBy(
                    d -> d.getCategorie().toString(), // La clé : le nom de la catégorie
                    Collectors.summingDouble(Depense::getMontant) // La valeur : la somme des montants
                ));
    }
}