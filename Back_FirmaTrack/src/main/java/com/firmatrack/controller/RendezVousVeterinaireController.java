package com.firmatrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firmatrack.model.RendezVousVeterinaire;
import com.firmatrack.service.RendezVousVeterinaireService;

@RestController
@RequestMapping("/api/rendezvous")
@CrossOrigin(origins = "*")
public class RendezVousVeterinaireController {
    @Autowired
    private RendezVousVeterinaireService rdvService;
    @PostMapping
    public ResponseEntity<RendezVousVeterinaire> prendreRdv(@RequestBody RendezVousVeterinaire rdv) {
        return ResponseEntity.ok(rdvService.prendreRendezVous(rdv));
    }
    @PutMapping("/{id}")
    public ResponseEntity<RendezVousVeterinaire> updateMedicament(@PathVariable Long id, @RequestBody RendezVousVeterinaire m) {
        RendezVousVeterinaire updated = rdvService.updateRendezVousVeterinaire(id, m);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRdv(@PathVariable Long id) {
        rdvService.deleteRdv(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/confirmer/{id}")
    public ResponseEntity<RendezVousVeterinaire> confirmer(@PathVariable Long id) {
        RendezVousVeterinaire rdv = rdvService.confirmer(id);

        if (rdv == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(rdv);
    }

    // Terminer un rendez-vous
    @PutMapping("/terminer/{id}")
    public ResponseEntity<RendezVousVeterinaire> terminer(@PathVariable Long id) {
        RendezVousVeterinaire rdv = rdvService.terminer(id);

        if (rdv == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(rdv);
    }

    // RDV par vétérinaire
    @GetMapping("/veterinaire/{vetId}")
    public ResponseEntity<List<RendezVousVeterinaire>> getByVeterinaire(@PathVariable Long vetId) {
        return ResponseEntity.ok(rdvService.getRdvByVeterinaire(vetId));
    }

    // RDV par fermier
    @GetMapping("/fermier/{fermierId}")
    public ResponseEntity<List<RendezVousVeterinaire>> getByFermier(@PathVariable Long fermierId) {
        return ResponseEntity.ok(rdvService.getRdvByFermier(fermierId));
    }

    // RDV par animal
    @GetMapping("/animal/{animalId}")
    public ResponseEntity<List<RendezVousVeterinaire>> getByAnimal(@PathVariable Long animalId) {
        return ResponseEntity.ok(rdvService.getRdvByAnimal(animalId));
    }

    // RDV par statut
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<RendezVousVeterinaire>> getByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(rdvService.getRdvByStatut(statut));
    }
}