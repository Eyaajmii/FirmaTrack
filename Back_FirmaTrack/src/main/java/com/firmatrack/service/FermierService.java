package com.firmatrack.service;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.firmatrack.repository.FermierRepository;
import com.firmatrack.model.fermier;

import java.util.List;
@Service
public class FermierService {
	@Autowired
    private FermierRepository farmerRepository;

    public List<fermier> getAllFarmers() {
        return farmerRepository.findAll();
    }

    public fermier getFarmerById(Long id) {
        return farmerRepository.findById(id).orElse(null);
    }

    public fermier getFarmerByFarmName(String nomFerme) {
        return farmerRepository.findByNomFerme(nomFerme);
    }

    public fermier saveFarmer(fermier farmer) {
        return farmerRepository.save(farmer);
    }

    public void deleteFarmer(Long id) {
        farmerRepository.deleteById(id);
    }
}