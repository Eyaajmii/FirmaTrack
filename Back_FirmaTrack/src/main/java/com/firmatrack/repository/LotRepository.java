package com.firmatrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firmatrack.model.Lot;

public interface LotRepository extends JpaRepository <Lot,Long> {
	Lot findByNom(String nom);
}

