package com.firmatrack.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.firmatrack.model.Veterinaire;
import com.firmatrack.repository.VeterinaireRepository;

@Service
public class VeterinaireService {
    @Autowired
    private VeterinaireRepository veterinaireRepository;
    public Veterinaire saveVeterinaire(Veterinaire v) {
        return veterinaireRepository.save(v);
    }
    public void deleteVeterinaire(Long id) {
        veterinaireRepository.deleteById(id);
    }
    public Veterinaire getById(Long id) {
        return veterinaireRepository.findById(id).orElse(null);
    }
    public List<Veterinaire> getAll() {
        return veterinaireRepository.findAll();
    }
    public List<Veterinaire> getBySpecialite(String specialite) {
        return veterinaireRepository.findBySpecialite(specialite);
    }
    public List<Veterinaire> getUrgence() {
        return veterinaireRepository.findByDisponibleUrgenceTrue();
    }
    public List<Veterinaire> getDeplacementFerme() {
        return veterinaireRepository.findByDeplacementFermeTrue();
    }

}