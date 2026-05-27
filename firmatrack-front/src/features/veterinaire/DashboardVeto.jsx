import React from 'react';
import { useNavigate } from 'react-router-dom';

// --- Icônes SVG Pro ---
const IconMessageSquare = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1a1a18' }}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconActivity = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1a1a18' }}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const DashboardVeto = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Expert';

  return (
    <div style={{ padding: '3rem', maxWidth: '900px', margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1a1a18', margin: 0, letterSpacing: '-0.5px' }}>
          Espace Vétérinaire
        </h1>
        <p style={{ fontSize: '14px', color: '#7a7a74', marginTop: '6px' }}>
          Bienvenue, Dr. <b>{userName}</b>. Pilotez vos interventions et conseillez la communauté.
        </p>
      </header>

      {/* Raccourcis cartes (SaaS Style - Sans émojis) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        
        {/* LIEN VERS LE FORUM */}
        <div 
          onClick={() => navigate('/forum')} 
          style={styles.card}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1a1a18'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e8e7e2'}
        >
          <div style={styles.iconWrapper}>
            <IconMessageSquare />
          </div>
          <h3 style={{ margin: '14px 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#1a1a18' }}>
            Forum d'entraide
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#7a7a74', lineHeight: '1.5' }}>
            Consultez les questions urgentes des éleveurs et apportez vos diagnostics certifiés.
          </p>
        </div>

        {/* LIEN VERS LE CARNET DE SANTÉ */}
        <div 
          onClick={() => navigate('/carnetsante')} 
          style={styles.card}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1a1a18'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e8e7e2'}
        >
          <div style={styles.iconWrapper}>
            <IconActivity />
          </div>
          <h3 style={{ margin: '14px 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#1a1a18' }}>
            Carnets de Santé & Soins
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#7a7a74', lineHeight: '1.5' }}>
            Gérez l'historique médical des animaux, enregistrez des maladies et planifiez des vaccins.
          </p>
        </div>

      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '24px',
    border: '1px solid #e8e7e2',
    boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: '#faf9f6',
    border: '1px solid #e8e7e2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default DashboardVeto;