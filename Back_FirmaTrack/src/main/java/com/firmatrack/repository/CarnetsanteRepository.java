package com.firmatrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.firmatrack.model.Carnetsante;
import java.util.*;

public interface CarnetsanteRepository extends JpaRepository<Carnetsante, Long> {
    Optional<Carnetsante> findByAnimalId(Long animalId);
    List<Carnetsante> findByAnimalFermierId(Long fermierId);
    List<Carnetsante> findDistinctByMaladiesVeterinaireId(Long veterinaireId);
    List<Carnetsante> findDistinctByVaccinationsVeterinaireId(Long veterinaireId);
    @Query("""
    		SELECT DISTINCT c FROM Carnetsante c
    		JOIN c.animal a
    		JOIN RendezVousVeterinaire r ON r.animal.id = a.id
    		WHERE r.veterinaire.id = :vetId
    		AND r.statut = com.firmatrack.model.StatutRendezVous.Confirme
    		""")
    		List<Carnetsante> findCarnetsByVeterinaireAndRdvConfirme(Long vetId);
}
