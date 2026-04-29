package com.firmatrack.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "medicament")
@Getter
@Setter
public class Medicament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String dosage;

    private String frequence;

    private String voieAdministration;

    @ManyToOne
    private Traitement traitement;
    public Medicament() {
    }
}
