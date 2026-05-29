import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as VeterinaireService from '../services/VeterinaireService';


const InfoGrid = ({ items }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
    {items.map(({ label, value }) => value ? (
      <div key={label} style={{
        background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(26,26,24,0.09)',
        borderRadius: '10px', padding: '12px 14px',
      }}>
        <div style={{ fontSize: '9.5px', fontWeight: '600', color: '#b0afa8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontSize: '13.5px', fontWeight: '500', color: '#1a1a18' }}>
          {value}
        </div>
      </div>
    ) : null)}
  </div>
);

const VetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vet, setVet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPos, setUserPos] = useState(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
    );
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await VeterinaireService.getVeterinaireById(id);
        console.log(res);
        setVet(res.data);
      } catch {
        setError('Impossible de charger la fiche vétérinaire.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'DM Sans, sans-serif', color: '#8a8a80', fontSize: '13px', gap: '10px' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
      </svg>
      Chargement…
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error || !vet) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'DM Sans, sans-serif', color: '#c0392b', fontSize: '13px' }}>
      {error || 'Vétérinaire introuvable.'}
    </div>
  );

  const distance = (userPos && vet.latitude && vet.longitude)
    ? VeterinaireService.calculDistance(userPos.lat, userPos.lng, vet.latitude, vet.longitude)
    : null;

  const specialites = vet.specialite
    ? vet.specialite.split(',').map(s => s.trim()).join(' · ')
    : '—';

  const badge = vet.disponibleUrgence
    ? { label: 'Urgence', color: '#e8453c' }
    : vet.deplacementFerme
    ? { label: 'Terrain', color: '#2a7a4b' }
    : null;

  const telephone = vet.user?.telephone || vet.telephone || null;
  const initiales = vet.nomVet
    ? vet.nomVet.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* ── Header (style CheptelPage) ── */}
        <div style={{ marginBottom: '2rem' }}>

          {/* Fil d'Ariane */}
          <div style={{
            display: 'flex', gap: '6px', alignItems: 'center',
            fontSize: '11px', color: '#b0afa9', marginBottom: '6px',
          }}>
            <span>Ferme El Baraka</span>
            <span>/</span>
            <span>Vétérinaires</span>
            <span>/</span>
            <span style={{ color: '#1a1a18' }}>{vet.nomVet || `Vétérinaire #${vet.id}`}</span>
          </div>

          {/* Titre + bouton retour */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{
              margin: 0, fontSize: '22px', fontWeight: '500',
              color: '#1a1a18', letterSpacing: '-0.4px',
            }}>
              {vet.nomVet || `Vétérinaire #${vet.id}`}
            </h1>
            <button
              onClick={() => navigate('/veterinairesproches')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: '#fff', border: '0.5px solid #e8e7e2',
                borderRadius: '10px', padding: '7px 13px', cursor: 'pointer',
                fontSize: '12px', color: '#6a6a64', transition: 'all 0.14s',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Retour
            </button>
          </div>

          {/* Sous-titre : spécialités + badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#8a8a80' }}>
              {specialites}
              {vet.diplome && ` · ${vet.diplome}`}
            </span>
            {badge && (
              <span style={{
                fontSize: '10px', fontWeight: '600', color: badge.color,
                border: `1px solid ${badge.color}33`, padding: '2px 9px',
                borderRadius: '20px', background: `${badge.color}10`,
                display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                {badge.label === 'Urgence' && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.color, animation: 'pulse 1.5s ease-in-out infinite' }}/>
                )}
                {badge.label}
              </span>
            )}
          </div>

          {/* Note étoiles */}
          {vet.noteMoyenne != null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="12" height="12" viewBox="0 0 16 16" fill={i <= Math.round(vet.noteMoyenne) ? '#f5a623' : '#e0ddd6'}>
                  <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.3l-3.7 2 .7-4.1-3-2.9 4.2-.7z"/>
                </svg>
              ))}
              <span style={{ fontSize: '11.5px', color: '#6a6a64', marginLeft: '4px' }}>
                {vet.noteMoyenne.toFixed(1)}
                {vet.nombreAvis && <span style={{ color: '#b0afa8' }}> ({vet.nombreAvis} avis)</span>}
              </span>
            </div>
          )}
        </div>
        {/* ── Fin Header ── */}

        {/* ── Contenu principal ── */}
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Infos cabinet */}
        <InfoGrid items={[
          { label: 'Cabinet', value: vet.nomCabinet },
          { label: 'Tarif consultation', value: vet.tarifConsultation ? `${vet.tarifConsultation} TND` : null },
          { label: 'Horaires', value: vet.horairesConsultation || (vet.joursDisponibles ? `${vet.joursDisponibles}` : null) },
          { label: 'Expérience', value: vet.anneesExperience ? `${vet.anneesExperience} ans` : null },
          { label: 'Université', value: vet.universite },
          { label: 'Statut', value: vet.statut },
        ]} />

        {/* Localisation */}
        {(vet.localisation || distance != null) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(26,26,24,0.09)',
            borderRadius: '10px', padding: '12px 16px', marginBottom: '14px',
            fontSize: '12.5px', color: '#5a5a54',
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="7" r="3" stroke="#3b6fd4" strokeWidth="1.5"/>
              <path d="M8 11v3" stroke="#3b6fd4" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M4 7a4 4 0 018 0c0 3-4 7-4 7s-4-4-4-7z" stroke="#3b6fd4" strokeWidth="1.3"/>
            </svg>
            <span>
              {vet.localisation}
              {distance != null && (
                <span style={{ marginLeft: '8px', fontWeight: '600', color: '#3b6fd4' }}>
                  — {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`} de vous
                </span>
              )}
            </span>
          </div>
        )}

        {/* Déplacement ferme */}
        {(vet.deplacementFerme || vet.tarifUrgence) && (
          <div style={{
            background: 'rgba(42,122,75,0.06)', border: '1px solid rgba(42,122,75,0.18)',
            borderRadius: '10px', padding: '10px 16px', marginBottom: '20px',
            fontSize: '11.5px', color: '#2a7a4b',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M1 10l2-5h10l2 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="1" y="10" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              <circle cx="4.5" cy="14" r="1" fill="currentColor"/>
              <circle cx="11.5" cy="14" r="1" fill="currentColor"/>
            </svg>
            {vet.deplacementFerme && 'Déplacement à la ferme disponible'}
            {vet.tarifUrgence && ` · Tarif urgence : ${vet.tarifUrgence} TND`}
          </div>
        )}

        {/* ── Boutons CTA ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>

          {/* GPS */}
          <button
            className="vet-btn-gps"
            disabled={!vet.latitude || !vet.longitude}
            onClick={() => VeterinaireService.ouvrirItineraireGPS(vet.latitude, vet.longitude, vet.nomCabinet)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '13px 16px', borderRadius: '11px', border: '1.5px solid rgba(59,111,212,0.35)',
              background: 'rgba(59,111,212,0.08)', color: '#3b6fd4',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              transition: 'all 0.16s', fontFamily: 'DM Sans, sans-serif',
              opacity: (!vet.latitude || !vet.longitude) ? 0.45 : 1,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
            Itinéraire GPS
          </button>

          {/* Appeler */}
          <button
            className="vet-btn-call"
            onClick={() => VeterinaireService.appelerVeterinaire(telephone)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '13px 16px', borderRadius: '11px', border: 'none',
              background: '#2a7a4b', color: '#fff',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              transition: 'all 0.16s', fontFamily: 'DM Sans, sans-serif',
              boxShadow: '0 3px 14px rgba(42,122,75,0.25)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.8 19.79 19.79 0 01.01 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
            </svg>
            Appeler
          </button>
        </div>

        {/* Téléphone affiché */}
        {telephone && (
          <div style={{ textAlign: 'center', fontSize: '11.5px', color: '#9a9a90', marginBottom: '8px' }}>
            {telephone}
          </div>
        )}

        </div>
        {/* ── Fin Contenu principal ── */}

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
};

export default VetDetailPage;