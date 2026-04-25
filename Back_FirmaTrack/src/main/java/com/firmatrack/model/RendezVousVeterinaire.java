package com.firmatrack.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "rendezvous")
@Getter
@Setter
public class RendezVousVeterinaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateRdv;
    private String motif;

    private String symptomes;

    private String remarques;

    private String statut;
    // demandé, confirmé, terminé

    @ManyToOne
    private Fermier fermier;

    @ManyToOne
    private Veterinaire veterinaire;

    @ManyToOne
    private Cheptel animal;

    public RendezVousVeterinaire() {
    }
}
