package com.firmatrack.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductionOeufDTO {

    private Long id;
    private LocalDate dateProduction;
    private Integer quantiteOeufs;
    private String qualite;
    private String notes;

    // Référence animal
    private Long cheptelId;
    private String cheptelNom;
    private String cheptelNumber;

    // Référence lot
    private Long lotId;
    private String lotNom;
}