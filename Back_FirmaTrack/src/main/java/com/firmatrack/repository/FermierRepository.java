package com.firmatrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firmatrack.model.fermier;

public interface FermierRepository extends JpaRepository <fermier,Long> {
	fermier findByNomFerme(String nomFerme);
}
