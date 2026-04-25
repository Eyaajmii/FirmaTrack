package com.firmatrack.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.firmatrack.model.RendezVousVeterinaire;

public interface RendezVousVeterinaireRepository extends JpaRepository<RendezVousVeterinaire, Long> {
	List<RendezVousVeterinaire> findByFermierId(Long fermierId);
	List<RendezVousVeterinaire> findByVeterinaireId(Long vetId);
	List<RendezVousVeterinaire> findByAnimalId(Long animalId);
    List<RendezVousVeterinaire> findByStatut(String statut);
}
