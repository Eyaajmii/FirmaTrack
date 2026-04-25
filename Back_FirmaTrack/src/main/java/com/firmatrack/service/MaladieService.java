package com.firmatrack.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.firmatrack.model.Maladie;
import com.firmatrack.model.Carnetsante;
import com.firmatrack.repository.MaladieRepository;
import com.firmatrack.repository.CarnetsanteRepository;

@Service
public class MaladieService {

    @Autowired
    private MaladieRepository maladieRepository;

    @Autowired
    private CarnetsanteRepository carnetsanteRepository;

    public Maladie ajouterMaladie(Long carnetId,Maladie m) {
        Carnetsante carnet = carnetsanteRepository.findById(carnetId).orElse(null);
        if (carnet == null) {
            return null;
        }
        m.setCarnetSante(carnet);
        return maladieRepository.save(m);
    }
    public Maladie updateMaladie(Long id, Maladie m) {
        Maladie existing = maladieRepository.findById(id).orElse(null);
    
        if (existing == null) {
            return null;
        }
    
        existing.setNomMaladie(m.getNomMaladie());
        existing.setSymptomes(m.getSymptomes());
        existing.setDiagnostic(m.getDiagnostic());
        existing.setGravite(m.getGravite());
        existing.setStatut(m.getStatut());
        existing.setRemarques(m.getRemarques());
        existing.setDateDetection(m.getDateDetection());
        existing.setVeterinaire(m.getVeterinaire());
    
        return maladieRepository.save(existing);
    }
    public void deleteMaladie(Long id) {
        maladieRepository.deleteById(id);
    }
    public Maladie getMaladieById(Long id) {
        return maladieRepository.findById(id).orElse(null);
    }
    public List<Maladie> getAllMaladies() {
        return maladieRepository.findAll();
    }
    //Maladies d un carnet
    public List<Maladie> getByCarnet(Long carnetId) {
        return maladieRepository.findByCarnetSanteId(carnetId);
    }
    //Maladies dun vet
    public List<Maladie> getByVeterinaire(Long vetId) {
        return maladieRepository.findByVeterinaireId(vetId);
    }
    public List<Maladie> getByStatut(String statut) {
        return maladieRepository.findByStatut(statut);
    }

    public List<Maladie> getActives() {
        return maladieRepository.findByStatut("Active");
    }

}