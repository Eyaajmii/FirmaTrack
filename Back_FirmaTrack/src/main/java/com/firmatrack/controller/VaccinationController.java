package com.firmatrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firmatrack.model.Vaccination;
import com.firmatrack.service.VaccinationService;

@RestController
@RequestMapping("/api/vaccinations")
@CrossOrigin(origins = "*")
public class VaccinationController {
    @Autowired
    private VaccinationService vaccinationService;
    @PostMapping("/carnet/{carnetId}")
    public ResponseEntity<?> ajouterVaccination(@PathVariable Long carnetId,@RequestBody Vaccination v) {
        Vaccination saved = vaccinationService.ajouterVaccination(carnetId, v);
        if (saved == null) {
            return ResponseEntity.badRequest().body("Carnet de santé introuvable");
        }
        return ResponseEntity.ok(saved);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Vaccination> updateVaccination(@PathVariable Long id,@RequestBody Vaccination v) {
        Vaccination updated = vaccinationService.updateVaccination(id, v);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVaccination(@PathVariable Long id) {
        vaccinationService.deleteVaccination(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Vaccination> getById(@PathVariable Long id) {
        Vaccination v = vaccinationService.getVaccinationById(id);
        if (v == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(v);
    }
    @GetMapping
    public ResponseEntity<List<Vaccination>> getAll() {
        return ResponseEntity.ok(vaccinationService.getAllVaccinations());
    }
    @GetMapping("/carnet/{carnetId}")
    public ResponseEntity<List<Vaccination>> getByCarnet(@PathVariable Long carnetId) {
        return ResponseEntity.ok(vaccinationService.getByCarnet(carnetId));
    }
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Vaccination>> getByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(vaccinationService.getByStatut(statut));
    }
    @GetMapping("/avenir")
    public ResponseEntity<List<Vaccination>> getVaccinationsAvenir() {
        return ResponseEntity.ok(vaccinationService.getVaccinationsAvenir());
    }
    @GetMapping("/animal/{animalId}/avenir")
    public ResponseEntity<List<Vaccination>> getAvenirByAnimal(@PathVariable Long animalId) {
        return ResponseEntity.ok(
                vaccinationService.getVaccinationsAvenirByAnimal(animalId)
        );
    }
    @GetMapping("/fermier/{fermierId}/avenir")
    public ResponseEntity<List<Vaccination>> getAvenirByFermier(@PathVariable Long fermierId) {
        return ResponseEntity.ok(
                vaccinationService.getVaccinationsAvenirByFermier(fermierId)
        );
    }
    @PutMapping("/realisee/{id}")
    public ResponseEntity<Vaccination> marquerRealisee(@PathVariable Long id) {
        Vaccination v = vaccinationService.marquerRealisee(id);

        if (v == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(v);
    }
}