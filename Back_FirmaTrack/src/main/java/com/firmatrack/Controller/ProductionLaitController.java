package com.firmatrack.Controller;

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
}