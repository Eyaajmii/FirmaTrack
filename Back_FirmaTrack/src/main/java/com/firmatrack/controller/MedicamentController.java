package com.firmatrack.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.firmatrack.model.Medicament;
import com.firmatrack.service.MedicamentService;

@RestController
@RequestMapping("/api/medicaments")
@CrossOrigin(origins = "*")
public class MedicamentController {

    @Autowired
    private MedicamentService medicamentService;

    // UNIQUE MÉTHODE D'AJOUT (Celle qui gère le stock)
    @PostMapping("/traitement/{traitementId}/stock/{stockId}")
    public ResponseEntity<?> ajouterMedicament(@PathVariable Long traitementId, @PathVariable Long stockId, @RequestBody Medicament m) {
        try {
            return ResponseEntity.ok(medicamentService.ajouterMedicament(traitementId, stockId, m));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Medicament> updateMedicament(@PathVariable Long id, @RequestBody Medicament m) {
        Medicament updated = medicamentService.updateMedicament(id, m);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicament(@PathVariable Long id) {
        medicamentService.deleteMedicament(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicament> getById(@PathVariable Long id) {
        Medicament m = medicamentService.getMedicamentById(id);
        if (m == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(m);
    }

    @GetMapping
    public ResponseEntity<List<Medicament>> getAll() {
        return ResponseEntity.ok(medicamentService.getAllMedicaments());
    }

    @GetMapping("/traitement/{traitementId}")
    public ResponseEntity<List<Medicament>> getByTraitement(@PathVariable Long traitementId) {
        return ResponseEntity.ok(medicamentService.getByTraitement(traitementId));
    }
}