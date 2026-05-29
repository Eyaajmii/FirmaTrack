package com.firmatrack.repository;

import com.firmatrack.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Récupère les notifications d'un fermier triées par date décroissante
    List<Notification> findByFermierIdOrderByCreatedAtDesc(Long fermierId);
}