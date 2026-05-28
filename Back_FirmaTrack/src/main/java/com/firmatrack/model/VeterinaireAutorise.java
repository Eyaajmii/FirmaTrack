package com.firmatrack.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "veterinaires_autorises")
@Getter
@Setter
public class VeterinaireAutorise {
    @Id
    private String numeroOrdre; // Clé primaire : Le numéro CNOMVT officiel
    private String nomComplet;
    
    public VeterinaireAutorise() {}
    public VeterinaireAutorise(String numeroOrdre, String nomComplet) {
        this.numeroOrdre = numeroOrdre;
        this.nomComplet = nomComplet;
    }
}