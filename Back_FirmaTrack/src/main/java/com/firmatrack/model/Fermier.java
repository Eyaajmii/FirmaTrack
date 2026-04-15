package com.firmatrack.model;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "fermier")
@Getter
@Setter
public class Fermier  {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    // nom de la ferme
    private String nomFerme;
    // localisation
    private String localisation;
    // surface de la ferme
    private Double surfaceFerme;
    // date création ferme
    private LocalDate DateCreationFerme;

    public Fermier() {
    }

}
