import { useNavigate } from 'react-router-dom';

const VetCard = ({ vet, distance, isActive, onClick }) => {
  const navigate = useNavigate();

  const badge = vet.disponibleUrgence
    ? { label: 'Urgence', color: '#e8453c', bg: '#fff1f0' }
    : vet.deplacementFerme
    ? { label: 'Terrain', color: '#2a7a4b', bg: '#f0faf4' }
    : null;

  const specialites = vet.specialite
    ? vet.specialite.split(',').map(s => s.trim()).join(' · ')
    : '—';

  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
        border: isActive
          ? '1.5px solid #1a1a18'
          : '1px solid rgba(26,26,24,0.10)',
        borderRadius: '12px',
        padding: '14px 16px',
        marginBottom: '10px',
        cursor: 'pointer',
        transition: 'all 0.18s',
        boxShadow: isActive
          ? '0 4px 18px rgba(26,26,24,0.10)'
          : '0 1px 4px rgba(26,26,24,0.04)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* Ligne 1: nom + badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
        <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#1a1a18', lineHeight: 1.3 }}>
          {vet.nomVet || `Vétérinaire #${vet.id}`}
        </div>
        {badge && (
          <span style={{
            fontSize: '10px', fontWeight: '600', color: badge.color,
            background: badge.bg, padding: '2px 8px', borderRadius: '20px',
            border: `1px solid ${badge.color}22`, flexShrink: 0, marginLeft: '8px',
          }}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Ligne 2: spécialités */}
      <div style={{ fontSize: '11.5px', color: '#8a8a80', marginBottom: '8px' }}>
        {specialites}
      </div>

      {/* Ligne 3: distance + note + disponibilité */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px', color: '#6a6a64' }}>
        {distance != null && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 11v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {distance < 1
              ? `${Math.round(distance * 1000)} m`
              : `${distance.toFixed(1)} km`}
          </span>
        )}
        {vet.noteMoyenne != null && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="#f5a623">
              <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.3l-3.7 2 .7-4.1-3-2.9 4.2-.7z"/>
            </svg>
            {vet.noteMoyenne.toFixed(1)}
            {vet.nombreAvis && (
              <span style={{ color: '#b0afa8' }}>({vet.nombreAvis} avis)</span>
            )}
          </span>
        )}
        {vet.statut === 'Actif' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2a7a4b' }}>
            <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Dispo
          </span>
        )}
      </div>

      {/* Bouton Voir la fiche */}
      <button
        onClick={(e) => { e.stopPropagation(); navigate(`/veterinairesproche/${vet.id}`); }}
        style={{
          marginTop: '12px',
          width: '100%',
          padding: '8px',
          background: 'rgba(26,26,24,0.04)',
          border: '1px solid rgba(26,26,24,0.10)',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '500',
          color: '#1a1a18',
          cursor: 'pointer',
          transition: 'background 0.14s',
          fontFamily: 'DM Sans, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,26,24,0.09)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(26,26,24,0.04)'}
      >
        Voir la fiche
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default VetCard;