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
    @PostMapping("/traitement/{traitementId}")
    public ResponseEntity<?> ajouterMedicament(@PathVariable Long traitementId,
            @RequestBody Medicament m) {

        Medicament saved = medicamentService.ajouterMedicament(traitementId, m);

        if (saved == null) {
            return ResponseEntity.badRequest()
                    .body("Traitement introuvable");
        }

        return ResponseEntity.ok(saved);
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
        return ResponseEntity.ok(
                medicamentService.getByTraitement(traitementId)
        );
    }
}