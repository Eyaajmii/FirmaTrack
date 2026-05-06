package com.firmatrack.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "depenses")
@Getter
@Setter
public class Depense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private CategorieDepense categorie;

    private Double montant;
    private LocalDate dateDepense;
    private String description;

    // Liaison avec le fermier (Un fermier a plusieurs dépenses)
    @ManyToOne
    @JoinColumn(name = "fermier_id")
    private Fermier fermier;

    public Depense() {
        this.dateDepense = LocalDate.now(); // Par défaut, aujourd'hui
    }
}