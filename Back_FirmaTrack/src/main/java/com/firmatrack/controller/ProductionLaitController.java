package com.firmatrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firmatrack.model.ProductionLait;
import com.firmatrack.service.ProductionLaitService;

@RestController
@RequestMapping("/api/production-lait")
@CrossOrigin(origins = "*") // Permet au front-end d'appeler cette API sans blocage
public class ProductionLaitController {

    @Autowired
    private ProductionLaitService productionLaitService;

    // API pour ajouter une production (POST http://localhost:8888/api/production-lait/ajouter)
    @PostMapping("/ajouter")
    public ResponseEntity<ProductionLait> ajouterProduction(@RequestBody ProductionLait production) {
        ProductionLait nouvelleProduction = productionLaitService.enregistrerProduction(production);
        return new ResponseEntity<>(nouvelleProduction, HttpStatus.CREATED);
    }
    
    
    @GetMapping("/{id}")                                        
    public ResponseEntity<ProductionLait> getById(@PathVariable Long id) {
        return productionLaitService.getById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public ResponseEntity<List<ProductionLait>> getToutesLesProductions() {
        return ResponseEntity.ok(productionLaitService.getToutesLesProductions());
    }

    
    @GetMapping("/animal/{cheptelId}")
    public ResponseEntity<List<ProductionLait>> getParAnimal(@PathVariable Long cheptelId) {
        return ResponseEntity.ok(productionLaitService.getProductionParAnimal(cheptelId));
    }

    
    @GetMapping("/lot/{lotId}")
    public ResponseEntity<List<ProductionLait>> getParLot(@PathVariable Long lotId) {
        return ResponseEntity.ok(productionLaitService.getProductionParLot(lotId));
    }
    
    @PutMapping("/{id}")                                         
    public ResponseEntity<ProductionLait> updateProduction(@PathVariable Long id, @RequestBody ProductionLait production) {
        return ResponseEntity.ok(productionLaitService.updateProduction(id, production));
    }

    @DeleteMapping("/{id}")                                      
    public ResponseEntity<Void> deleteProduction(@PathVariable Long id) {
        productionLaitService.deleteProduction(id);
        return ResponseEntity.noContent().build();
    }
}