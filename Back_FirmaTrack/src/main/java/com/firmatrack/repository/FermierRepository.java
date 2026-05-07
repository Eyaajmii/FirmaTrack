package com.firmatrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firmatrack.model.Fermier;
import java.util.Optional;

public interface FermierRepository extends JpaRepository <Fermier,Long> {
	Fermier findByNomFerme(String nomFerme);
	
	Optional<Fermier> findByUserId(Long userId);
}
