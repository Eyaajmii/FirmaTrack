import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import SignalerEpidemieForm from '../components/SignalerEpidemieForm';
import { getMesSignalements, getAllEpidemies } from '../services/VeterinaireService';

// ── الستيل الموحد والأنيق للمشروع ──
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
  // شارة وقائية حمراء خاصة بالأمراض والأوبئة
  diseaseBadge: {
    background: '#FCEBEB',
    color: '#A32D2D',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11.5px',
    fontWeight: '500',
    border: '0.5px solid #A32D2D1a',
    display: 'inline-block'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '10px 8px',
    fontSize: '11px',
    fontWeight: '500',
    color: '#9a9a96',
    textAlign: 'left',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  tr: {
    borderBottom: '0.5px solid #f1f0ec',
    transition: 'background 0.14s ease'
  },
  td: {
    padding: '12px 8px',
    fontSize: '12.5px',
    color: '#1a1a18',
  },
  emptyTd: {
    padding: '3rem 8px',
    fontSize: '12.5px',
    color: '#9a9a96',
    textAlign: 'center',
  }
};

const VigilanceSanitaire = () => {
  const userRole = localStorage.getItem('user_role');
  const isVeterinaire = userRole === 'VETERINAIRE';
  const [alertes, setAlertes] = useState([]);

  const loadAlertes = useCallback(async () => {
    try {
      // Si véto ➔ Voit ses propres alertes. Si Fermier ➔ Voit toutes les alertes de la Tunisie !
      const res = isVeterinaire ? await getMesSignalements() : await getAllEpidemies();
      setAlertes(res.data || []);
    } catch (err) {
      toast.error("Erreur de chargement des alertes.");
    }
  }, [isVeterinaire]);

  useEffect(() => { loadAlertes(); }, [loadAlertes]);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem', fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-center" />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px', color: '#b0afa9', marginBottom: '6px' }}>
          <span>Ferme El Baraka</span>
          <span>/</span>
          <span style={{ color: '#1a1a18' }}>Centre de Vigilance Sanitaire</span>
        </div>

        {/* HEADER */}
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a18', letterSpacing: '-0.4px', margin: 0 }}>
            Centre de Vigilance Sanitaire
          </h1>
          <p style={{ fontSize: '12px', color: '#9a9a96', marginTop: '4px', margin: '4px 0 0' }}>
            {isVeterinaire ? "Signalez les épidémies et gérez vos alertes actives." : "Consultez les alertes sanitaires actives dans votre région."}
          </p>
        </header>

        {/* تخطيط الصفحة: تم توسيع عمود الاستمارة لـ 450px لتعطي الخريطة مساحتها الطبيعية الكاملة */}
        <div style={{ display: 'grid', gridTemplateColumns: isVeterinaire ? '1fr 450px' : '1fr', gap: '1.25rem', alignItems: 'start' }}>
          
          {/* TABLEAU DES ALERTES (Visible par tous) */}
          <div style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={s.cardTitle}>
                {isVeterinaire ? "Historique de vos signalements" : "Alertes Épidémiques Actives en Tunisie"}
              </span>
              <span style={s.badge}>Alertes en cours</span>
            </div>

            <table style={s.table}>
              <thead>
                <tr style={{ borderBottom: '0.5px solid #e8e7e2' }}>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Maladie</th>
                  <th style={s.th}>Gouvernorat</th>
                  <th style={s.th}>Description / Consignes</th>
                </tr>
              </thead>
              <tbody>
                {alertes.length > 0 ? (
                  alertes.map((al, i) => (
                    <tr 
                      key={al.id || i} 
                      style={s.tr}
                      onMouseEnter={e => e.currentTarget.style.background = '#faf9f7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ ...s.td, fontWeight: '500' }}>{al.dateSignalement}</td>
                      <td style={s.td}>
                        <span style={s.diseaseBadge}>{al.maladie}</span>
                      </td>
                      <td style={{ ...s.td, color: '#6b6b67' }}>{al.gouvernorat}</td>
                      <td style={{ ...s.td, color: '#6b6b67', lineHeight: '1.5' }}>{al.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={s.emptyTd}>
                      Aucune alerte sanitaire active. Tout est sous contrôle.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FORMULAIRE DE CRUISE (Visible uniquement par le Vétérinaire) */}
          {isVeterinaire && (
            <aside style={{ position: 'sticky', top: '1.5rem' }}>
              <SignalerEpidemieForm onAlerteCree={loadAlertes} />
            </aside>
          )}

        </div>
      </div>
    </div>
  );
};

export default VigilanceSanitaire;