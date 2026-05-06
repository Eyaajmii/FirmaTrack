package com.firmatrack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.firmatrack.model.RendezVousVeterinaire;
import com.firmatrack.model.User;
import com.firmatrack.service.RendezVousVeterinaireService;
import com.firmatrack.service.UserService;

@RestController
@RequestMapping("/api/rendezvous")
@CrossOrigin(origins = "*")
public class RendezVousVeterinaireController {
    @Autowired
    private RendezVousVeterinaireService rdvService;
    @Autowired
    private UserService userService;
    @GetMapping
    public ResponseEntity<List<RendezVousVeterinaire>> getAllRdvs() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.ok(rdvService.getAll());
        }
        if ("FERMIER".equalsIgnoreCase(user.getRole())) {
            Long fermierId = user.getFermier().getId();
            return ResponseEntity.ok(rdvService.getRdvByFermier(fermierId));
        }
        if ("VETERINAIRE".equalsIgnoreCase(user.getRole())) {
            Long vetId = user.getVeterinaire().getId();
            return ResponseEntity.ok(rdvService.getRdvByVeterinaire(vetId));
        }

        return ResponseEntity.status(403).build();
    }

    @PostMapping
    public ResponseEntity<?> prendreRdv(@RequestBody RendezVousVeterinaire rdv) {
        boolean exists = rdvService.existsByVeterinaireAndDate(rdv.getVeterinaire().getId(),rdv.getDateRdv());
        if (exists) {return ResponseEntity.badRequest().body("Ce vétérinaire a déjà un rendez-vous à cette date !");}
        return ResponseEntity.ok(rdvService.prendreRendezVous(rdv));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RendezVousVeterinaire> updateMedicament(@PathVariable Long id,
            @RequestBody RendezVousVeterinaire m) {
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
    //@GetMapping("/fermier/{fermierId}")
    //public ResponseEntity<List<RendezVousVeterinaire>> getByFermier(@PathVariable Long fermierId) {
      //  return ResponseEntity.ok(rdvService.getRdvByFermier(fermierId));
    //}

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