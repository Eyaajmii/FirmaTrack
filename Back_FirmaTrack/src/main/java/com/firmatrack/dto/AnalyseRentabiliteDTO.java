package com.firmatrack.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnalyseRentabiliteDTO {
    private Double totalDepensesProduction; 
    private Double totalFraisFixes;         
    private Double totalToutesDepenses;     
    private Double totalProduction;         
    private Double coutProductionParUnite;  
    private Double coutGlobalParUnite;      
    private Double prixMarcheActuel;        
    private Double margeProductionUnitaire; // <--- AJOUTÉ (US 32)
    private Double margeGlobale;            // <--- AJOUTÉ (US 33)
    private String messageStatus;           
    private String typeProduit;             

    public AnalyseRentabiliteDTO(Double totalDepensesProduction, Double totalFraisFixes, Double totalToutesDepenses, 
                                 Double totalProduction, Double coutProductionParUnite, Double coutGlobalParUnite, 
                                 Double prixMarcheActuel, Double margeProductionUnitaire, Double margeGlobale, 
                                 String messageStatus, String typeProduit) {
        this.totalDepensesProduction = totalDepensesProduction;
        this.totalFraisFixes = totalFraisFixes;
        this.totalToutesDepenses = totalToutesDepenses;
        this.totalProduction = totalProduction;
        this.coutProductionParUnite = coutProductionParUnite;
        this.coutGlobalParUnite = coutGlobalParUnite;
        this.prixMarcheActuel = prixMarcheActuel;
        this.margeProductionUnitaire = margeProductionUnitaire;
        this.margeGlobale = margeGlobale;
        this.messageStatus = messageStatus;
        this.typeProduit = typeProduit;
    }
}