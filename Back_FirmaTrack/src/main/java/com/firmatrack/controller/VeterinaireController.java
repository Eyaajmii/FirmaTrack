package com.firmatrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firmatrack.model.Veterinaire;
import com.firmatrack.service.VeterinaireService;

@RestController
@RequestMapping("/api/veterinaires")
@CrossOrigin(origins = "*")
public class VeterinaireController {
    @Autowired
    private VeterinaireService veterinaireService;
    @PostMapping
    public ResponseEntity<Veterinaire> createVeterinaire(@RequestBody Veterinaire v) {
        return ResponseEntity.ok(veterinaireService.saveVeterinaire(v));
    }
    @PutMapping("/{id}")
    public Veterinaire updateVet(@PathVariable Long id, @RequestBody Veterinaire v) {
        v.setId(id);
        return veterinaireService.saveVeterinaire(v);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVeterinaire(@PathVariable Long id) {
        veterinaireService.deleteVeterinaire(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Veterinaire> getById(@PathVariable Long id) {
        Veterinaire v = veterinaireService.getById(id);
        if (v == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(v);
    }
    @GetMapping
    public List<Veterinaire> getAll() {
        return veterinaireService.getAll();
    }
    @GetMapping("/specialite/{specialite}")
    public ResponseEntity<List<Veterinaire>> getBySpecialite(@PathVariable String specialite) {
        return ResponseEntity.ok(
                veterinaireService.getBySpecialite(specialite)
        );
    }
    @GetMapping("/urgence")
    public ResponseEntity<List<Veterinaire>> getUrgence() {
        return ResponseEntity.ok(veterinaireService.getUrgence());
    }
    @GetMapping("/deplacement-ferme")
    public ResponseEntity<List<Veterinaire>> getDeplacementFerme() {
        return ResponseEntity.ok(veterinaireService.getDeplacementFerme());
    }
    @GetMapping("/proches")
    public ResponseEntity<List<Veterinaire>> getProches(
        @RequestParam Double lat,
        @RequestParam Double lng,
        @RequestParam(defaultValue = "20") Double rayonKm) {
        return ResponseEntity.ok(veterinaireService.getProches(lat, lng, rayonKm));
    }
    
}