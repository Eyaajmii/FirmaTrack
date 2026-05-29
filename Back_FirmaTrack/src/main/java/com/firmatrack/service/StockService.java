package com.firmatrack.service;

import com.firmatrack.model.Stock;
import com.firmatrack.model.Depense;
import com.firmatrack.model.Fermier;
import com.firmatrack.model.CategorieDepense;
import com.firmatrack.repository.StockRepository;
import com.firmatrack.repository.DepenseRepository; // Ton dépôt de dépenses
import com.firmatrack.repository.FermierRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class StockService {
	
	@Autowired
	private UserService userService; // Pour lire l'email

	@Autowired
	private FermierRepository fermierRepository; // Pour trouver le profil fermier

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private DepenseRepository depenseRepository; // Injecté pour l'automatisation !

    private Long getConnectedFermierId() {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        com.firmatrack.model.User user = userService.getUserByEmail(email);
        Fermier fermier = fermierRepository.findByUserId(user.getId()).orElse(null);
        return fermier != null ? fermier.getId() : null;
    }

    public List<Stock> getAllStock() {
        Long fermierId = getConnectedFermierId();
        if (fermierId == null) return java.util.List.of();
        return stockRepository.findByFermierId(fermierId);
    }

    // --- US 51 & US 30 : AJOUT STOCK + GÉNÉRATION DÉPENSE AUTOMATIQUE ---
    @Transactional
    public Stock ajouterIntrant(Stock stock) { 
        // 1. RÉCUPÉRATION DU FERMIER CONNECTÉ VIA LE TOKEN (La sécurité ultime)
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        
        com.firmatrack.model.User user = userService.getUserByEmail(email);
        Fermier fermier = fermierRepository.findByUserId(user.getId()).orElse(null);

        // On associe le fermier au stock (On corrige le bug de Mariem d'un coup !)
        stock.setFermier(fermier);

        // Sauvegarder d'abord le produit en stock
        Stock savedStock = stockRepository.save(stock);

        // 2. GÉNÉRATION AUTOMATIQUE DE LA DÉPENSE
        if (savedStock.getPrixUnitaire() != null && savedStock.getQuantite() != null) {
            double montantTotal = savedStock.getPrixUnitaire() * savedStock.getQuantite();

            Depense depenseAuto = new Depense();
            depenseAuto.setMontant(montantTotal);
            depenseAuto.setDateDepense(LocalDate.now());
            depenseAuto.setFermier(fermier); // <--- L'ID S7I7 EST ICI MAINTENANT !

            // Aiguillage
            if ("Alimentation".equalsIgnoreCase(savedStock.getType())) {
                depenseAuto.setCategorie(CategorieDepense.ALIMENTATION);
                depenseAuto.setDescription("Généré - Achat Stock : " + savedStock.getNom() + " (" + savedStock.getQuantite() + " unités)");
            } else if ("Médicament".equalsIgnoreCase(savedStock.getType()) || "Vaccin".equalsIgnoreCase(savedStock.getType())) {
                depenseAuto.setCategorie(CategorieDepense.SANTE_VETERINAIRE);
                depenseAuto.setDescription("Généré - Achat Stock Médical : " + savedStock.getNom());
            } else {
                depenseAuto.setCategorie(CategorieDepense.AUTRES);
                depenseAuto.setDescription("Généré - Achat Autre Stock : " + savedStock.getNom());
            }

            // Sauvegarde dans ta table
            depenseRepository.save(depenseAuto);
        }

        return savedStock; 
    }

    public Stock findById(Long id) { 
        return stockRepository.findById(id).orElse(null); 
    }

    // US 52 : Soustraire du stock
    public Stock consommerStock(Long id, Double quantite) throws Exception {
        Stock stock = stockRepository.findById(id)
            .orElseThrow(() -> new Exception("Produit introuvable en stock"));

        if (stock.isPerime()) throw new Exception("Action impossible : " + stock.getNom() + " est périmé !");
        if (stock.getQuantite() < quantite) throw new Exception("Stock insuffisant (Reste: " + stock.getQuantite() + ")");

        stock.setQuantite(stock.getQuantite() - quantite);
        return stockRepository.save(stock);
    }

    // NOUVEAU : Réajuster le stock (en cas de suppression de médicament)
    public void retournerAuStock(Long id, Double quantite) {
        stockRepository.findById(id).ifPresent(stock -> {
            stock.setQuantite(stock.getQuantite() + quantite);
            stockRepository.save(stock);
        });
    }

    public List<Stock> getAlertesQuantite() {
        Long fermierId = getConnectedFermierId();
        if (fermierId == null) return java.util.List.of();
        return stockRepository.findStockCritiqueByFermierId(fermierId);
    }

    public List<Stock> getAlertesPeremption() {
        Long fermierId = getConnectedFermierId();
        if (fermierId == null) return java.util.List.of();
        return stockRepository.findProduitsPerimesByFermierId(fermierId, LocalDate.now());
    }
}