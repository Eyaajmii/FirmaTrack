package com.firmatrack.service;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.firmatrack.model.Medicament;
import com.firmatrack.model.Traitement;
import com.firmatrack.repository.MedicamentRepository;
import com.firmatrack.repository.TraitementRepository;

@Service
public class MedicamentService {
    @Autowired
    private MedicamentRepository medicamentRepository;
    @Autowired
    private TraitementRepository traitementRepository;
    public Medicament ajouterMedicament(Long traitementId,Medicament m) {
        Traitement t = traitementRepository.findById(traitementId).orElse(null);
        if (t == null) {
            return null;
        }
        m.setTraitement(t);
        return medicamentRepository.save(m);
    }
    public Medicament updateMedicament(Long id, Medicament m) {
        Medicament existing = medicamentRepository.findById(id).orElse(null);
    
        if (existing == null) {
            return null;
        }
    
        existing.setNom(m.getNom());
        existing.setDosage(m.getDosage());
        existing.setFrequence(m.getFrequence());
        existing.setTraitement(m.getTraitement());
        existing.setVoieAdministration(m.getVoieAdministration());
        return medicamentRepository.save(existing);
    }
    public void deleteMedicament(Long id) {
        medicamentRepository.deleteById(id);
    }
    public Medicament getMedicamentById(Long id) {
        return medicamentRepository.findById(id).orElse(null);
    }
    public List<Medicament> getAllMedicaments() {
        return medicamentRepository.findAll();
    }
    public List<Medicament> getByTraitement(Long traitementId) {
        return medicamentRepository.findByTraitementId(traitementId);
    }

}