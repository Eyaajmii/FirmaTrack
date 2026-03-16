package com.firmatrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firmatrack.model.Zone;

public interface ZoneRepository extends JpaRepository <Zone,Long> {
	Zone findByNom(String nom);
}
