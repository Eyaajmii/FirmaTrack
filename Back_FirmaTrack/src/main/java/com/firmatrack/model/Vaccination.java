package com.firmatrack.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.*;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "vaccination")
@Getter
@Setter
public class Vaccination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vaccin;

    private LocalDate datePlanifiee;

    private LocalDate dateRealisee;

    private String statut; // Planifiée, Réalisée, Retard

    private String rappel;

    private String observations;

    @ManyToOne
    @JsonIgnore
    private Veterinaire veterinaire;
    @ManyToOne
    @JoinColumn(name = "carnet_sante_id")
    @JsonBackReference
    private Carnetsante carnetSante;
    public Vaccination() {
    }
}
