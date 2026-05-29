package com.firmatrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.firmatrack.model.Fermier;
import com.firmatrack.model.ProductionLait;
import com.firmatrack.repository.FermierRepository;
import com.firmatrack.repository.ProductionLaitRepository;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ProductionLaitService {

    @Autowired
    private ProductionLaitRepository productionLaitRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private FermierRepository fermierRepository;

    // Méthode pour enregistrer une nouvelle production
    public ProductionLait enregistrerProduction(ProductionLait production) {
        // Si la date n'est pas précisée, on met la date d'aujourd'hui par défaut
        if (production.getDateProduction() == null) {
            production.setDateProduction(LocalDate.now());
        }
        return productionLaitRepository.save(production);
    }
    
    public Optional<ProductionLait> getById(Long id) {         
        return productionLaitRepository.findById(id);
    }
    
    public List<ProductionLait> getToutesLesProductions() {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        com.firmatrack.model.User user = userService.getUserByEmail(email);
        Fermier fermier = fermierRepository.findByUserId(user.getId()).orElse(null);
        if (fermier == null) return Collections.emptyList();
        return productionLaitRepository.findByCheptelFermierId(fermier.getId());
    }
    
    public List<ProductionLait> getProductionParAnimal(Long cheptelId) {
        return productionLaitRepository.findByCheptelId(cheptelId);
    }
    
 // : par lot
    public List<ProductionLait> getProductionParLot(Long lotId) {
        return productionLaitRepository.findByLotId(lotId);
    }
    
    //update
    public ProductionLait updateProduction(Long id, ProductionLait updated) {  // ✅ NOUVEAU
        return productionLaitRepository.findById(id).map(existing -> {
            existing.setDateProduction(updated.getDateProduction());
            existing.setQuantiteLitre(updated.getQuantiteLitre());
            existing.setCheptel(updated.getCheptel());
            existing.setLot(updated.getLot());
            return productionLaitRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Production introuvable : " + id));
    }
    
    //Supression
    public void deleteProduction(Long id) {                     
        productionLaitRepository.deleteById(id);
    }
    
    

    
    
}