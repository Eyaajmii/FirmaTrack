package com.firmatrack.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class ProfileDTO {
    // Commun (User) - US 64
    private String name;
    private String telephone;
    private String adresse;

    // Éleveur (Fermier) - US 62
    private String nomFerme;
    private Double surfaceFerme;
    private String localisationFerme;
    private LocalDate dateCreationFerme;

    // Vétérinaire - US 63
    private String specialite;
    private String nomCabinet;
    private String horairesConsultation;
    private String universite;
    private Integer anneesExperience;
    private Boolean disponibleUrgence;
    private Double tarifConsultation;
    private String moyenTransport;
    private String localisationCabinet; 
    private Double latitudeCabinet;
    private Double longitudeCabinet;

    // Sécurité - US 65
    private String nouveauPassword;
}