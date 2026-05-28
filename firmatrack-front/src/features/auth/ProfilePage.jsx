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
      toast.success("Profil mis à jour avec succès ! ✨");
      
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
    <div style={{ padding: '2rem 3rem', backgroundColor: '#faf9f6', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-center" />
      
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a18', margin: 0, letterSpacing: '-0.5px' }}>
          Mon Profil & Configuration
        </h1>
        <p style={{ fontSize: '14px', color: '#7a7a74', marginTop: '4px' }}>Gérez vos informations personnelles, professionnelles et de sécurité.</p>
      </header>

      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* SECTION 1 : INFOS PERSOS (US 64) */}
          <div style={styles.sectionHeader}>Informations personnelles </div>
          <div style={styles.grid}>
            <div>
              <label style={styles.label}>Nom complet</label>
              <input type="text" name="name" style={styles.input} value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label style={styles.label}>Téléphone</label>
              <input type="text" name="telephone" style={styles.input} value={formData.telephone} onChange={handleChange} required />
            </div>
          </div>
          <div style={{ maxWidth: '400px' }}>
            <label style={styles.label}>Adresse / Ville</label>
            <input type="text" name="adresse" placeholder="Ex: Tunis, Ariana..." style={styles.input} value={formData.adresse} onChange={handleChange} />
          </div>

          {/* SECTION 2 : ÉLEVEUR (US 62) */}
          {(userRole === 'FERMIER' || userRole === 'ELEVEUR') && (
            <>
              <div style={styles.sectionHeader}>Détails de la Ferme</div>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Nom de la Ferme</label>
                  <input type="text" name="nomFerme" style={styles.inputSpec} value={formData.nomFerme} onChange={handleChange} />
                </div>
                <div>
                  <label style={styles.label}>Surface (Hectares)</label>
                  <input type="number" name="surfaceFerme" style={styles.inputSpec} value={formData.surfaceFerme} onChange={handleChange} />
                </div>
              </div>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Localisation de la ferme</label>
                  <input type="text" name="localisationFerme" placeholder="Ex: Béja, Jendouba..." style={styles.inputSpec} value={formData.localisationFerme} onChange={handleChange} />
                </div>
                <div>
                  <label style={styles.label}>Date de création de la ferme</label>
                  <input type="date" name="dateCreationFerme" style={styles.inputSpec} value={formData.dateCreationFerme} onChange={handleChange} />
                </div>
              </div>
            </>
          )}

          {/* SECTION 3 : VÉTÉRINAIRE (US 63) */}
{userRole === 'VETERINAIRE' && (
  <>
    <div style={styles.sectionHeaderVeto}>Profil Professionnel & Cabinet</div>
    
    <div style={styles.grid}>
      <div>
        <label style={styles.label}>Spécialité vétérinaire</label>
        <input type="text" name="specialite" placeholder="Ex: Bovins, Équidés..." style={styles.inputSpecVeto} value={formData.specialite} onChange={handleChange} />
      </div>
      <div>
        <label style={styles.label}>Nom du Cabinet / Clinique</label>
        <input type="text" name="nomCabinet" placeholder="Ex: Cabinet Vétérinaire El Amen" style={styles.inputSpecVeto} value={formData.nomCabinet} onChange={handleChange} />
      </div>
    </div>

    {/* Correction : Ajout du div grid pour aligner la localisation avec le reste */}
    <div style={styles.grid}>
      <div style={{ gridColumn: 'span 2' }}>
        <label style={styles.label}>Localisation du Cabinet</label>
        <input type="text" name="localisationCabinet" placeholder="Ex: Rue de l'Indépendance, Fouchana" style={styles.inputSpecVeto} value={formData.localisationCabinet} onChange={handleChange} />
      </div>
    </div>

    <div style={styles.grid}>
      <div>
        <label style={styles.label}>Université d'obtention du diplôme</label>
        <input type="text" name="universite" placeholder="Ex: ENMV Sidi Thabet" style={styles.inputSpecVeto} value={formData.universite} onChange={handleChange} />
      </div>
      <div>
        <label style={styles.label}>Années d'expérience</label>
        <input type="number" name="anneesExperience" placeholder="Ex: 5" style={styles.inputSpecVeto} value={formData.anneesExperience} onChange={handleChange} />
      </div>
    </div>

    <div style={styles.grid}>
      <div>
        <label style={styles.label}>Tarif de Consultation Standard (DT)</label>
        <input type="number" step="0.500" name="tarifConsultation" placeholder="0.000" style={styles.inputSpecVeto} value={formData.tarifConsultation} onChange={handleChange} />
      </div>
      <div>
        <label style={styles.label}>Moyen de transport</label>
        <input type="text" name="moyenTransport" placeholder="Ex: Pick-up / Voiture de fonction" style={styles.inputSpecVeto} value={formData.moyenTransport} onChange={handleChange} />
      </div>
    </div>

    <div style={styles.grid}>
      <div>
        <label style={styles.label}>Horaires de Consultation</label>
        <input type="text" name="horairesConsultation" placeholder="Ex: Lun-Ven 08:00 - 17:00" style={styles.inputSpecVeto} value={formData.horairesConsultation} onChange={handleChange} />
      </div>
      
      {/* Case à cocher Urgences */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '25px' }}>
        <input 
          type="checkbox" 
          id="urgence"
          name="disponibleUrgence"
          checked={!!formData.disponibleUrgence} 
          onChange={handleChange}
          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563eb' }}
        />
        <label htmlFor="urgence" style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a18', cursor: 'pointer', userSelect: 'none' }}>
            Disponible pour les Urgences 24h/24
        </label>
      </div>
    </div>
  </>
)}

          {/* SECTION 4 : MOT DE PASSE (US 65) */}
          <div style={styles.sectionHeader}>Sécurité du compte</div>
          <div style={{ maxWidth: '400px' }}>
            <label style={styles.label}>Nouveau mot de passe (Laisser vide pour ne pas changer)</label>
            <input type="password" name="nouveauPassword" placeholder="••••••••" style={styles.input} value={formData.nouveauPassword} onChange={handleChange} />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Enregistrement...' : 'Sauvegarder les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  card: { background: '#fff', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e8e7e2', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' },
  sectionHeader: { fontSize: '11px', fontWeight: '700', color: '#a0a098', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #f0efe9', paddingBottom: '8px', marginTop: '1rem' },
  sectionHeaderVeto: { fontSize: '11px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #dbeafe', paddingBottom: '8px', marginTop: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  label: { display: 'block', fontSize: '11px', fontWeight: '600', color: '#1a1a18', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #f0f0ee', background: '#f9f9f7', fontSize: '13px', outline: 'none' },
  inputSpec: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #dcfce7', background: '#f0fdf4', fontSize: '13px', outline: 'none' },
  inputSpecVeto: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #dbeafe', background: '#eff6ff', fontSize: '13px', outline: 'none' },
  submitBtn: { padding: '14px', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', background: '#1a1a18', color: '#fff', cursor: 'pointer', marginTop: '1.5rem', alignSelf: 'flex-start', width: '220px' }
};

export default ProfilePage;