package com.firmatrack.controller;

import com.firmatrack.dto.AnalyseRentabiliteDTO;
import com.firmatrack.model.Depense;
import com.firmatrack.service.FinanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance")
@CrossOrigin(origins = "*")
public class DepenseController {

    @Autowired
    private FinanceService financeService;

    // US 30 : Ajout avec ID dans l'URL
    @PostMapping("/depenses/{fermierId}")
    public ResponseEntity<Depense> addDepense(@RequestBody Depense depense, @PathVariable Long fermierId) {
        return ResponseEntity.ok(financeService.saveDepense(depense, fermierId));
    }

    @GetMapping("/depenses/fermier/{fermierId}")
    public ResponseEntity<List<Depense>> getFermierDepenses(@PathVariable Long fermierId) {
        return ResponseEntity.ok(financeService.getDepensesByFermier(fermierId));
    }

    @DeleteMapping("/depenses/{id}")
    public ResponseEntity<?> deleteDepense(@PathVariable Long id) {
        financeService.deleteDepense(id);
        return ResponseEntity.ok("Dépense supprimée !");
    }
    
    @GetMapping("/analyse/lait/{fermierId}")
    public ResponseEntity<AnalyseRentabiliteDTO> getAnalyseLait(
            @PathVariable Long fermierId,
            @RequestParam(required = false) Double prixVente // Reçoit le prix via ?prixVente=1.450
    ) {
        return ResponseEntity.ok(financeService.calculerAnalyseLait(fermierId, prixVente));
    }
    
    @GetMapping("/analyse/oeufs/{fermierId}")
    public ResponseEntity<AnalyseRentabiliteDTO> getAnalyseOeufs(
            @PathVariable Long fermierId,
            @RequestParam(required = false) Double prixVente
    ) {
        return ResponseEntity.ok(financeService.calculerAnalyseOeufs(fermierId, prixVente));
    }
    
    @GetMapping("/repartition/{fermierId}")
    public ResponseEntity<Map<String, Double>> getRepartition(@PathVariable Long fermierId) {
        Map<String, Double> repartition = financeService.getRepartitionDepenses(fermierId);
        return ResponseEntity.ok(repartition);
    }
    
    
}