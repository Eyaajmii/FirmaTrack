package com.firmatrack.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.*;

@Entity
@Table(name="cheptels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cheptel {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // numéro d'identification unique
    @Column(unique = true)
    private String chepnumber;

    // nom de l'animal
    private String nom;

    // type : cow, sheep, goat
    private String type;

    // race
    private String race;

    // sexe
    private String gender;

    // date de naissance
    private LocalDate dateNaissance;

    // poids actuel
    private Double poids;

    // couleur
    private String couleur;

    // statut de santé
    private String statutSante; 

    // statut de l'animal
    // ALIVE / SOLD / DEAD / ARCHIVED
    private String statut;

    // QR code pour identification rapide
    private String qrCode;

    // date entrée dans la ferme
    private LocalDate dateEntre;

    // notes supplémentaires
    @Column(length = 500)
    private String notes;

        // catégorie animal
        @ManyToOne
        @JoinColumn(name = "categorie_id")
        private Categorie categorie;
    
        // zone dans la ferme
        @ManyToOne
        @JoinColumn(name = "zone_id")
        private Zone zone;
    
        // lot
        @ManyToOne
        @JoinColumn(name = "lot_id", nullable = true)
        @JsonIgnore
        private Lot lot;
    
        // ferme
        @ManyToOne
        @JoinColumn(name = "fermier_id")
        @JsonIgnoreProperties({"user", "cheptels"})
        private Fermier fermier;
        @OneToOne(mappedBy = "animal")
        @JsonIgnore
        private Carnetsante carnetSante;
    }