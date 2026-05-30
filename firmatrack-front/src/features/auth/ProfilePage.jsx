import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import authService from "./authService";
import LocationPicker from "../veterinaire/components/LocationPicker";

const ProfilePage = () => {
  const userRole = localStorage.getItem("user_role");
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    telephone: "",
    adresse: "",

    // Éleveur (Fermier - US 62)
    nomFerme: "",
    surfaceFerme: "",
    localisationFerme: "",
    dateCreationFerme: "",

    // Vétérinaire (US 63)
    specialite: "",
    nomCabinet: "",
    horairesConsultation: "",
    universite: "",
    anneesExperience: "",
    disponibleUrgence: false,
    tarifConsultation: "",
    moyenTransport: "",
    localisationCabinet: "",
    latitudeCabinet: null,
    longitudeCabinet: null,

    // Sécurité (US 65)
    nouveauPassword: "",
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  // US 64 : Charger les données depuis l'API
  const loadProfileData = async () => {
    try {
      const data = await authService.getMyProfile();
      setFormData({
        name: data.name || "",
        telephone: data.telephone || "",
        adresse: data.adresse || "",
        // Éleveur
        nomFerme: data.nomFerme || "",
        surfaceFerme: data.surfaceFerme || "",
        localisationFerme: data.localisationFerme || "",
        dateCreationFerme: data.dateCreationFerme || "",
        // Vétérinaire
        specialite: data.specialite || "",
        nomCabinet: data.nomCabinet || "",
        horairesConsultation: data.horairesConsultation || "",
        universite: data.universite || "",
        anneesExperience: data.anneesExperience || "",
        disponibleUrgence: data.disponibleUrgence || false,
        tarifConsultation: data.tarifConsultation || "",
        moyenTransport: data.moyenTransport || "",
        localisationCabinet: data.localisationCabinet || "",
        latitudeCabinet: data.latitudeCabinet || null,
        longitudeCabinet: data.longitudeCabinet || null,
        nouveauPassword: "",
      });
    } catch (err) {
      toast.error("Erreur de connexion lors du chargement de votre profil.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile({
        ...formData,
        latitudeCabinet: formData.latitudeCabinet,
        longitudeCabinet: formData.longitudeCabinet,
      });
      toast.success("Profil mis à jour avec succès ! ✨");

      if (formData.name) {
        localStorage.setItem("user_name", formData.name);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement des modifications.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX PRINCIPAL : setter fonctionnel pour éviter la closure stale
  const handleGPSDirect = () => {
    if (!navigator.geolocation) {
      toast.error("❌ La géolocalisation n'est pas supportée par ce navigateur.");
      return;
    }

    toast.loading("📡 Récupération de votre position...", { id: "gps" });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();

          // ✅ Setter fonctionnel => toujours le state le plus récent
          setFormData((prev) => ({
            ...prev,
            latitudeCabinet: lat,
            longitudeCabinet: lng,
            localisationCabinet: data.display_name || `${lat}, ${lng}`,
          }));

          toast.success("📍 Position GPS enregistrée !", { id: "gps" });
        } catch (err) {
          // Si Nominatim échoue, on enregistre quand même lat/lng
          setFormData((prev) => ({
            ...prev,
            latitudeCabinet: lat,
            longitudeCabinet: lng,
            localisationCabinet: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          }));
          toast.success("📍 Coordonnées GPS enregistrées.", { id: "gps" });
        }
      },
      (err) => {
        toast.dismiss("gps");
        // Messages d'erreur clairs selon le code
        const messages = {
          1: "❌ Permission refusée. Autorisez la localisation dans votre navigateur.",
          2: "❌ Position indisponible. Vérifiez votre GPS.",
          3: "❌ Délai dépassé. Réessayez.",
        };
        toast.error(messages[err.code] || `❌ Erreur GPS : ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div
      style={{
        padding: "2rem 3rem",
        backgroundColor: "#faf9f6",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <Toaster position="top-center" />

      <header style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#1a1a18",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          Mon Profil & Configuration
        </h1>
        <p style={{ fontSize: "14px", color: "#7a7a74", marginTop: "4px" }}>
          Gérez vos informations personnelles, professionnelles et de sécurité.
        </p>
      </header>

      <div style={styles.card}>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* SECTION 1 : INFOS PERSOS (US 64) */}
          <div style={styles.sectionHeader}>Informations personnelles</div>
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>Nom complet</label>
              <input
                type="text"
                name="name"
                style={styles.input}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={styles.label}>Téléphone</label>
              <input
                type="text"
                name="telephone"
                style={styles.input}
                value={formData.telephone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div style={{ maxWidth: "400px" }}>
            <label style={styles.label}>Adresse / Ville</label>
            <input
              type="text"
              name="adresse"
              placeholder="Ex: Tunis, Ariana..."
              style={styles.input}
              value={formData.adresse}
              onChange={handleChange}
            />
          </div>

          {/* SECTION 2 : ÉLEVEUR (US 62) */}
          {(userRole === "FERMIER" || userRole === "ELEVEUR") && (
            <>
              <div style={styles.sectionHeader}>Détails de la Ferme</div>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Nom de la Ferme</label>
                  <input
                    type="text"
                    name="nomFerme"
                    style={styles.inputSpec}
                    value={formData.nomFerme}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label style={styles.label}>Surface (Hectares)</label>
                  <input
                    type="number"
                    name="surfaceFerme"
                    style={styles.inputSpec}
                    value={formData.surfaceFerme}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Localisation de la ferme</label>
                  <input
                    type="text"
                    name="localisationFerme"
                    placeholder="Ex: Béja, Jendouba..."
                    style={styles.inputSpec}
                    value={formData.localisationFerme}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label style={styles.label}>Date de création de la ferme</label>
                  <input
                    type="date"
                    name="dateCreationFerme"
                    style={styles.inputSpec}
                    value={formData.dateCreationFerme}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          {/* SECTION 3 : VÉTÉRINAIRE (US 63) */}
          {userRole === "VETERINAIRE" && (
            <>
              <div style={styles.sectionHeaderVeto}>
                Profil Professionnel & Cabinet
              </div>

              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Spécialité vétérinaire</label>
                  <input
                    type="text"
                    name="specialite"
                    placeholder="Ex: Bovins, Équidés..."
                    style={styles.inputSpecVeto}
                    value={formData.specialite}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label style={styles.label}>Nom du Cabinet / Clinique</label>
                  <input
                    type="text"
                    name="nomCabinet"
                    placeholder="Ex: Cabinet Vétérinaire El Amen"
                    style={styles.inputSpecVeto}
                    value={formData.nomCabinet}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Localisation Cabinet + Boutons GPS */}
              <div>
                <label style={styles.label}>Localisation du Cabinet</label>
                <input
                  type="text"
                  name="localisationCabinet"
                  placeholder="Ex: Rue de l'Indépendance, Fouchana"
                  style={styles.inputSpecVeto}
                  value={formData.localisationCabinet}
                  onChange={handleChange}
                />

                {/* Affichage lat/lng en temps réel sous l'input */}
                {(formData.latitudeCabinet || formData.longitudeCabinet) && (
                  <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                    📌 Lat : {formData.latitudeCabinet?.toFixed(6)} | Lng :{" "}
                    {formData.longitudeCabinet?.toFixed(6)}
                  </p>
                )}

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  {/* ✅ Bouton GPS Auto corrigé */}
                  <button
                    type="button"
                    onClick={handleGPSDirect}
                    style={{
                      background: "linear-gradient(135deg,#2563eb,#1e40af)",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "none",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    📍 Auto GPS (rapide)
                  </button>

                  {/* Bouton Ouvrir Map */}
                  <button
                    type="button"
                    onClick={() => setShowMap(true)}
                    style={{
                      background: "linear-gradient(135deg,#059669,#047857)",
                      color: "white",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "none",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    🗺️ Choisir sur la carte
                  </button>
                </div>
              </div>

              {/* ✅ Modal carte corrigée */}
              {showMap && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.6)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "80%",
                      maxWidth: "700px",
                      background: "#fff",
                      borderRadius: "16px",
                      padding: "24px",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>
                        📍 Sélectionnez la localisation du cabinet
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowMap(false)}
                        style={{
                          background: "#f3f4f6",
                          border: "none",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        ✕ Fermer
                      </button>
                    </div>

                    {/* ✅ onSelect corrigé avec setter fonctionnel */}
                    <LocationPicker
                      onSelect={({ position, address }) => {
                        setFormData((prev) => ({
                          ...prev,
                          localisationCabinet: address || `${position?.lat}, ${position?.lng}`,
                          latitudeCabinet: position?.lat ?? null,
                          longitudeCabinet: position?.lng ?? null,
                        }));
                        setShowMap(false);
                        toast.success("📍 Localisation carte enregistrée !");
                      }}
                    />
                  </div>
                </div>
              )}

              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Université d'obtention du diplôme</label>
                  <input
                    type="text"
                    name="universite"
                    placeholder="Ex: ENMV Sidi Thabet"
                    style={styles.inputSpecVeto}
                    value={formData.universite}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label style={styles.label}>Années d'expérience</label>
                  <input
                    type="number"
                    name="anneesExperience"
                    placeholder="Ex: 5"
                    style={styles.inputSpecVeto}
                    value={formData.anneesExperience}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>
                    Tarif de Consultation Standard (DT)
                  </label>
                  <input
                    type="number"
                    step="0.500"
                    name="tarifConsultation"
                    placeholder="0.000"
                    style={styles.inputSpecVeto}
                    value={formData.tarifConsultation}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label style={styles.label}>Moyen de transport</label>
                  <input
                    type="text"
                    name="moyenTransport"
                    placeholder="Ex: Pick-up / Voiture de fonction"
                    style={styles.inputSpecVeto}
                    value={formData.moyenTransport}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Horaires de Consultation</label>
                  <input
                    type="text"
                    name="horairesConsultation"
                    placeholder="Ex: Lun-Ven 08:00 - 17:00"
                    style={styles.inputSpecVeto}
                    value={formData.horairesConsultation}
                    onChange={handleChange}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "25px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="urgence"
                    name="disponibleUrgence"
                    checked={!!formData.disponibleUrgence}
                    onChange={handleChange}
                    style={{
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                      accentColor: "#2563eb",
                    }}
                  />
                  <label
                    htmlFor="urgence"
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#1a1a18",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    Disponible pour les Urgences 24h/24
                  </label>
                </div>
              </div>
            </>
          )}

          {/* SECTION 4 : MOT DE PASSE (US 65) */}
          <div style={styles.sectionHeader}>Sécurité du compte</div>
          <div style={{ maxWidth: "400px" }}>
            <label style={styles.label}>
              Nouveau mot de passe (Laisser vide pour ne pas changer)
            </label>
            <input
              type="password"
              name="nouveauPassword"
              placeholder="••••••••"
              style={styles.input}
              value={formData.nouveauPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Enregistrement..." : "Sauvegarder les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "24px",
    border: "1px solid #e8e7e2",
    boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
  },
  sectionHeader: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#a0a098",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    borderBottom: "1px solid #f0efe9",
    paddingBottom: "8px",
    marginTop: "1rem",
  },
  sectionHeaderVeto: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    borderBottom: "1px solid #dbeafe",
    paddingBottom: "8px",
    marginTop: "1rem",
  },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    color: "#1a1a18",
    textTransform: "uppercase",
    marginBottom: "6px",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1.5px solid #f0f0ee",
    background: "#f9f9f7",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  },
  inputSpec: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1.5px solid #dcfce7",
    background: "#f0fdf4",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  },
  inputSpecVeto: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1.5px solid #dbeafe",
    background: "#eff6ff",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  },
  submitBtn: {
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "700",
    background: "#1a1a18",
    color: "#fff",
    cursor: "pointer",
    marginTop: "1.5rem",
    alignSelf: "flex-start",
    width: "220px",
  },
};

export default ProfilePage;