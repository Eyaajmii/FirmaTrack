package com.firmatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AnimalRentabiliteDTO {
    private Long id;
    private String nom;
    private String chepnumber;
    private String type;
    private Double totalProduction;
    private Double margeNette;
    private int scoreEtoiles; // 1, 3 ou 5
}