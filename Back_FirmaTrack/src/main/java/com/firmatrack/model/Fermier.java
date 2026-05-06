package com.firmatrack.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.*;
@Entity
@Table(name = "fermier")
@Getter
@Setter
public class Fermier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    // nom de la ferme
    private String nomFerme;
    // localisation
    private String localisation;
    // surface de la ferme
    private Double surfaceFerme;
    // date création ferme
    private LocalDate DateCreationFerme;
    @OneToMany(mappedBy = "fermier", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Cheptel> cheptels;

    public Fermier() {
    }

}
