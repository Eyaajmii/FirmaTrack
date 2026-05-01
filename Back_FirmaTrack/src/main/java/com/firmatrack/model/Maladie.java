package com.firmatrack.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.*;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "maladie")
@Getter
@Setter
public class Maladie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomMaladie;

    private String symptomes;

    private String diagnostic;

    private String gravite;

    private String statut; // Active, Guérie

    private String remarques;

    private LocalDate dateDetection;

    @ManyToOne
    @JsonIgnore
    private Veterinaire veterinaire;
    @ManyToOne
    @JsonBackReference
    private Carnetsante carnetSante;
    public Maladie() {
    }
}
