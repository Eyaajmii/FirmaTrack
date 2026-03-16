package com.firmatrack.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firmatrack.model.cheptel;

public interface cheptelRepository extends JpaRepository<cheptel, Long> {
	//Rechercher par le numero d'un animal
	cheptel findByCheptelNumber(String chepnumber);
	// Filtrer par status
    List<cheptel> findByStatut(String statut);
    // Filtrer par lot
    List<cheptel> findByLotId(Long lotId);
    // Filtrer par zone
    List<cheptel> findByZoneId(Long zoneId);
    // Filtrer par catégorie
    List<cheptel> findByCategoryId(Long categorieId);
}
