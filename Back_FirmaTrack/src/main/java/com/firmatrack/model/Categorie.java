package com.firmatrack.model;
import jakarta.persistence.*;
@Entity
@Table(name="categories")
public class Categorie {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	//Vache,mouton....
	private String nom;
	public Categorie() {
		
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getNom() {
		return nom;
	}
	public void setNom(String nom) {
		this.nom = nom;
	}
	
}
