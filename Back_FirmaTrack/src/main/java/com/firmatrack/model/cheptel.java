package com.firmatrack.model;
import jakarta.persistence.*;
import java.time.LocalDate;
@Entity
@Table(name="cheptels")
public class cheptel {
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
    private LocalDate datenaissance;

    // poids actuel
    private Double poids;

    // couleur
    private String couleur;

    // statut de santé
    private String StatutSanté;

    // statut de l'animal
    // ALIVE / SOLD / DEAD / ARCHIVED
    private String statut;

    // QR code pour identification rapide
    private String qrCode;

    // date entrée dans la ferme
    private LocalDate Dateentre;

    // notes supplémentaires
    @Column(length = 500)
    private String notes;

    // catégorie animal
    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie Categorie;

    // zone dans la ferme
    @ManyToOne
    @JoinColumn(name = "zone_id")
    private Zone zone;

    // lot
    @ManyToOne
    @JoinColumn(name = "lot_id")
    private Lot lot;

    // ferme
    @ManyToOne
    @JoinColumn(name = "fermier_id")
    private fermier fermier;

	public cheptel() {
		super();
	}

	public cheptel(Long id, String chepnumber, String nom, String type, String race, String gender,
			LocalDate datenaissance, Double poids, String couleur, String statutSanté, String statut, String qrCode,
			LocalDate dateentre, String notes, Categorie categorie, Zone zone, Lot lot,
			fermier fermier) {
		super();
		this.id = id;
		this.chepnumber = chepnumber;
		this.nom = nom;
		this.type = type;
		this.race = race;
		this.gender = gender;
		this.datenaissance = datenaissance;
		this.poids = poids;
		this.couleur = couleur;
		StatutSanté = statutSanté;
		this.statut = statut;
		this.qrCode = qrCode;
		Dateentre = dateentre;
		this.notes = notes;
		Categorie = categorie;
		this.zone = zone;
		this.lot = lot;
		this.fermier = fermier;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getChepnumber() {
		return chepnumber;
	}

	public void setChepnumber(String chepnumber) {
		this.chepnumber = chepnumber;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getRace() {
		return race;
	}

	public void setRace(String race) {
		this.race = race;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public LocalDate getDatenaissance() {
		return datenaissance;
	}

	public void setDatenaissance(LocalDate datenaissance) {
		this.datenaissance = datenaissance;
	}

	public Double getPoids() {
		return poids;
	}

	public void setPoids(Double poids) {
		this.poids = poids;
	}

	public String getCouleur() {
		return couleur;
	}

	public void setCouleur(String couleur) {
		this.couleur = couleur;
	}

	public String getStatutSanté() {
		return StatutSanté;
	}

	public void setStatutSanté(String statutSanté) {
		StatutSanté = statutSanté;
	}

	public String getStatut() {
		return statut;
	}

	public void setStatut(String statut) {
		this.statut = statut;
	}

	public String getQrCode() {
		return qrCode;
	}

	public void setQrCode(String qrCode) {
		this.qrCode = qrCode;
	}

	public LocalDate getDateentre() {
		return Dateentre;
	}

	public void setDateentre(LocalDate dateentre) {
		Dateentre = dateentre;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Categorie getCategorie() {
		return Categorie;
	}

	public void setCategorie(Categorie categorie) {
		Categorie = categorie;
	}

	public Zone getZone() {
		return zone;
	}

	public void setZone(Zone zone) {
		this.zone = zone;
	}

	public Lot getLot() {
		return lot;
	}

	public void setLot(Lot lot) {
		this.lot = lot;
	}

	public fermier getFermier() {
		return fermier;
	}

	public void setFermier(fermier fermier) {
		this.fermier = fermier;
	}
    
    
}

