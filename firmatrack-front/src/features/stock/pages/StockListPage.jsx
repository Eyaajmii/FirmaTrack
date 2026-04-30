import React, { useEffect, useState, useMemo } from 'react';
import { useStock } from '../hooks/useStock';
import StockTable from '../components/StockTable';
import StockForm from '../components/StockForm';

const StockListPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { stocks, alertes, loading, error, fetchAllStock, fetchAlertes } = useStock();

  useEffect(() => {
    fetchAllStock();
    fetchAlertes();
  }, [fetchAllStock, fetchAlertes]);

  // Statistiques pour les StatCards
  const stats = useMemo(() => {
    return {
      totalArticles: stocks.length,
      critiques: alertes.quantite.length,
      perimes: alertes.peremption.length
    };
  }, [stocks, alertes]);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px', color: '#b0afa9', marginBottom: '6px' }}>
            <span>Ferme El Baraka</span> <span>/</span> <span style={{ color: '#1a1a18' }}>Gestion des Stocks</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a18' }}>Inventaire & Intrants</h1>
            <button onClick={() => setShowForm(true)} style={btnPlusStyle}>
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                 <path d="M8 3v10M3 8h10" stroke="#3B6D11" strokeWidth="1.8" strokeLinecap="round"/>
               </svg>
            </button>
          </div>
        </div>

        {/* Stat Cards (US 55) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
          <StatCard icon="green" label="Articles en Stock" value={stats.totalArticles} sub="Inventaire total" />
          <StatCard 
            icon="amber" 
            label="Stock Critique" 
            value={stats.critiques} 
            sub="Quantité faible" 
            subColor={stats.critiques > 0 ? '#A32D2D' : '#2f7c4d'} 
          />
          <StatCard 
            icon="blue" 
            label="Péremptions" 
            value={stats.perimes} 
            sub="À vérifier" 
            subColor={stats.perimes > 0 ? '#A32D2D' : '#185FA5'} 
          />
        </div>

        {/* Table (US 49) */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '0.5px solid #e8e7e2', padding: '1.5rem' }}>
           <StockTable stocks={stocks} loading={loading} />
        </div>
      </div>

      {/* Modal Formulaire (US 51) */}
      {showForm && (
        <div style={modalOverlayStyle} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{ width: '100%', maxWidth: '450px' }}>
            <StockForm onSuccess={() => { setShowForm(false); fetchAllStock(); fetchAlertes(); }} />
          </div>
        </div>
      )}
    </div>
  );
};

// Réutilisation de ton composant StatCard (simplifié ici pour l'exemple)
const StatCard = ({ icon, label, value, sub, subColor }) => {
  const colors = {
    green: { bg: '#EAF3DE', stroke: '#3B6D11' },
    blue: { bg: '#e8f0fe', stroke: '#185FA5' },
    amber: { bg: '#FCEBEB', stroke: '#A32D2D' },
  };
  const c = colors[icon] || colors.green;
  return (
    <div style={{ background: '#fff', border: '0.5px solid #e8e7e2', borderRadius: '12px', padding: '1rem' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.stroke }}></div>
      </div>
      <div style={{ fontSize: '11px', color: '#9a9a96', fontWeight: '500' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: '500', color: '#1a1a18' }}>{value}</div>
      <div style={{ fontSize: '11px', color: subColor || '#9a9a96', marginTop: '4px' }}>{sub}</div>
    </div>
  );
};

const btnPlusStyle = {
  width: '36px', height: '36px', borderRadius: '10px', background: '#EAF3DE', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const modalOverlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(26,26,24,0.35)', 
  display: 'flex', alignItems: 'center', justifyContent: 'center', 
  zIndex: 100,
  padding: '1rem',
  boxSizing: 'border-box',
};

export default StockListPage;