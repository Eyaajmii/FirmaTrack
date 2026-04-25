package com.firmatrack.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.firmatrack.model.Maladie;
import com.firmatrack.model.Traitement;
import com.firmatrack.repository.MaladieRepository;
import com.firmatrack.repository.TraitementRepository;

@Service
public class TraitementService {

    @Autowired
    private TraitementRepository traitementRepository;
    @Autowired
    private MaladieRepository maladieRepository;

    public Traitement ajouterTraitement(Long maladieId,Traitement t) {
        Maladie m = maladieRepository.findById(maladieId).orElse(null);
        if (m == null) {
            return null;
        }
        t.setMaladie(m);
        t.setStatut("En cours");
        return traitementRepository.save(t);
    }
    public Traitement updateTraitement(Long id, Traitement m) {
        Traitement existing = traitementRepository.findById(id).orElse(null);
        if (existing == null) {
            return null;
        }
        existing.setDateDebut(m.getDateDebut());
        existing.setDateFin(m.getDateFin());
        existing.setDescription(m.getDescription());
        existing.setMaladie(m.getMaladie());
        existing.setMedicaments(m.getMedicaments());
        existing.setRemarques(m.getRemarques());
        existing.setStatut(m.getStatut());
        return traitementRepository.save(existing);
    }
    public void deleteTraitement(Long id) {
        traitementRepository.deleteById(id);
    }
    public Traitement getTraitementById(Long id) {
        return traitementRepository.findById(id).orElse(null);
    }
    public List<Traitement> getAllTraitements() {
        return traitementRepository.findAll();
    }
    public List<Traitement> getByMaladie(Long maladieId) {
        return traitementRepository.findByMaladieId(maladieId);
    }
    public List<Traitement> getByStatut(String statut) {
        return traitementRepository.findByStatut(statut);
    }
    public Traitement terminerTraitement(Long id) {
        Traitement t = traitementRepository.findById(id).orElse(null);
        if (t != null) {
            t.setStatut("Terminé");
            return traitementRepository.save(t);
        }
        return null;
    }

}