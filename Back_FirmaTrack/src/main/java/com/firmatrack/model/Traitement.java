package com.firmatrack.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "traitement")
@Getter
@Setter

public class Traitement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    private String statut; // En cours, Terminé

    private String remarques;

    @ManyToOne
    private Maladie maladie;
    @OneToMany(mappedBy = "traitement")
    private List<Medicament> medicaments;

    public Traitement() {
    }
}
