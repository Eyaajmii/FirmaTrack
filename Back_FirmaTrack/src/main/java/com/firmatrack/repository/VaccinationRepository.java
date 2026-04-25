package com.firmatrack.repository;

import java.time.LocalDate;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

import com.firmatrack.model.Vaccination;

public interface VaccinationRepository extends JpaRepository<Vaccination, Long> {
    List<Vaccination> findByCarnetSanteId(Long carnetId);
    List<Vaccination> findByStatut(String statut);
    List<Vaccination> findByDatePlanifieeBefore(LocalDate date);
    List<Vaccination> findByCarnetSanteAnimalId(Long animalId);
    List<Vaccination> findByCarnetSanteAnimalFermierId(Long fermierId);
}
