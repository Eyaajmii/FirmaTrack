package com.firmatrack.model;
import jakarta.persistence.*;
@Entity
@Table(name="lots")
//Regroupement d'animaux(ex:lot veaux/lot vaches laitiere/lot moutons jeunes..)
public class Lot {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String description;

    public Lot() {}

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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
    
}
