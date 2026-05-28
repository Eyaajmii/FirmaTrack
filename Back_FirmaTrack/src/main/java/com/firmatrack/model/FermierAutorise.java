package com.firmatrack.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "fermiers_autorises")
@Getter
@Setter
public class FermierAutorise {
    @Id
    private String matriculeApia; // Clé primaire : Le numéro d'inscription APIA/Patente
    private String nomComplet;

    public FermierAutorise() {}
    public FermierAutorise(String matriculeApia, String nomComplet) {
        this.matriculeApia = matriculeApia;
        this.nomComplet = nomComplet;
    }
}