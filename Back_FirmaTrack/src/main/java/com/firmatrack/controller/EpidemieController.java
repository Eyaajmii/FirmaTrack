package com.firmatrack.controller;

import com.firmatrack.model.Epidemie;
import com.firmatrack.model.Veterinaire;
import com.firmatrack.model.User;
import com.firmatrack.repository.VeterinaireRepository;
import com.firmatrack.service.EpidemieService;
import com.firmatrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/epidemies")
@CrossOrigin(origins = "*")
public class EpidemieController {

    @Autowired private EpidemieService epidemieService;
    @Autowired private UserService userService;
    @Autowired private VeterinaireRepository vetRepo;

    private Veterinaire getCurrentApprovedVet() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);
        
        // Sécurité stricte
        if (!"VETERINAIRE".equalsIgnoreCase(user.getRole()) || !"APPROVED".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("Accès refusé : Vous devez être un vétérinaire agréé !");
        }
        
        return vetRepo.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil Vétérinaire introuvable !"));
    }

    // POST : Signaler
    @PostMapping("/signaler")
    public ResponseEntity<Epidemie> signaler(@RequestBody Epidemie ep) {
        Veterinaire vet = getCurrentApprovedVet();
        return ResponseEntity.ok(epidemieService.signalerEpidemie(ep, vet));
    }

    // GET : Toutes les épidémies (Pour la carte d'Aya)
    @GetMapping
    public ResponseEntity<List<Epidemie>> getAll() {
        return ResponseEntity.ok(epidemieService.getAllEpidemies());
    }

    // GET : Mes signalements (Pour ton tableau vétérinaire)
    @GetMapping("/mes-signalements")
    public ResponseEntity<List<Epidemie>> getMesSignalements() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);
        
        Veterinaire vet = vetRepo.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil Vétérinaire introuvable !"));
                
        return ResponseEntity.ok(epidemieService.getEpidemiesByVet(vet.getId()));
    }
}