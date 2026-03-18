package com.firmatrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firmatrack.model.Cheptel;

public interface cheptelRepository extends JpaRepository<Cheptel, Long> {
	//Rechercher par le numero d'un animal
    Cheptel findByChepnumber(String chepnumber);
	// Filtrer par status
    List<Cheptel> findByStatut(String statut);
    // Filtrer par lot
    List<Cheptel> findByLotId(Long lotId);
    // Filtrer par zone
    List<Cheptel> findByZoneId(Long zoneId);
    // Filtrer par catégorie
    List<Cheptel> findByCategorieId(Long categorieId);
}
