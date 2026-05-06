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
    public List<RendezVousVeterinaire> getAll() {
        return rdvRepository.findAll();
    }
    public boolean existsByVeterinaireAndDate(Long vetId, LocalDateTime dateRdv) {
        return rdvRepository.existsByVeterinaireIdAndDateRdv(vetId, dateRdv);
    }

    // RDV d'un vet
    public List<RendezVousVeterinaire> getRdvByVeterinaire(Long vetId) {
        return rdvRepository.findByVeterinaireId(vetId);
    }

    // RDV d'un fermier
    public List<RendezVousVeterinaire> getRdvByFermier(Long fermierId) {
        return rdvRepository.findByAnimal_Fermier_Id(fermierId);
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
        return rdvRepository.findById(id)
                .map(rdv -> {
                    rdv.setStatut("Confirme");
                    return rdvRepository.save(rdv);
                })
                .orElseThrow(() -> new RuntimeException("RDV introuvable : " + id));
    }

    public RendezVousVeterinaire terminer(Long id) {
        return rdvRepository.findById(id)
                .map(rdv -> {
                    rdv.setStatut("Termine");
                    return rdvRepository.save(rdv);
                })
                .orElseThrow(() -> new RuntimeException("RDV introuvable : " + id));
    }   public List<RendezVousVeterinaire> getRdvByStatut(String statut) {
        return rdvRepository.findByStatut(statut);
    }
}