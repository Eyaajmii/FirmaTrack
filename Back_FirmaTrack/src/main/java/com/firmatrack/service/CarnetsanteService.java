package com.firmatrack.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.firmatrack.model.Carnetsante;
import com.firmatrack.repository.CarnetsanteRepository;

@Service
public class CarnetsanteService {

    @Autowired
    private CarnetsanteRepository carnetsanteRepository;

    public Carnetsante saveCarnet(Carnetsante c) {
        if (c.getAnimal() != null && carnetsanteRepository.findByAnimalId(c.getAnimal().getId()).isPresent()) {
            throw new RuntimeException("Cet animal possède déjà un carnet");
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
        List<Carnetsante> viaMaladies = carnetsanteRepository.findDistinctByMaladiesVeterinaireId(veterinaireId);
        List<Carnetsante> viaVaccins = carnetsanteRepository.findDistinctByVaccinationsVeterinaireId(veterinaireId);
        LinkedHashSet<Carnetsante> unique = new LinkedHashSet<>();
        unique.addAll(viaMaladies);
        unique.addAll(viaVaccins);
        return new ArrayList<>(unique);

    }

    /* Tous les carnets */
    public List<Carnetsante> getAllCarnets() {
        return carnetsanteRepository.findAll();
    }

}