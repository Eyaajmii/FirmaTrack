package com.firmatrack.repository;

import com.firmatrack.model.Epidemie;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EpidemieRepository extends JpaRepository<Epidemie, Long> {
    // Récupérer les épidémies actives d'une région pour la US 76
    List<Epidemie> findByVeterinaireIdOrderByDateSignalementDesc(Long veterinaireId);
}