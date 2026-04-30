package com.firmatrack.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

    // Au lieu de String nom, on lie au Stock
    @ManyToOne
    @JoinColumn(name = "stock_id")
    private Stock stockItem; 

    private Double quantiteUtilisee; // Ex: 2 (unités/ml/doses)
    
    private String dosage; // Ex: "5ml par jour"
    private String frequence;
    private String voieAdministration;

    @ManyToOne
    @JsonIgnore
    private Traitement traitement;

    public Medicament() {}
}