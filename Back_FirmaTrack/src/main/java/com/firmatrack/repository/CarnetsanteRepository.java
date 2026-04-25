package com.firmatrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.firmatrack.model.Carnetsante;
import java.util.*;

public interface CarnetsanteRepository extends JpaRepository<Carnetsante, Long> {
    // Rechercher par le numero d'un animal
    Optional<Carnetsante> findByAnimalId(Long animalId);

    /* Tous les carnets des animaux d’un fermier */
    List<Carnetsante> findByAnimalFermierId(Long fermierId);

    /* Carnets suivis par un vétérinaire via maladies */
    List<Carnetsante> findDistinctByMaladiesVeterinaireId(Long veterinaireId);

    /* Carnets suivis via vaccinations */
    List<Carnetsante> findDistinctByVaccinationsVeterinaireId(Long veterinaireId);
    
}
