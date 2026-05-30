import React, { useState, useEffect } from "react";
import { useToast, ToastContainer } from "../../components/common/Toast";
import authService from "./authService";
import LocationPicker from "../veterinaire/components/LocationPicker";

const s = {
  card: {
    background: '#fff',
    border: '0.5px solid #e8e7e2',
    borderRadius: '14px',
    padding: '2.5rem',
  },
  sectionHeader: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#9a9a96',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: '0.5px solid #e8e7e2',
    paddingBottom: '8px',
    marginBottom: '1.25rem'
  },
  sectionHeaderFermer: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#3B6D11',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: '0.5px solid #3B6D1133',
    paddingBottom: '8px',
    marginBottom: '1.25rem',
    marginTop: '1.5rem'
  },
  sectionHeaderVeto: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: '0.5px solid #2563eb33',
    paddingBottom: '8px',
    marginBottom: '1.25rem',
    marginTop: '1.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
  },
  label: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    color: '#9a9a96',
    textTransform: 'uppercase',
    marginBottom: '6px',
    letterSpacing: '0.04em'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '0.5px solid #e8e7e2',
    background: '#faf9f7',
    fontSize: '12.5px',
    outline: 'none',
    color: '#1a1a18',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  },
  inputSpec: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '0.5px solid #3B6D1122',
    background: '#EAF3DE1c',
    fontSize: '12.5px',
    outline: 'none',
    color: '#1a1a18',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  },
  inputSpecVeto: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '0.5px solid #2563eb22',
    background: '#eff6ff1c',
    fontSize: '12.5px',
    outline: 'none',
    color: '#1a1a18',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  },
  selectSpecVeto: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '0.5px solid #2563eb22',
    background: '#eff6ff1c',
    fontSize: '12.5px',
    outline: 'none',
    color: '#1a1a18',
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#1a1a18',
  },
  checkboxLabel: {
    fontSize: '12.5px',
    fontWeight: '500',
    color: '#1a1a18',
    cursor: 'pointer',
    userSelect: 'none'
  },
  btnPrimary: {
    background: '#1a1a18',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'opacity 0.15s',
  },
  btnAutoGPS: {
    background: '#eff6ff',
    color: '#2563eb',
    border: '0.5px solid #2563eb33',
    padding: '10px 14px',
    borderRadius: '10px',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '12.5px',
    fontFamily: "'DM Sans', sans-serif"
  },
  btnPickMap: {
    background: '#EAF3DE',
    color: '#3B6D11',
    border: '0.5px solid #3B6D1133',
    padding: '10px 14px',
    borderRadius: '10px',
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '12.5px',
    fontFamily: "'DM Sans', sans-serif"
  },
  btnCloseMap: {
    background: '#f1f0ec',
    border: '0.5px solid #e8e7e2',
    color: '#6b6b67',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    fontFamily: "'DM Sans', sans-serif"
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }
};

const ProfilePage = () => {
  const userRole = localStorage.getItem("user_role");
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    telephone: "",
    adresse: "",
    nomFerme: "",
    surfaceFerme: "",
    localisationFerme: "",
    dateCreationFerme: "",
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
    nouveauPassword: "",
  });

  const { toasts, removeToast, toast } = useToast();

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const data = await authService.getMyProfile();
      setFormData({
        name: data.name || "",
        telephone: data.telephone || "",
        adresse: data.adresse || "",
        nomFerme: data.nomFerme || "",
        surfaceFerme: data.surfaceFerme || "",
        localisationFerme: data.localisationFerme || "",
        dateCreationFerme: data.dateCreationFerme || "",
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
      toast.success("Profil mis à jour avec succès.");

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

  const handleGPSDirect = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par ce navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          setFormData((prev) => ({
            ...prev,
            latitudeCabinet: lat,
            longitudeCabinet: lng,
            localisationCabinet: data.display_name || `${lat}, ${lng}`,
          }));

          toast.success("Position GPS enregistrée.");
        } catch (err) {
          setFormData((prev) => ({
            ...prev,
            latitudeCabinet: lat,
            longitudeCabinet: lng,
            localisationCabinet: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          }));
          toast.success("Coordonnées GPS enregistrées.");
        }
      },
      (err) => {
        const messages = {
          1: "Permission refusée. Autorisez la localisation dans votre navigateur.",
          2: "Position indisponible. Vérifiez votre GPS.",
          3: "Délai dépassé. Réessayez.",
        };
        toast.error(messages[err.code] || `Erreur GPS : ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem', fontFamily: "'DM Sans', sans-serif" }}>
        
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px', color: '#b0afa9', marginBottom: '6px' }}>
          <span>Ferme El Baraka</span>
          <span>/</span>
          <span style={{ color: '#1a1a18' }}>Mon Profil & Configuration</span>
        </div>

        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a18', letterSpacing: '-0.4px', margin: 0 }}>
            Mon Profil & Configuration
          </h1>
          <p style={{ fontSize: '12px', color: '#9a9a96', marginTop: '4px', margin: '4px 0 0' }}>
            Gérez vos informations personnelles, professionnelles et de sécurité.
          </p>
        </header>

        <div style={s.card}>
          <form onSubmit={handleSubmit} style={s.form}>
            
            <div>
              <div style={s.sectionHeader}>Informations personnelles</div>
              <div style={s.grid}>
                <div>
                  <label style={s.label}>Nom complet</label>
                  <input type="text" name="name" style={s.input} value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                  <label style={s.label}>Téléphone</label>
                  <input type="text" name="telephone" style={s.input} value={formData.telephone} onChange={handleChange} required />
                </div>
              </div>
              <div style={{ maxWidth: '400px', marginTop: '1.25rem' }}>
                <label style={s.label}>Adresse / Ville</label>
                <input type="text" name="adresse" placeholder="Ex: Tunis, Ariana..." style={s.input} value={formData.adresse} onChange={handleChange} />
              </div>
            </div>

            {(userRole === 'FERMIER' || userRole === 'ELEVEUR') && (
              <div>
                <div style={s.sectionHeaderFermer}>Détails de la Ferme</div>
                <div style={s.grid}>
                  <div>
                    <label style={s.label}>Nom de la Ferme</label>
                    <input type="text" name="nomFerme" style={s.inputSpec} value={formData.nomFerme} onChange={handleChange} />
                  </div>
                  <div>
                    <label style={s.label}>Surface (Hectares)</label>
                    <input type="number" name="surfaceFerme" style={s.inputSpec} value={formData.surfaceFerme} onChange={handleChange} />
                  </div>
                </div>
                <div style={{ ...s.grid, marginTop: '1.25rem' }}>
                  <div>
                    <label style={s.label}>Localisation de la ferme</label>
                    <input type="text" name="localisationFerme" placeholder="Ex: Béja, Jendouba..." style={s.inputSpec} value={formData.localisationFerme} onChange={handleChange} />
                  </div>
                  <div>
                    <label style={s.label}>Date de création de la ferme</label>
                    <input type="date" name="dateCreationFerme" style={s.inputSpec} value={formData.dateCreationFerme} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {userRole === "VETERINAIRE" && (
              <div>
                <div style={s.sectionHeaderVeto}>
                  Profil Professionnel & Cabinet
                </div>

                <div style={s.grid}>
                  <div>
                    <label style={s.label}>Spécialité vétérinaire</label>
                    <input
                      type="text"
                      name="specialite"
                      placeholder="Ex: Bovins, Équidés..."
                      style={s.inputSpecVeto}
                      value={formData.specialite}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label style={s.label}>Nom du Cabinet / Clinique</label>
                    <input
                      type="text"
                      name="nomCabinet"
                      placeholder="Ex: Cabinet Vétérinaire El Amen"
                      style={s.inputSpecVeto}
                      value={formData.nomCabinet}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <label style={s.label}>Localisation du Cabinet</label>
                  <input
                    type="text"
                    name="localisationCabinet"
                    placeholder="Ex: Rue de l'Indépendance, Fouchana"
                    style={s.inputSpecVeto}
                    value={formData.localisationCabinet}
                    onChange={handleChange}
                  />

                  {(formData.latitudeCabinet || formData.longitudeCabinet) && (
                    <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                      Lat : {formData.latitudeCabinet?.toFixed(6)} | Lng : {formData.longitudeCabinet?.toFixed(6)}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      type="button"
                      onClick={handleGPSDirect}
                      style={s.btnAutoGPS}
                    >
                      Auto GPS
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMap(true)}
                      style={s.btnPickMap}
                    >
                      Choisir sur la carte
                    </button>
                  </div>
                </div>

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
                        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "500" }}>
                          Sélectionnez la localisation du cabinet
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowMap(false)}
                          style={s.btnCloseMap}
                        >
                          Fermer
                        </button>
                      </div>
                      <LocationPicker
                        onSelect={({ position, address }) => {
                          setFormData((prev) => ({
                            ...prev,
                            localisationCabinet: address || `${position?.lat}, ${position?.lng}`,
                            latitudeCabinet: position?.lat ?? null,
                            longitudeCabinet: position?.lng ?? null,
                          }));
                          setShowMap(false);
                          toast.success("Localisation carte enregistrée.");
                        }}
                      />
                    </div>
                  </div>
                )}

                <div style={{ ...s.grid, marginTop: '1.25rem' }}>
                  <div>
                    <label style={s.label}>Université d'obtention du diplôme</label>
                    <input
                      type="text"
                      name="universite"
                      placeholder="Ex: ENMV Sidi Thabet"
                      style={s.inputSpecVeto}
                      value={formData.universite}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label style={s.label}>Années d'expérience</label>
                    <input
                      type="number"
                      name="anneesExperience"
                      placeholder="Ex: 5"
                      style={s.inputSpecVeto}
                      value={formData.anneesExperience}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div style={{ ...s.grid, marginTop: '1.25rem' }}>
                  <div>
                    <label style={s.label}>
                      Tarif de Consultation Standard (DT)
                    </label>
                    <input
                      type="number"
                      step="0.500"
                      name="tarifConsultation"
                      placeholder="0.000"
                      style={s.inputSpecVeto}
                      value={formData.tarifConsultation}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label style={s.label}>Moyen de transport</label>
                    <input
                      type="text"
                      name="moyenTransport"
                      placeholder="Ex: Pick-up / Voiture de fonction"
                      style={s.inputSpecVeto}
                      value={formData.moyenTransport}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div style={{ ...s.grid, marginTop: '1.25rem' }}>
                  <div>
                    <label style={s.label}>Horaires de Consultation</label>
                    <input
                      type="text"
                      name="horairesConsultation"
                      placeholder="Ex: Lun-Ven 08:00 - 17:00"
                      style={s.inputSpecVeto}
                      value={formData.horairesConsultation}
                      onChange={handleChange}
                    />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "22px" }}>
                    <input
                      type="checkbox"
                      id="urgence"
                      name="disponibleUrgence"
                      checked={!!formData.disponibleUrgence}
                      onChange={handleChange}
                      style={s.checkbox}
                    />
                    <label htmlFor="urgence" style={s.checkboxLabel}>
                      Disponible pour les Urgences 24h/24
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div style={s.sectionHeader}>Sécurité du compte</div>
              <div style={{ maxWidth: "400px" }}>
                <label style={s.label}>
                  Nouveau mot de passe (Laisser vide pour ne pas changer)
                </label>
                <input
                  type="password"
                  name="nouveauPassword"
                  placeholder="••••••••"
                  style={s.input}
                  value={formData.nouveauPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button type="submit" disabled={loading} style={s.btnPrimary}>
                {loading ? "Enregistrement en cours..." : "Sauvegarder les modifications"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </>
  );
};

export default ProfilePage;