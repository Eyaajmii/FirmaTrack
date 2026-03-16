package com.firmatrack.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firmatrack.model.Categorie;

public interface CategorieRepository extends JpaRepository<Categorie,Long> {
	Categorie findByNom(String nom);
}
