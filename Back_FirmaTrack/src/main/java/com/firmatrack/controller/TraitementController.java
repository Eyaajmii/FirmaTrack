package com.firmatrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firmatrack.model.Traitement;
import com.firmatrack.service.TraitementService;

@RestController
@RequestMapping("/api/traitements")
@CrossOrigin(origins = "*")
public class TraitementController {

    @Autowired
    private TraitementService traitementService;
    @PostMapping("/maladie/{maladieId}")
    public ResponseEntity<?> ajouterTraitement(@PathVariable Long maladieId,@RequestBody Traitement t) {
        Traitement saved = traitementService.ajouterTraitement(maladieId, t);
        if (saved == null) {
            return ResponseEntity.badRequest().body("Maladie introuvable");
        }
        return ResponseEntity.ok(saved);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Traitement> updateTraitement(@PathVariable Long id,@RequestBody Traitement t) {
        Traitement updated = traitementService.updateTraitement(id, t);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTraitement(@PathVariable Long id) {
        traitementService.deleteTraitement(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Traitement> getById(@PathVariable Long id) {
        Traitement t = traitementService.getTraitementById(id);
        if (t == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(t);
    }
    @GetMapping
    public ResponseEntity<List<Traitement>> getAll() {
        return ResponseEntity.ok(traitementService.getAllTraitements());
    }
    @GetMapping("/maladie/{maladieId}")
    public ResponseEntity<List<Traitement>> getByMaladie(@PathVariable Long maladieId) {
        return ResponseEntity.ok(traitementService.getByMaladie(maladieId));
    }
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Traitement>> getByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(traitementService.getByStatut(statut));
    }
    @PutMapping("/terminer/{id}")
    public ResponseEntity<Traitement> terminerTraitement(@PathVariable Long id) {
        Traitement t = traitementService.terminerTraitement(id);

        if (t == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(t);
    }
}