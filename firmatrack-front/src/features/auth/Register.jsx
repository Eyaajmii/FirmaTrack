import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast, ToastContainer } from '../../components/common/Toast';
import authService from './authService'; 

const s = {
  page: { display: 'flex', height: '100vh', backgroundColor: '#faf9f6', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cellipse cx='25' cy='20' rx='16' ry='11' fill='%231a1a18' opacity='0.025' transform='rotate(-25 25 20)'/%3E%3Cellipse cx='95' cy='32' rx='20' ry='13' fill='%231a1a18' opacity='0.02' transform='rotate(18 95 32)'/%3E%3Cellipse cx='55' cy='68' rx='24' ry='15' fill='%231a1a18' opacity='0.025' transform='rotate(-12 55 68)'/%3E%3Cellipse cx='118' cy='90' rx='15' ry='10' fill='%231a1a18' opacity='0.015' transform='rotate(-35 118 90)'/%3E%3C/svg%3E")`, backgroundSize: '180px 180px', overflow: 'hidden' },
  imageSection: { flex: 1, padding: '24px', display: 'flex' },
  imageCard: { flex: 1, backgroundImage: 'url("https://images.unsplash.com/photo-1560198927-b31ef30c5867?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '32px', position: 'relative', overflow: 'hidden' },
  imageOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))', display: 'flex', alignItems: 'flex-end', padding: '48px' },
  imageText: { color: '#fff', maxWidth: '400px' },
  tag: { background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', marginBottom: '16px', display: 'inline-block', backdropFilter: 'blur(10px)' },
  titleLeft: { fontSize: '32px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' },
  descLeft: { fontSize: '15px', opacity: 0.9, lineHeight: '1.6' },
  formSection: { flex: 1.3, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' },
  registerBox: { width: '100%', maxWidth: '520px', padding: '48px', backgroundColor: '#ffffff', borderRadius: '32px', boxShadow: '0 25px 50px rgba(26, 26, 24, 0.06)', border: '1px solid rgba(26, 26, 24, 0.04)' },
  header: { textAlign: 'left', marginBottom: '32px' },
  mainTitle: { fontSize: '26px', fontWeight: '700', color: '#1a1a18', margin: '0 0 6px 0' },
  subTitle: { fontSize: '14px', color: '#a0a098', margin: 0 },
  roleSelector: { display: 'flex', background: '#f5f5f2', padding: '4px', borderRadius: '14px', marginBottom: '32px' },
  roleOption: { flex: 1, border: 'none', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', transition: '0.3s', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#1a1a18', display: 'flex', alignItems: 'center', gap: '6px' },
  input: { padding: '14px', borderRadius: '12px', border: '1.5px solid #e8e7e2', background: '#f9f9f7', fontSize: '14px', transition: '0.2s', outline: 'none' },
  inputSpec: { padding: '14px', borderRadius: '12px', border: '1.5px solid #dcfce7', background: '#f0fdf4', fontSize: '14px', outline: 'none' },
  inputSpecVeto: { width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #dbeafe', background: '#eff6ff', fontSize: '14px', outline: 'none' },
  dynamicWrapper: { minHeight: '80px' },
  button: { padding: '16px', borderRadius: '14px', border: 'none', background: '#1a1a18', color: '#fff', fontSize: '15px', fontWeight: '600', marginTop: '10px', cursor: 'pointer' },
  errorBox: { padding: '12px', borderRadius: '12px', background: '#fef2f2', color: '#ef4444', fontSize: '13px', fontWeight: '600', textAlign: 'center' },
  footer: { textAlign: 'center', marginTop: '32px', fontSize: '14px', color: '#a0a098' },
  linkBold: { color: '#1a1a18', fontWeight: '700', textDecoration: 'none', marginLeft: '5px' }
};

const UserIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const PhoneIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('FERMIER'); 

  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    telephone: '',
    nomFerme: '', 
    surfaceFerme: '', 
    matriculeApia: '', 
    specialite: '', 
    diplome: '' 
  });

  const [touched, setTouched] = useState({
    email: false, password: false, telephone: false
  });

  const { toasts, removeToast, toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'telephone') {
      const onlyNums = value.replace(/[^0-9]/g, '').slice(0, 8);
      setFormData({ ...formData, [name]: onlyNums });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(formData.email);
  const isPasswordValid = formData.password.length >= 8; 
  const isPhoneValid = formData.telephone.length === 8;

  const isFermierValid = role === 'FERMIER' 
    ? (formData.nomFerme.trim().length > 1 && formData.matriculeApia.trim().length > 3)
    : true;

  const isVetoValid = role === 'VETERINAIRE'
    ? (formData.specialite.trim().length > 1 && formData.diplome.trim().length > 3)
    : true;

  const isFormValid = isEmailValid && 
                      isPasswordValid && 
                      isPhoneValid && 
                      formData.name.trim().length > 2 && 
                      isFermierValid && 
                      isVetoValid;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
        toast.error("Veuillez remplir correctement tous les champs.");
        return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.register({ ...formData, role });
      toast.success("Compte créé et validé avec succès.");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "Erreur d'inscription";
      setError(typeof msg === 'object' ? JSON.stringify(msg) : msg);
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .fade-up { animation: fadeInUp 0.6s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        input:focus { border-color: #1a1a18 !important; background: #fff !important; box-shadow: 0 0 0 4px rgba(26, 26, 24, 0.06) !important; outline: none; }
        select:focus { border-color: #1a1a18 !important; background: #fff !important; box-shadow: 0 0 0 4px rgba(26, 26, 24, 0.06) !important; outline: none; }
        .error-input { border-color: #ef4444 !important; background-color: #fff5f5 !important; }
      `}</style>

      <div style={s.imageSection}>
        <div style={s.imageCard}>
          <div style={s.imageOverlay}>
            <div style={s.imageText}>
              <div style={s.tag}>FirmaTrack v2.0</div>
              <h2 style={s.titleLeft}>Rejoignez la communauté FirmaTrack.</h2>
              <p style={s.descLeft}>Un outil puissant pour transformer votre passion en une exploitation rentable.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={s.formSection}>
        <div style={s.registerBox} className="fade-up">
          <div style={s.header}>
            <h1 style={s.mainTitle}>Créer un compte</h1>
            <p style={s.subTitle}>Choisissez votre profil pour commencer.</p>
          </div>

          <div style={s.roleSelector}>
            <button type="button" onClick={() => setRole('FERMIER')} style={{...s.roleOption, background: role === 'FERMIER' ? '#1a1a18' : 'transparent', color: role === 'FERMIER' ? '#fff' : '#6a6a64'}}>Éleveur</button>
            <button type="button" onClick={() => setRole('VETERINAIRE')} style={{...s.roleOption, background: role === 'VETERINAIRE' ? '#1a1a18' : 'transparent', color: role === 'VETERINAIRE' ? '#fff' : '#6a6a64'}}>Vétérinaire</button>
          </div>

          <form onSubmit={handleRegister} style={s.form}>
            <div style={s.grid}>
                <div style={s.inputGroup}>
                    <label style={s.label}><UserIcon size={14}/> Nom complet</label>
                    <input name="name" placeholder="Firas Ben Slimane" style={s.input} onChange={handleChange} required />
                </div>
                <div style={s.inputGroup}>
                    <label style={s.label}><PhoneIcon size={14}/> Téléphone</label>
                    <input 
                        name="telephone" 
                        placeholder="22333444" 
                        value={formData.telephone}
                        className={touched.telephone && !isPhoneValid ? "error-input" : ""}
                        style={s.input} 
                        onChange={handleChange} 
                        onBlur={() => handleBlur('telephone')}
                        required 
                    />
                </div>
            </div>

            <div style={s.inputGroup}>
              <label style={s.label}>Adresse e-mail</label>
              <input 
                name="email" 
                type="email" 
                placeholder="nom@ferme.com" 
                className={touched.email && !isEmailValid ? "error-input" : ""}
                style={s.input} 
                onChange={handleChange} 
                onBlur={() => handleBlur('email')}
                required 
              />
            </div>

            <div style={s.inputGroup}>
              <label style={s.label}>Mot de passe (8+ caractères)</label>
              <input 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                className={touched.password && !isPasswordValid ? "error-input" : ""}
                style={s.input} 
                onChange={handleChange} 
                onBlur={() => handleBlur('password')}
                required 
              />
            </div>

            <div style={s.dynamicWrapper}>
              {role === 'FERMIER' ? (
                <div style={s.grid} className="fade-up">
                  <div style={s.inputGroup}>
                    <label style={s.label}>Nom de la ferme</label>
                    <input name="nomFerme" placeholder="El Baraka" style={s.inputSpec} onChange={handleChange} required />
                  </div>
                  <div style={s.inputGroup}>
                    <label style={s.label}>Surface (Ha)</label>
                    <input name="surfaceFerme" type="number" placeholder="10" style={s.inputSpec} onChange={handleChange} />
                  </div>
                  <div style={s.inputGroup}>
                    <label style={s.label}>Matricule APIA </label>
                    <input name="matriculeApia" placeholder="APIA-2026-XXXX" style={s.inputSpec} onChange={handleChange} required />
                  </div>
                </div>
              ) : (
                <div style={s.grid} className="fade-up">
                  <div style={s.inputGroup}>
                    <label style={s.label}>Spécialité principale</label>
                    <select 
                      name="specialite" 
                      style={s.inputSpecVeto} 
                      value={formData.specialite} 
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Choisir --</option>
                      <option value="Bovins">Bovins (Vaches, Veaux)</option>
                      <option value="Volailles">Volailles (Poulets, Dindes)</option>
                      <option value="Ovins">Ovins (Moutons, Chèvres)</option>
                    </select>
                  </div>
                  <div style={s.inputGroup}>
                    <label style={s.label}>N° Ordre CNOMVT</label>
                    <input name="diplome" placeholder="VT-2026-XXXX" style={s.inputSpecVeto} onChange={handleChange} required />
                  </div>
                </div>
              )}
            </div>

            {error && <div style={s.errorBox}>{error}</div>}

            <button type="submit" disabled={!isFormValid || loading} style={{...s.button, opacity: isFormValid ? 1 : 0.6}}>
              {loading ? 'Traitement...' : 'Créer mon compte'}
            </button>
          </form>

          <p style={s.footer}>
            Déjà inscrit ? <Link to="/login" style={s.linkBold}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;