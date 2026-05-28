import { useState, useRef, useEffect } from 'react';
import authService from './authService';
import { Link } from 'react-router-dom';

// --- SVG Icons Components ---
const EmailIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const LockIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const AlertIcon = ({ size = 20, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const FarmIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4v10M12 14h8M10 14v8M22 14v8M8 22h16M6 28h20"/><path d="M16 4l-6 4v6h12v-6l-6-4z"/>
  </svg>
);

const LEAFS_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cellipse cx='25' cy='20' rx='16' ry='11' fill='%231a1a18' opacity='0.025' transform='rotate(-25 25 20)'/%3E%3Cellipse cx='95' cy='32' rx='20' ry='13' fill='%231a1a18' opacity='0.02' transform='rotate(18 95 32)'/%3E%3Cellipse cx='55' cy='68' rx='24' ry='15' fill='%231a1a18' opacity='0.025' transform='rotate(-12 55 68)'/%3E%3Cellipse cx='118' cy='90' rx='15' ry='10' fill='%231a1a18' opacity='0.015' transform='rotate(-35 118 90)'/%3E%3C/svg%3E")`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const emailInputRef = useRef(null);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = password.length >= 3; 
  const isFormValid = isValidEmail && isValidPassword && !loading;

  useEffect(() => {
    emailInputRef.current?.focus();
    const savedEmail = localStorage.getItem('firmtrack_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!isFormValid) return;

    setLoading(true);
    try {
      // --- APPEL DE TON SERVICE PROPRE ---
      // Le service s'occupe déjà de faire le POST et de remplir le localStorage !
      const response = await authService.login(email, password);

      // ✅ Redirection et rafraîchissement
      window.location.href = '/';
    } catch (err) {
      // On attrape le message d'erreur proprement
      const msg = err.response?.data?.message || err.response?.data || 'Identifiants invalides.';
      setError(typeof msg === 'object' ? JSON.stringify(msg) : msg);
      setLoading(false);
    }
  };

  const fillTestAdmin = () => {
    setEmail('admin@ferme.com'); setPassword('123');
    setEmailTouched(true); setPasswordTouched(true);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .login-container { animation: fadeInUp 0.6s ease-out; }
        input:focus { border-color: #1a1a18 !important; background: #fff !important; box-shadow: 0 0 0 4px rgba(26, 26, 24, 0.08) !important; outline: none; }
        .login-btn:hover:not(:disabled) { background: #2a2a28 !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26, 26, 24, 0.15); }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      {/* LEFT: Image Section */}
      <div style={styles.imageSection} className="image-container">
        <div style={styles.imageCard}>
          <div style={styles.imageOverlay}>
            <div style={styles.imageText}>
              <div style={{ ...styles.tag, cursor: 'pointer' }} onClick={fillTestAdmin}>
                FirmaTrack v2.0
              </div>
              <h2 style={styles.titleLeft}>Gérez votre ferme comme une entreprise moderne.</h2>
              <p style={styles.descLeft}>Une plateforme centralisée pour le cheptel, la production et vos finances.</p>
              <div style={styles.statsContainer}>
                <div style={styles.statItem}><div style={styles.statNumber}>500+</div><div style={styles.statLabel}>Utilisateurs</div></div>
                <div style={styles.statItem}><div style={styles.statNumber}>1M+</div><div style={styles.statLabel}>Animaux</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Form Section */}
      <div style={styles.formSection}>
        <div style={styles.loginBox} className="login-container">
          <div style={styles.header}>
            <div style={styles.logoCircle}><FarmIcon size={32} /></div>
            <h1 style={styles.mainTitle}>Bon retour !</h1>
            <p style={styles.subTitle}>Connectez-vous pour piloter votre exploitation.</p>
          </div>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}><EmailIcon size={16} /> Adresse e-mail</label>
              <input
                ref={emailInputRef} type="email" placeholder="firas@ferme.com"
                style={{ ...styles.input, borderColor: emailTouched && !isValidEmail ? '#ef4444' : '#e8e7e2' }}
                value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setEmailTouched(true)} required
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={styles.label}><LockIcon size={16} /> Mot de passe</label>
                <Link to="/forgot-password" style={styles.linkSmall}>Oublié ?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  style={{ ...styles.input, paddingRight: '44px', borderColor: passwordTouched && password.length < 3 ? '#ef4444' : '#e8e7e2' }}
                  value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => setPasswordTouched(true)} required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <label htmlFor="remember" style={{ ...styles.label, margin: 0, cursor: 'pointer', fontSize: '13px' }}>Se souvenir de moi</label>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <AlertIcon size={16} style={{marginRight: '8px'}} />
                {error}
              </div>
            )}

            <button type="submit" disabled={!isFormValid} className="login-btn" style={styles.button}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p style={styles.footer}>
            Vous n'avez pas de compte ? <Link to="/register" style={styles.linkBold}>S'inscrire ici</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { display: 'flex', height: '100vh', backgroundColor: '#faf9f6', backgroundImage: LEAFS_PATTERN, backgroundSize: '180px 180px', overflow: 'hidden' },
  imageSection: { flex: 1.2, padding: '24px', display: 'flex', alignItems: 'stretch' },
  imageCard: { flex: 1, backgroundImage: 'url("https://images.unsplash.com/photo-1717702576954-c07131c54169?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '28px', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' },
  imageOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'flex-end', padding: '48px' },
  imageText: { color: '#fff', maxWidth: '420px' },
  tag: { background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', marginBottom: '16px', display: 'inline-block', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' },
  titleLeft: { fontSize: '36px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' },
  descLeft: { fontSize: '15px', opacity: 0.95, marginBottom: '32px' },
  statsContainer: { display: 'flex', gap: '32px' },
  statItem: { display: 'flex', flexDirection: 'column' },
  statNumber: { fontSize: '24px', fontWeight: '700', marginBottom: '4px' },
  statLabel: { fontSize: '12px', opacity: 0.8 },
  formSection: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  loginBox: { width: '100%', maxWidth: '420px', padding: '48px', backgroundColor: '#ffffff', borderRadius: '32px', boxShadow: '0 25px 50px rgba(26, 26, 24, 0.06)', border: '1px solid rgba(26, 26, 24, 0.04)', position: 'relative', zIndex: 2 },
  header: { textAlign: 'center', marginBottom: '40px' },
  logoCircle: { width: '60px', height: '60px', background: '#f5f5f2', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#1a1a18' },
  mainTitle: { fontSize: '26px', fontWeight: '700', color: '#1a1a18', margin: '0 0 8px 0' },
  subTitle: { fontSize: '14px', color: '#a0a098', margin: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#1a1a18', display: 'flex', alignItems: 'center', gap: '6px' },
  input: { padding: '14px 16px', borderRadius: '14px', border: '1.5px solid #e8e7e2', background: '#f9f9f7', fontSize: '14px', width: '100%' },
  toggleButton: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a0a098' },
  button: { padding: '16px', borderRadius: '14px', border: 'none', background: '#1a1a18', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
  errorBox: { padding: '12px', borderRadius: '12px', background: '#fef2f2', color: '#ef4444', fontSize: '13px', fontWeight: '600', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  linkSmall: { fontSize: '12px', color: '#16a34a', textDecoration: 'none', fontWeight: '700' },
  footer: { textAlign: 'center', fontSize: '14px', color: '#a0a098' },
  linkBold: { color: '#1a1a18', fontWeight: '700', textDecoration: 'none' },
};

export default Login;