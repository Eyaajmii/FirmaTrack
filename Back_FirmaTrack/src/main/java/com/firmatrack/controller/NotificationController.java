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

    // GET : Toutes mes alertes (Sécurisé par Token)
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications() {
        Fermier fermier = getCurrentFermier();
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