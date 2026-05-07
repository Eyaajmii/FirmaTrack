package com.firmatrack.service;

import java.util.*;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.firmatrack.model.Carnetsante;
import com.firmatrack.repository.CarnetsanteRepository;

@Service
public class CarnetsanteService {

    @Autowired
    private CarnetsanteRepository carnetsanteRepository;

    public Carnetsante saveCarnet(Carnetsante c) {

        if (c.getId() == null) {
            // CREATE ONLY
            if (carnetsanteRepository.existsById(c.getAnimal().getId())) {
                throw new RuntimeException("Cet animal possède déjà un carnet");
            }
        }

        return carnetsanteRepository.save(c);
    }

    public void deleteCarnet(Long idC) {
        carnetsanteRepository.deleteById(idC);
    }

    public Carnetsante getCarnetById(Long idC) {
        return carnetsanteRepository.findById(idC).orElse(null);
    }

    // Carnet d’un animal
    public Optional<Carnetsante> getCarnetByAnimal(Long animalId) {
        return carnetsanteRepository.findByAnimalId(animalId);
    }

    // Tous les carnets des animaux d’un fermier
    public List<Carnetsante> getAllCarnetsByFermier(Long fermierId) {
        return carnetsanteRepository.findByAnimalFermierId(fermierId);
    }

    // Tous les carnets suivis par un vétérinaire
    public List<Carnetsante> getAllCarnetsByVeterinaire(Long veterinaireId) {
        return carnetsanteRepository.findCarnetsByVeterinaireAndRdvConfirme(veterinaireId);
    }

    /* Tous les carnets */
    public List<Carnetsante> getAllCarnets() {
        return carnetsanteRepository.findAll();
    }

}