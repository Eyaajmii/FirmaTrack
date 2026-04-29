package com.firmatrack.service;

import java.time.LocalDate;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.firmatrack.model.Carnetsante;
import com.firmatrack.model.Vaccination;
import com.firmatrack.repository.CarnetsanteRepository;
import com.firmatrack.repository.VaccinationRepository;

@Service
public class VaccinationService {

    @Autowired
    private VaccinationRepository vaccinationRepository;

    @Autowired
    private CarnetsanteRepository carnetsanteRepository;

    public Vaccination ajouterVaccination(Long carnetId, Vaccination v) {
        Carnetsante carnet = carnetsanteRepository.findById(carnetId).orElse(null);
        if (carnet == null) {
            return null;
        }
        v.setCarnetSante(carnet);
        v.setStatut("Planifiee");
        return vaccinationRepository.save(v);
    }
    public Vaccination updateVaccination(Long id, Vaccination m) {
        Vaccination existing = vaccinationRepository.findById(id).orElse(null);
        if (existing == null) {
            return null;
        }
        existing.setCarnetSante(m.getCarnetSante());
        existing.setDatePlanifiee(m.getDatePlanifiee());
        existing.setDateRealisee(m.getDateRealisee());
        existing.setObservations(m.getObservations());
        existing.setRappel(m.getRappel());
        existing.setStatut(m.getStatut());
        existing.setVaccin(m.getVaccin());
        return vaccinationRepository.save(existing);
    }
    public void deleteVaccination(Long id) {
        vaccinationRepository.deleteById(id);
    }

    public Vaccination getVaccinationById(Long id) {
        return vaccinationRepository.findById(id).orElse(null);
    }

    public List<Vaccination> getAllVaccinations() {
        return vaccinationRepository.findAll();
    }

    public List<Vaccination> getByCarnet(Long carnetId) {
        return vaccinationRepository.findByCarnetSanteId(carnetId);
    }

    public List<Vaccination> getByStatut(String statut) {
        return vaccinationRepository.findByStatut(statut);
    }

    public List<Vaccination> getVaccinationsAvenir() {
        return vaccinationRepository.findByDatePlanifieeBefore(LocalDate.now().plusDays(7));
    }

    public List<Vaccination> getVaccinationsAvenirByAnimal(Long animalId) {
        return vaccinationRepository.findByCarnetSanteAnimalId(animalId).stream()
        .filter(v -> v.getDatePlanifiee()
        .isBefore(LocalDate.now().plusDays(7)))
        .toList();
    }

    public List<Vaccination> getVaccinationsAvenirByFermier(Long fermierId) {
        return vaccinationRepository.findByCarnetSanteAnimalFermierId(fermierId)
        .stream()
        .filter(v -> v.getDatePlanifiee()
        .isBefore(LocalDate.now().plusDays(7))).toList();
    }
    public Vaccination marquerRealisee(Long id) {
        Vaccination v = vaccinationRepository.findById(id).orElse(null);
        if (v != null) {
            v.setStatut("Realisee");
            v.setDateRealisee(LocalDate.now());
            return vaccinationRepository.save(v);
        }
        return null;
    }

}