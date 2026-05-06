import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Ajoute ça si c'est pas fait

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();
  setError(''); // On vide l'erreur précédente

   try {
      const response = await axios.post('http://localhost:8888/api/auth/login', {
        email,
        password
      });

      // 1. Stockage des infos (On utilise "nom" comme on a fait dans Java)
      localStorage.setItem('user_token', response.data.token);
      localStorage.setItem('user_role', response.data.role); 
      localStorage.setItem('user_name', response.data.nom); // On utilise "nom" (Back-end)
      localStorage.setItem('user_id', response.data.userId);

      // 2. Redirection vers l'accueil (App.js va détecter le token et afficher la Sidebar)
      window.location.href = '/';

    } catch (err) {
      console.error("Erreur login :", err);
      
      // FIX DE L'ERREUR "Objects are not valid"
      if (err.response && err.response.data) {
        const serverError = err.response.data;
        // Si le serveur renvoie un objet {message: "..."}, on prend juste le texte
        if (typeof serverError === 'object' && serverError.message) {
          setError(serverError.message);
        } else {
          setError(serverError.toString());
        }
      } else {
        setError('Impossible de contacter le serveur (Port 8888)');
      }
    }
  };

   return (
    <div style={styles.container}>
      {/* PARTIE GAUCHE : IMAGE ET TEXTE */}
      <div style={styles.leftSide}>
        <div style={styles.overlay}>
          <div style={styles.leftTextContent}>
            <h2 style={styles.leftTitle}>Pilotez l'intégralité de votre exploitation agricole avec précision et simplicité.</h2>
            <p style={styles.leftSubtitle}>FirmaTrack, votre assistant de gestion agricole intelligent.</p>
          </div>
        </div>
      </div>

      {/* PARTIE DROITE : FORMULAIRE */}
      <div style={styles.rightSide}>
        <div style={styles.loginBox}>
          {/* Logo */}
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>🚜</div>
            <h1 style={styles.mainTitle}>Connectez-vous à votre compte</h1>
            <p style={styles.subTitle}>Entrez votre e-mail et votre mot de passe ci-dessous pour vous connecter</p>
          </div>

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Adresse e-mail</label>
              <input
                type="email"
                placeholder="email@example.com"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <label style={styles.label}>Mot de passe</label>
                <a href="#" style={styles.forgotPass}>Mot de passe oublié ?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p style={styles.errorText}>{error}</p>}

            <button type="submit" style={styles.loginBtn}>Connexion</button>
          </form>

<p style={styles.footerText}>
  Vous n'avez pas de compte ? <Link to="/register" style={styles.signUpLink}>S'inscrire</Link>
</p>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  leftSide: {
    flex: 1,
    backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'flex-end',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '40px',
  },
  leftTextContent: {
    color: '#fff',
    maxWidth: '500px',
  },
  leftTitle: {
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '1.4',
    marginBottom: '10px',
  },
  leftSubtitle: {
    fontSize: '14px',
    color: '#ccc',
  },
  rightSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a', // Noir très sombre
    color: '#fff',
  },
  loginBox: {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    textAlign: 'center',
  },
  logoContainer: {
    marginBottom: '30px',
  },
  logoIcon: {
    fontSize: '40px',
    marginBottom: '15px',
    backgroundColor: '#16a34a',
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto',
  },
  mainTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  subTitle: {
    fontSize: '13px',
    color: '#888',
  },
  googleButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: 'transparent',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '20px',
    transition: 'background 0.3s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#222',
  },
  dividerText: {
    fontSize: '10px',
    color: '#555',
    padding: '0 10px',
    fontWeight: 'bold',
  },
  form: {
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    color: '#bbb',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#151515',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  forgotPass: {
    fontSize: '12px',
    color: '#888',
    textDecoration: 'none',
  },
  loginBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#16a34a', // Vert FirmaTrack
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '12px',
    marginBottom: '10px',
  },
  footerText: {
    fontSize: '13px',
    color: '#888',
    marginTop: '25px',
  },
  signUpLink: {
    color: '#fff',
    fontWeight: '600',
    textDecoration: 'none',
  }
};

export default Login;