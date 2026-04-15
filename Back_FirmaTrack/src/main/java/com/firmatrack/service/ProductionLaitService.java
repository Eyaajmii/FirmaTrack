package com.firmatrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.firmatrack.model.ProductionLait;
import com.firmatrack.repository.ProductionLaitRepository;
import java.time.LocalDate;
import java.util.List;

@Service
public class ProductionLaitService {

    @Autowired
    private ProductionLaitRepository productionLaitRepository;

    // Méthode pour enregistrer une nouvelle production
    public ProductionLait enregistrerProduction(ProductionLait production) {
        // Si la date n'est pas précisée, on met la date d'aujourd'hui par défaut
        if (production.getDateProduction() == null) {
            production.setDateProduction(LocalDate.now());
        }
        return productionLaitRepository.save(production);
    }
    
    public List<ProductionLait> getToutesLesProductions() {
        return productionLaitRepository.findAll();
    }
    
    public List<ProductionLait> getProductionParAnimal(Long cheptelId) {
        return productionLaitRepository.findByCheptelId(cheptelId);
    }
    
 // : par lot
    public List<ProductionLait> getProductionParLot(Long lotId) {
        return productionLaitRepository.findByLotId(lotId);
    }
    
    

    
    
}