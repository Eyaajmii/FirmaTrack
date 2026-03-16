package com.firmatrack.model;
import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "fermier")
public class fermier  {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id")
    private user user;
    // nom de la ferme
    private String nomFerme;
    // localisation
    private String localisation;
    // surface de la ferme
    private Double surfaceFerme;
    // date création ferme
    private LocalDate DateCreationFerme;

    public fermier() {
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNomFerme() {
		return nomFerme;
	}

	public void setNomFerme(String nomFerme) {
		this.nomFerme = nomFerme;
	}

	public String getLocalisation() {
		return localisation;
	}

	public void setLocalisation(String localisation) {
		this.localisation = localisation;
	}

	public Double getSurfaceFerme() {
		return surfaceFerme;
	}

	public void setSurfaceFerme(Double surfaceFerme) {
		this.surfaceFerme = surfaceFerme;
	}

	public LocalDate getDateCreationFerme() {
		return DateCreationFerme;
	}

	public void setDateCreationFerme(LocalDate dateCreationFerme) {
		DateCreationFerme = dateCreationFerme;
	}
    
}
