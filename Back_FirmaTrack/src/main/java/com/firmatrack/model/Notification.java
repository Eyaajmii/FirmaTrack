package com.firmatrack.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String message;
    private String type; // "FINANCE", "SANTE", "STOCK"
    private boolean lu = false; // Lu / Non lu
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "fermier_id")
    private Fermier fermier;

    public Notification() {}
}