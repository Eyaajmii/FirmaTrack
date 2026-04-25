package com.firmatrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import com.firmatrack.model.Traitement;

public interface TraitementRepository extends JpaRepository<Traitement, Long> {
    List<Traitement> findByMaladieId(Long maladieId);
    List<Traitement> findByStatut(String statut);
}
