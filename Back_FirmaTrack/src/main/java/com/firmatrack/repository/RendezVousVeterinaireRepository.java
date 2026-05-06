package com.firmatrack.repository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.firmatrack.model.RendezVousVeterinaire;

public interface RendezVousVeterinaireRepository extends JpaRepository<RendezVousVeterinaire, Long> {
	List<RendezVousVeterinaire> findByAnimal_Fermier_Id(Long fermierId);	
	List<RendezVousVeterinaire> findByVeterinaireId(Long vetId);
	List<RendezVousVeterinaire> findByAnimalId(Long animalId);
    List<RendezVousVeterinaire> findByStatut(String statut);
	boolean existsByVeterinaireIdAndDateRdv(Long vetId, LocalDateTime dateRdv);
	
}
