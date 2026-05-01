import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('FERMIER');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', telephone: '',
    nomFerme: '', surfaceFerme: '', specialite: '', diplome: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Appel à ton API Spring Boot (Port 8888)
      await axios.post('http://localhost:8888/api/auth/register', { ...formData, role });
      alert("Compte créé avec succès ! Connectez-vous.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || "Erreur lors de l'inscription");
    }
  };

  return (
    <div style={styles.container}>
      {/* PARTIE GAUCHE : VISUEL */}
      <div style={styles.leftSide}>
        <div style={styles.overlay}>
          <div style={styles.leftTextContent}>
            <h2 style={styles.leftTitle}>Rejoignez la révolution de la gestion agricole.</h2>
            <p style={styles.leftSubtitle}>Une plateforme unique pour les éleveurs de demain et leurs partenaires vétérinaires.</p>
          </div>
        </div>
      </div>

      {/* PARTIE DROITE : FORMULAIRE */}
      <div style={styles.rightSide}>
        <div style={styles.registerBox}>
          
          <div style={styles.header}>
            <div style={styles.logoIcon}>🐑</div>
            <h1 style={styles.mainTitle}>Créer un compte</h1>
            <p style={styles.subTitle}>Choisissez votre profil pour commencer</p>
          </div>

          {/* SÉLECTEUR DE RÔLE STYLE IPHONE / MODERNE */}
          <div style={styles.roleSelector}>
            <button 
              type="button"
              style={{...styles.roleBtn, ...(role === 'FERMIER' ? styles.activeRoleFermier : {})}}
              onClick={() => setRole('FERMIER')}
            >
              Éleveur / Fermier
            </button>
            <button 
              type="button"
              style={{...styles.roleBtn, ...(role === 'VETERINAIRE' ? styles.activeRoleVeto : {})}}
              onClick={() => setRole('VETERINAIRE')}
            >
              Vétérinaire
            </button>
          </div>

          <form onSubmit={handleRegister} style={styles.form}>
            {/* GRILLE POUR LES CHAMPS COMMUNS */}
            <div style={styles.grid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nom complet</label>
                <input name="name" type="text" placeholder="John Doe" style={styles.input} onChange={handleChange} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Téléphone</label>
                <input name="telephone" type="text" placeholder="+216 ..." style={styles.input} onChange={handleChange} />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Adresse e-mail</label>
              <input name="email" type="email" placeholder="email@example.com" style={styles.input} onChange={handleChange} required />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Mot de passe</label>
              <input name="password" type="password" placeholder="••••••••" style={styles.input} onChange={handleChange} required />
            </div>

            {/* CHAMPS DYNAMIQUES SELON RÔLE */}
            <div style={styles.dynamicSection}>
              {role === 'FERMIER' ? (
                <div style={styles.grid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Nom de la ferme</label>
                    <input name="nomFerme" type="text" placeholder="Ferme Verte" style={styles.inputSpecial} onChange={handleChange} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Surface (Ha)</label>
                    <input name="surfaceFerme" type="number" placeholder="12" style={styles.inputSpecial} onChange={handleChange} />
                  </div>
                </div>
              ) : (
                <div style={styles.grid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Spécialité</label>
                    <input name="specialite" type="text" placeholder="Bovins / Ovins" style={styles.inputSpecialVeto} onChange={handleChange} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Matricule / Diplôme</label>
                    <input name="diplome" type="text" placeholder="N° ORDRE" style={styles.inputSpecialVeto} onChange={handleChange} />
                  </div>
                </div>
              )}
            </div>

            {error && <p style={styles.errorText}>{error}</p>}

            <button type="submit" style={{...styles.submitBtn, backgroundColor: role === 'FERMIER' ? '#16a34a' : '#2563eb'}}>
              Créer mon compte
            </button>
          </form>

          <p style={styles.footerText}>
            Déjà inscrit ? <Link to="/login" style={styles.link}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- STYLES (MATCHING LOGIN PAGE) ---
const styles = {
  container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#000', fontFamily: "'Inter', sans-serif", overflow: 'hidden' },
  leftSide: { 
    flex: 1, 
    backgroundImage: 'url("/image_vache.png")', 
    backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' 
  },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', display: 'flex', alignItems: 'flex-end', padding: '60px' },
  leftTextContent: { color: '#fff', maxWidth: '500px' },
  leftTitle: { fontSize: '28px', fontWeight: '600', marginBottom: '15px', lineHeight: '1.3' },
  leftSubtitle: { fontSize: '15px', color: '#ccc' },
  rightSide: { flex: 1.2, backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', overflowY: 'auto' },
  registerBox: { width: '100%', maxWidth: '500px', padding: '40px 20px' },
  header: { textAlign: 'center', marginBottom: '30px' },
  logoIcon: { fontSize: '30px', backgroundColor: '#16a34a', width: '50px', height: '50px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' },
  mainTitle: { fontSize: '24px', fontWeight: '600', marginBottom: '8px' },
  subTitle: { fontSize: '14px', color: '#666' },
  roleSelector: { display: 'flex', backgroundColor: '#151515', padding: '5px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #222' },
  roleBtn: { flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'transparent', color: '#888', fontWeight: '500', transition: '0.3s' },
  activeRoleFermier: { backgroundColor: '#16a34a', color: '#fff' },
  activeRoleVeto: { backgroundColor: '#2563eb', color: '#fff' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  grid: { display: 'flex', gap: '15px' },
  inputGroup: { flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' },
  label: { fontSize: '13px', color: '#888', marginBottom: '8px' },
  input: { padding: '12px', backgroundColor: '#151515', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '14px' },
  inputSpecial: { padding: '12px', backgroundColor: 'rgba(22, 163, 74, 0.05)', border: '1px solid #16a34a55', borderRadius: '8px', color: '#fff' },
  inputSpecialVeto: { padding: '12px', backgroundColor: 'rgba(37, 99, 235, 0.05)', border: '1px solid #2563eb55', borderRadius: '8px', color: '#fff' },
  submitBtn: { padding: '14px', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', transition: '0.3s' },
  errorText: { color: '#ef4444', fontSize: '13px' },
  footerText: { marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#666' },
  link: { color: '#fff', textDecoration: 'none', fontWeight: '600' }
};

export default Register;