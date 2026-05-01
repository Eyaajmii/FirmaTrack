package com.firmatrack.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "stocks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    
    // Type : ALIMENTATION, MEDICAMENT, MATERIEL
    private String type;

    private Double quantite;

    private String unite; // kg, litres, sacs

    private Double seuilAlerte; // Pour l'US 55 (Notification stock critique)

    private Double prixUnitaire; 
    private LocalDate dateExpiration;

    //  un helper pour savoir si c'est périmé
    public boolean isPerime() {
        if (this.dateExpiration == null) return false;
        return this.dateExpiration.isBefore(LocalDate.now());
    }
    
}