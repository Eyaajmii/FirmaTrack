package com.firmatrack.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.firmatrack.repository.FermierRepository;
import com.firmatrack.model.Fermier;

import java.util.List;
@Service
public class FermierService {
	@Autowired
    private FermierRepository farmerRepository;

    public List<Fermier> getAllFarmers() {
        return farmerRepository.findAll();
    }

    public Fermier getFarmerById(Long id) {
        return farmerRepository.findById(id).orElse(null);
    }

    public Fermier getFarmerByFarmName(String nomFerme) {
        return farmerRepository.findByNomFerme(nomFerme);
    }

    public Fermier saveFarmer(Fermier farmer) {
        return farmerRepository.save(farmer);
    }

    public void deleteFarmer(Long id) {
        farmerRepository.deleteById(id);
    }
}