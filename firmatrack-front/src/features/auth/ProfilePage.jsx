import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import authService from './authService';

const ProfilePage = () => {
  const userRole = localStorage.getItem('user_role');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', 
    telephone: '', 
    adresse: '',
    
    // Éleveur (Fermier - US 62)
    nomFerme: '', 
    surfaceFerme: '', 
    localisationFerme: '', 
    dateCreationFerme: '',
    
    // Vétérinaire (US 63)
    specialite: '', 
    nomCabinet: '', 
    horairesConsultation: '',
    universite: '',
    anneesExperience: '',
    disponibleUrgence: false,
    tarifConsultation: '',
    moyenTransport: '',
    localisationCabinet : '',
    
    // Sécurité (US 65)
    nouveauPassword: ''
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  // US 64 : Charger les VRAIES données de PostgreSQL au chargement
  const loadProfileData = async () => {
    try {
      const data = await authService.getMyProfile(); // Appelle l'API /me sécurisée par Token
      setFormData({
        name: data.name || '',
        telephone: data.telephone || '',
        adresse: data.adresse || '',
        // Éleveur
        nomFerme: data.nomFerme || '',
        surfaceFerme: data.surfaceFerme || '',
        localisationFerme: data.localisationFerme || '',
        dateCreationFerme: data.dateCreationFerme || '',
        // Vétérinaire
        specialite: data.specialite || '',
        nomCabinet: data.nomCabinet || '',
        horairesConsultation: data.horairesConsultation || '',
        universite: data.universite || '',
        anneesExperience: data.anneesExperience || '',
        disponibleUrgence: data.disponibleUrgence || false,
        tarifConsultation: data.tarifConsultation || '',
        moyenTransport: data.moyenTransport || '',
        localisationCabinet: data.localisationCabinet || '',
        nouveauPassword: ''
      });
    } catch (err) {
      toast.error("Erreur de connexion lors du chargement de votre profil.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(formData);
      toast.success("Profil mis à jour avec succès !");
      
      // Si le nom a changé, on met à jour le localStorage pour la Sidebar
      if (formData.name) {
        localStorage.setItem('user_name', formData.name);
        setTimeout(() => {
          window.location.reload(); // Refresh pour mettre à jour la Sidebar en direct !
        }, 1500);
      }
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement des modifications.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem', fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-center" />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px', color: '#b0afa9', marginBottom: '6px' }}>
          <span>Ferme El Baraka</span>
          <span>/</span>
          <span style={{ color: '#1a1a18' }}>Mon Profil & Configuration</span>
        </div>

        {/* HEADER */}
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a18', letterSpacing: '-0.4px', margin: 0 }}>
            Mon Profil & Configuration
          </h1>
          <p style={{ fontSize: '12px', color: '#9a9a96', marginTop: '4px', margin: '4px 0 0' }}>
            Gérez vos informations personnelles, professionnelles et de sécurité.
          </p>
        </header>

        {/* CARD PRINCIPALE */}
        <div style={s.card}>
          <form onSubmit={handleSubmit} style={s.form}>
            
            {/* SECTION 1 : INFOS PERSOS (US 64) */}
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

            {/* SECTION 2 : ÉLEVEUR (US 62) */}
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

            {/* SECTION 3 : VÉTÉRINAIRE (US 63) */}
            {userRole === 'VETERINAIRE' && (
              <div>
                <div style={s.sectionHeaderVeto}>Profil Professionnel & Cabinet</div>
                
                <div style={s.grid}>
                  {/* --- SPÉCIALITÉ SÉCURISÉE (US 63) --- */}
                  <div>
                    <label style={s.label}>Spécialité vétérinaire principale</label>
                    <select 
                      name="specialite" 
                      style={s.selectSpecVeto} 
                      value={formData.specialite} 
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Choisir une spécialité --</option>
                      <option value="Bovins">Bovins (Vaches, Veaux)</option>
                      <option value="Volailles">Volailles (Poulets, Dindes)</option>
                      <option value="Ovins">Ovins (Moutons, Chèvres)</option>
                    </select>
                  </div>
                  <div>
                    <label style={s.label}>Nom du Cabinet / Clinique</label>
                    <input type="text" name="nomCabinet" placeholder="Ex: Cabinet Vétérinaire El Amen" style={s.inputSpecVeto} value={formData.nomCabinet} onChange={handleChange} />
                  </div>
                </div>

                <div style={{ ...s.grid, marginTop: '1.25rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={s.label}>Localisation du Cabinet</label>
                    <input type="text" name="localisationCabinet" placeholder="Ex: Rue de l'Indépendance, Fouchana" style={s.inputSpecVeto} value={formData.localisationCabinet} onChange={handleChange} />
                  </div>
                </div>

                <div style={{ ...s.grid, marginTop: '1.25rem' }}>
                  <div>
                    <label style={s.label}>Université d'obtention du diplôme</label>
                    <input type="text" name="universite" placeholder="Ex: ENMV Sidi Thabet" style={s.inputSpecVeto} value={formData.universite} onChange={handleChange} />
                  </div>
                  <div>
                    <label style={s.label}>Années d'expérience</label>
                    <input type="number" name="anneesExperience" placeholder="Ex: 5" style={s.inputSpecVeto} value={formData.anneesExperience} onChange={handleChange} />
                  </div>
                </div>

                <div style={{ ...s.grid, marginTop: '1.25rem' }}>
                  <div>
                    <label style={s.label}>Tarif de Consultation Standard (DT)</label>
                    <input type="number" step="0.500" name="tarifConsultation" placeholder="0.000" style={s.inputSpecVeto} value={formData.tarifConsultation} onChange={handleChange} />
                  </div>
                  <div>
                    <label style={s.label}>Moyen de transport</label>
                    <input type="text" name="moyenTransport" placeholder="Ex: Pick-up / Voiture de fonction" style={s.inputSpecVeto} value={formData.moyenTransport} onChange={handleChange} />
                  </div>
                </div>

                <div style={{ ...s.grid, marginTop: '1.25rem' }}>
                  <div>
                    <label style={s.label}>Horaires de Consultation</label>
                    <input type="text" name="horairesConsultation" placeholder="Ex: Lun-Ven 08:00 - 17:00" style={s.inputSpecVeto} value={formData.horairesConsultation} onChange={handleChange} />
                  </div>
                  
                  {/* Case à cocher Urgences */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '22px' }}>
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

            {/* SECTION 4 : MOT DE PASSE (US 65) */}
            <div>
              <div style={s.sectionHeader}>Sécurité du compte</div>
              <div style={{ maxWidth: '400px' }}>
                <label style={s.label}>Nouveau mot de passe (Laisser vide pour ne pas changer)</label>
                <input type="password" name="nouveauPassword" placeholder="••••••••" style={s.input} value={formData.nouveauPassword} onChange={handleChange} />
              </div>
            </div>

            {/* BOTON DE SAVE */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
              <button type="submit" disabled={loading} style={s.btnPrimary}>
                {loading ? 'Enregistrement en cours...' : 'Sauvegarder les modifications'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

// ── SYSTÈME DE STYLES HARMONISÉ ET ÉPURÉ ──
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
    color: '#3B6D11', // Identité verte pour Fermier
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
    color: '#2563eb', // Identité bleue pour Vétérinaire
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
  // Inputs stylisés pour Éleveur (Thème vert subtil)
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
  // Inputs stylisés pour Vétérinaire (Thème bleu subtil)
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  }
};

export default ProfilePage;