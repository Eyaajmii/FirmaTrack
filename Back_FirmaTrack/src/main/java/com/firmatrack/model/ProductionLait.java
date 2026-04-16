package com.firmatrack.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name="production_lait")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductionLait {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Date de la traite / production
    private LocalDate dateProduction;

    // Quantité en litres
    private Double quantiteLitre;

    // Relation optionnelle : Si la production est liée à UN animal spécifique
    @ManyToOne
    @JoinColumn(name = "cheptel_id")
    private Cheptel cheptel;

    // Relation optionnelle : Si la production est liée à un LOT global (sans distinguer l'animal)
    @ManyToOne
    @JoinColumn(name = "lot_id")
    private Lot lot;
}