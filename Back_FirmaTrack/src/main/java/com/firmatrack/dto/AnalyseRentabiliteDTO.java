package com.firmatrack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AnalyseRentabiliteDTO {
    private Double totalDepenses;
    private Double totalProduction;
    private Double coutRevientParUnite;
    private String messageStatus; // "BÉNÉFICE" ou "PERTE"
    private String typeProduit; // "LAIT" ou "OEUFS"
}