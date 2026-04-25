package com.firmatrack.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.firmatrack.model.RendezVousVeterinaire;
import com.firmatrack.repository.RendezVousVeterinaireRepository;

@Service
public class RendezVousVeterinaireService {

    @Autowired
    private RendezVousVeterinaireRepository rdvRepository;

    public RendezVousVeterinaire prendreRendezVous(RendezVousVeterinaire rdv) {
        rdv.setStatut("Demande");
        return rdvRepository.save(rdv);
    }

    // RDV d'un vet
    public List<RendezVousVeterinaire> getRdvByVeterinaire(Long vetId) {
        return rdvRepository.findByVeterinaireId(vetId);
    }

    // RDV d'un fermier
    public List<RendezVousVeterinaire> getRdvByFermier(Long fermierId) {
        return rdvRepository.findByFermierId(fermierId);
    }

    // RDV d'un animal
    public List<RendezVousVeterinaire> getRdvByAnimal(Long animalId) {
        return rdvRepository.findByAnimalId(animalId);
    }

    public RendezVousVeterinaire updateRendezVousVeterinaire(Long id, RendezVousVeterinaire m) {

        return rdvRepository.findById(id)
                .map(existing -> {
                    existing.setDateRdv(m.getDateRdv());
                    existing.setStatut(m.getStatut());
                    existing.setMotif(m.getMotif());
                    return rdvRepository.save(existing);
                })
                .orElse(null);
    }
    public void deleteRdv(Long id) {

        rdvRepository.deleteById(id);

    }

    // confirmer rdv
    public RendezVousVeterinaire confirmer(Long id) {
        RendezVousVeterinaire rdv = rdvRepository.findById(id).orElse(null);
        if (rdv != null) {
            rdv.setStatut("Confirme");
            return rdvRepository.save(rdv);
        }
        return null;
    }

    public RendezVousVeterinaire terminer(Long id) {

        RendezVousVeterinaire rdv = rdvRepository.findById(id).orElse(null);
        if (rdv != null) {
            rdv.setStatut("Termine");
            return rdvRepository.save(rdv);
        }
        return null;

    }
    public List<RendezVousVeterinaire> getRdvByStatut(String statut) {
        return rdvRepository.findByStatut(statut);
    }
}