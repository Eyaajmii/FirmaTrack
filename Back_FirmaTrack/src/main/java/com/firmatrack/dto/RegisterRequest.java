package com.firmatrack.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    // Infos communes (User)
    private String name;
    private String email;
    private String password;
    private String role; // "FERMIER" ou "VETERINAIRE"
    private String telephone;

    // Infos spécifiques Fermier
    private String nomFerme;
    private Double surfaceFerme;

    // Infos spécifiques Vétérinaire
    private String specialite;
    private String diplome;
}