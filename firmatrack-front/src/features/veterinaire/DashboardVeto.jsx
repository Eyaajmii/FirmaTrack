import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';

// ── الستيل العام للمشروع (موضّع بالأعلى لتفادي أي أخطاء برمجية) ──
const s = {
  card: {
    background: '#fff',
    border: '0.5px solid #e8e7e2',
    borderRadius: '14px',
    padding: '1.5rem',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a18',
  },
  badge: {
    background: '#f1f0ec',
    color: '#6b6b67',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '500',
    border: '0.5px solid #e8e7e2',
  },
  urgencyWidget: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fff',
    padding: '8px 14px',
    borderRadius: '10px',
    border: '0.5px solid #e8e7e2',
    fontSize: '12px'
  },
  kpiCard: {
    background: '#fff',
    border: '0.5px solid #e8e7e2',
    borderRadius: '14px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box'
  },
  iconWrapper: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px'
  },
  kpiLabel: {
    fontSize: '10.5px',
    fontWeight: '500',
    color: '#9a9a96',
    letterSpacing: '0.04em',
    textTransform: 'uppercase'
  },
  kpiValue: {
    fontSize: '24px',
    fontWeight: '500',
    color: '#1a1a18',
    lineHeight: 1
  },
  kpiUnit: {
    fontSize: '11px',
    color: '#9a9a96',
    fontWeight: '500'
  },
  kpiSub: {
    fontSize: '11px',
    color: '#9a9a96',
    marginTop: '4px'
  },
  alertBanner: {
    display: 'flex',
    alignItems: 'start',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '10px',
    background: '#eff6ff',
    border: '0.5px solid #2563eb22',
    color: '#2563eb',
    marginBottom: '1rem',
    lineHeight: '1.5',
    fontSize: '12.5px'
  }
};

// --- Icônes SVG Professionnelles et Épurées ---
const IconStethoscope = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 2v6a4 4 0 008 0V2M11 5h3.5a1.5 1.5 0 011.5 1.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3.5" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 2v3M11 2v3M2 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M8 2L15 14H1L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6v4M8 11.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconInfo = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 10V8M8 6h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const DashboardVeto = () => {
  const userName = localStorage.getItem('user_name') || 'Expert';
  
  const [stats, setStats] = useState({
    consultations: 12,
    rendezVous: 3,
    alertesEmises: 1
  });

  const [dispoUrgence] = useState(true);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem', fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-center" />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px', color: '#b0afa9', marginBottom: '6px' }}>
          <span>Ferme El Baraka</span>
          <span>/</span>
          <span style={{ color: '#1a1a18' }}>Portail Vétérinaire</span>
        </div>

        {/* --- HEADER (بدون زر العودة) --- */}
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a18', letterSpacing: '-0.4px', margin: 0 }}>
              Portail Vétérinaire
            </h1>
            <p style={{ fontSize: '12px', color: '#9a9a96', marginTop: '4px', margin: '4px 0 0' }}>
              Bienvenue, Dr. <strong>{userName}</strong>. Suivi de votre activité médicale et alertes de vigilance.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* INDICATEUR D'URGENCE EN DIRECT */}
            <div style={s.urgencyWidget}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: dispoUrgence ? '#3B6D11' : '#9a9a96',
                boxShadow: dispoUrgence ? '0 0 8px rgba(59, 109, 17, 0.6)' : 'none',
                animation: dispoUrgence ? 'pulse 1.8s infinite' : 'none'
              }} />
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#1a1a18', letterSpacing: '0.03em' }}>
                {dispoUrgence ? 'DISPONIBLE URGENCE 24h/24' : 'HORS LIGNE'}
              </span>
            </div>
          </div>
        </header>

        {/* --- تصميم الصفحة بعمود واحد متناسق كامل العرض ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* KPI CARDS (3 الأعمدة تأخذ كامل العرض بشكل مريح) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
            
            {/* Consultations */}
            <div style={{ ...s.kpiCard, borderTop: '3px solid #2563eb' }}>
              <div style={{ ...s.iconWrapper, background: '#eff6ff', color: '#2563eb' }}>
                <IconStethoscope />
              </div>
              <span style={s.kpiLabel}>Mes Diagnostics</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '4px 0' }}>
                <span style={s.kpiValue}>{stats.consultations}</span>
                <span style={s.kpiUnit}>fiches</span>
              </div>
              <span style={s.kpiSub}>Carnets de santé signés</span>
            </div>

            {/* Rendez-vous */}
            <div style={{ ...s.kpiCard, borderTop: '3px solid #3B6D11' }}>
              <div style={{ ...s.iconWrapper, background: '#EAF3DE', color: '#3B6D11' }}>
                <IconCalendar />
              </div>
              <span style={s.kpiLabel}>Rendez-vous à venir</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '4px 0' }}>
                <span style={s.kpiValue}>{stats.rendezVous}</span>
                <span style={s.kpiUnit}>visites</span>
              </div>
              <span style={s.kpiSub}>Planifiés par les éleveurs</span>
            </div>

            {/* Alertes */}
            <div style={{ ...s.kpiCard, borderTop: '3px solid #A32D2D' }}>
              <div style={{ ...s.iconWrapper, background: '#FCEBEB', color: '#A32D2D' }}>
                <IconAlert />
              </div>
              <span style={s.kpiLabel}>Alertes Émises</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '4px 0' }}>
                <span style={{ ...s.kpiValue, color: '#A32D2D' }}>{stats.alertesEmises}</span>
                <span style={s.kpiUnit}>foyers</span>
              </div>
              <span style={s.kpiSub}>Signalements régionaux</span>
            </div>
          </div>

          {/* Section d'information clinique */}
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={s.cardTitle}>Vigilance Sanitaire Régionale</span>
              <span style={s.badge}>Directives CRDA</span>
            </div>

            <div style={s.alertBanner}>
              <IconInfo />
              <span>
                Conformément aux directives du <strong>CRDA (Commissariat Régional au Développement Agricole)</strong>, veuillez signaler immédiatement tout cas suspect ou avéré de <strong>Rage</strong> ou de <strong>Fièvre Aphteuse</strong> dans le gouvernorat de Tunis ou de l'Ariana.
              </span>
            </div>

            <p style={{ fontSize: '12.5px', color: '#6b6b67', lineHeight: '1.6', margin: 0 }}>
              La publication d'une alerte met instantanément à jour la carte épidémiologique de vigilance destinée à tous les fermiers de la zone, facilitant la mise en quarantaine rapide des animaux.
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
      `}</style>

    </div>
  );
};

export default DashboardVeto;