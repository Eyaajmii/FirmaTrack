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

    @ManyToOne
    @JoinColumn(name = "animal_id")
    private Cheptel animal;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "veterinaire_id")
    private Veterinaire veterinaire;
    private LocalDateTime dateRdv;
    private String motif;

    private String symptomes;

    private String remarques;
    @Enumerated(EnumType.STRING)
    private StatutRendezVous statut;
    //@ManyToOne
    //@JoinColumn(name = "fermier_id")
    //@JsonIgnoreProperties({"cheptels", "user"})
    //private Fermier fermier;

    public RendezVousVeterinaire() {
    }
}
