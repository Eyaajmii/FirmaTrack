package com.firmatrack.model;

import java.util.List;

import com.fasterxml.jackson.annotation.*;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "carnetsante")
@Getter
@Setter
public class Carnetsante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String groupeSanguin;

    private String allergies;

    private String observationsGenerales;

    @OneToOne
    @JoinColumn(name = "animal_id")
    @JsonManagedReference
    private Cheptel animal;
    @OneToMany(mappedBy = "carnetSante")
    @JsonManagedReference
    private List<Vaccination> vaccinations;

    @OneToMany(mappedBy = "carnetSante")
    @JsonManagedReference
    private List<Maladie> maladies;

    // @OneToMany(mappedBy = "carnetSante")
    // private List<SuiviEtatSante> suivis;
    public Carnetsante() {
    }

}
