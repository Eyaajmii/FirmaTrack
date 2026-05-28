package com.firmatrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import com.firmatrack.model.Veterinaire;

public interface VeterinaireRepository extends JpaRepository<Veterinaire, Long> {
	
    Optional<Veterinaire> findByUserId(Long userId);

    List<Veterinaire> findBySpecialite(String specialite);
    List<Veterinaire> findByDisponibleUrgenceTrue();
    List<Veterinaire> findByDeplacementFermeTrue();
}
