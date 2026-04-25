package com.firmatrack.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "veterinaire")
@Getter
@Setter
public class Veterinaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    private String nomVet;
    private String localisation;
    private String numeroOrdreVeterinaire;
    private String specialite;
    private Integer anneesExperience;
    private String diplome;
    private String universite;
    // Cabinet
    private String nomCabinet;
    private Boolean disponibleUrgence;
    // Planning
    private String joursDisponibles;
    private String horairesConsultation;
    private String statut; // Actif, Inactif
    private LocalDate dateRecrutement;
    // Champs pour les visites sur terrain
    private Boolean deplacementFerme;
    private Double tarifConsultation;
    private Double tarifUrgence;
    private String moyenTransport;
    // Pour les avis
    private Double noteMoyenne;
    private Integer nombreAvis;
    // Liste des rendezvous
    @OneToMany(mappedBy = "veterinaire")
    private List<RendezVousVeterinaire> rendezVous;
    @OneToMany(mappedBy = "veterinaire")
    private List<Maladie> maladies;
    @OneToMany(mappedBy = "veterinaire")
    private List<Vaccination> vaccinations;

    public Veterinaire() {
    }

}
