package com.firmatrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.firmatrack.model.Maladie;
import com.firmatrack.service.MaladieService;

@RestController
@RequestMapping("/api/maladies")
@CrossOrigin(origins = "*")
public class MaladieController {
    @Autowired
    private MaladieService maladieService;
    @PostMapping("/carnet/{carnetId}")
    public ResponseEntity<?> ajouterMaladie(@PathVariable Long carnetId, @RequestBody Maladie m) {
        Maladie saved = maladieService.ajouterMaladie(carnetId, m);
        if (saved == null) {
            return ResponseEntity.badRequest().body("Carnet de santé introuvable");
        }
        return ResponseEntity.ok(saved);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Maladie> updateMaladie(@PathVariable Long id, @RequestBody Maladie m) {
        Maladie updated = maladieService.updateMaladie(id, m);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaladie(@PathVariable Long id) {
        maladieService.deleteMaladie(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Maladie> getById(@PathVariable Long id) {
        Maladie m = maladieService.getMaladieById(id);
        if (m == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(m);
    }

    @GetMapping
    public ResponseEntity<List<Maladie>> getAll() {
        return ResponseEntity.ok(maladieService.getAllMaladies());
    }

    @GetMapping("/carnet/{carnetId}")
    public ResponseEntity<List<Maladie>> getByCarnet(@PathVariable Long carnetId) {
        return ResponseEntity.ok(
                maladieService.getByCarnet(carnetId));
    }

    @GetMapping("/veterinaire/{vetId}")
    public ResponseEntity<List<Maladie>> getByVeterinaire(@PathVariable Long vetId) {
        return ResponseEntity.ok(
                maladieService.getByVeterinaire(vetId));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Maladie>> getByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(
                maladieService.getByStatut(statut));
    }

    @GetMapping("/actives")
    public ResponseEntity<List<Maladie>> getActives() {
        return ResponseEntity.ok(
                maladieService.getActives());
    }
}