package com.firmatrack.controller;

import com.firmatrack.model.Fermier;
import com.firmatrack.model.Notification;
import com.firmatrack.model.User;
import com.firmatrack.repository.NotificationRepository;
import com.firmatrack.repository.FermierRepository;
import com.firmatrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired private NotificationRepository notificationRepo;
    @Autowired private UserService userService;
    @Autowired private FermierRepository fermierRepository;

    private Fermier getCurrentFermier() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);
        return fermierRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil Fermier introuvable !"));
    }

    @GetMapping
    public ResponseEntity<?> getMyNotifications() {
        // 1. Récupérer l'utilisateur connecté
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);
        
        if (user == null) {
            return ResponseEntity.status(403).body("Utilisateur non trouvé !");
        }

        // 2. SÉCURITÉ DOUBLE RÔLE : Si c'est un Vétérinaire, on renvoie une liste vide !
        if ("VETERINAIRE".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.ok(java.util.Collections.emptyList()); // Pas de crash !
        }

        // 3. Si c'est un Fermier, on récupère ses vraies alertes régionales
        Fermier fermier = fermierRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profil Fermier introuvable !"));
                
        return ResponseEntity.ok(notificationRepo.findByFermierIdOrderByCreatedAtDesc(fermier.getId()));
    }

    // PUT : Marquer comme lu
    @PutMapping("/lire/{id}")
    public ResponseEntity<?> marquerCommeLu(@PathVariable Long id) {
        Notification notification = notificationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification introuvable"));
        notification.setLu(true);
        notificationRepo.save(notification);
        return ResponseEntity.ok("Alerte marquée comme lue !");
    }
}