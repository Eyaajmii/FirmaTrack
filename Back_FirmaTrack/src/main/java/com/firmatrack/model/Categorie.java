package com.firmatrack.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Entity
@Table(name="categories")
@Getter
@Setter
public class Categorie {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	//Vache,mouton....
	private String nom;
	public Categorie() {
		
	}
}
