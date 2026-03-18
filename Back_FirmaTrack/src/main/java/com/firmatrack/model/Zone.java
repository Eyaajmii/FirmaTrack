package com.firmatrack.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
@Entity
@Table(name="Zones")
@Getter
@Setter
//Localisation des animaux dans la ferme
public class Zone {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String description;

    public Zone() {}
}
