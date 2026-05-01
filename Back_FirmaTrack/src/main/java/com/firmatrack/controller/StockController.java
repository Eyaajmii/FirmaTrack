package com.firmatrack.controller;

import com.firmatrack.model.Stock;
import com.firmatrack.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // Import indispensable
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class StockController {

    @Autowired
    private StockService stockService;

    // US 49 : Liste complète
    @GetMapping
    public List<Stock> getStock() {
        return stockService.getAllStock();
    }

    // Obtenir un article par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Stock> getById(@PathVariable Long id) {
        Stock s = stockService.findById(id);
        return s != null ? ResponseEntity.ok(s) : ResponseEntity.notFound().build();
    }

    // US 51 : Ajouter un intrant
    @PostMapping
    public Stock addStock(@RequestBody Stock stock) {
        return stockService.ajouterIntrant(stock);
    }

    // US 52 : Diminution manuelle ou via interface
    // CORRECTION : Ajout du try-catch pour gérer l'exception du service
    @PatchMapping("/{id}/consommer")
    public ResponseEntity<?> consommer(@PathVariable Long id, @RequestParam Double qte) {
        try {
            Stock updated = stockService.consommerStock(id, qte);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            // Renvoie l'erreur "Stock insuffisant" ou "Périmé" au format texte
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // US 50 : Suppression (Gestion complète)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // Optionnel : ajouter une méthode delete dans StockService si ce n'est pas fait
        // stockService.delete(id); 
        return ResponseEntity.noContent().build();
    }

    // US 55 : Alertes quantité critique
    @GetMapping("/alertes/quantite")
    public List<Stock> getAlertesQuantite() {
        return stockService.getAlertesQuantite();
    }

    // US 55 : Alertes péremption
    @GetMapping("/alertes/peremption")
    public List<Stock> getAlertesPeremption() {
        return stockService.getAlertesPeremption();
    }
}