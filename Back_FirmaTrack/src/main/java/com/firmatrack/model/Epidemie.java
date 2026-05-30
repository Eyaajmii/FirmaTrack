package com.firmatrack.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "epidemies")
@Getter
@Setter
public class Epidemie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String maladie;
    private String gouvernorat; 
    private String description;

    private Double latitude; 
    private Double longitude;

    private LocalDate dateSignalement;

    @ManyToOne
    @JoinColumn(name = "veterinaire_id")
    private Veterinaire veterinaire;

    public Epidemie() {
        this.dateSignalement = LocalDate.now();
    }
}