package com.firmatrack.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "production_oeufs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductionOeuf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Date de la collecte
    private LocalDate dateProduction;

    // Nombre d'œufs collectés
    private Integer quantiteOeufs;

    // Qualité : A, B, C
    private String qualite;

    // Notes optionnelles
    @Column(length = 500)
    private String notes;

    // Lié à un animal individuel (poule, oie...)
    @ManyToOne
    @JoinColumn(name = "cheptel_id")
    private Cheptel cheptel;

    // Ou lié à un lot (groupe de poules)
    @ManyToOne
    @JoinColumn(name = "lot_id")
    private Lot lot;

    // Fermier propriétaire
    @ManyToOne
    @JoinColumn(name = "fermier_id")
    private Fermier fermier;
}