import { useEffect, useState } from 'react';
import { useProductionOeuf } from '../hooks/useProductionOeuf';
import OeufForm from '../components/OeufForm';
import OeufTable from '../components/OeufTable';
import { OeufByAnimal, OeufByLot } from '../components/OeufByAnimalLot';

const ProductionOeufPage = () => {
  const farmName = localStorage.getItem("farm_name") || "Ma Ferme";
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const {
    productions, loading, error,
    cheptels, lots,
    fetchAllProductions, fetchCheptels, fetchLots,
    fetchProductionsByAnimal, fetchProductionsByLot,
  } = useProductionOeuf();

  useEffect(() => { fetchCheptels(); fetchLots(); }, [fetchCheptels, fetchLots]);
  useEffect(() => { if (activeTab === 'all') fetchAllProductions(); }, [activeTab, fetchAllProductions]);

  // Calculs stats
  const totalOeufs = productions.reduce((acc, p) => acc + (p.quantiteOeufs || 0), 0);
  const qualiteA = productions.filter(p => p.qualite === 'A').length;
  const aujourd = productions.filter(p => {
    const today = new Date().toISOString().split('T')[0];
    return p.dateProduction === today;
  }).reduce((acc, p) => acc + (p.quantiteOeufs || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Breadcrumb + title */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px', color: '#b0afa9', marginBottom: '6px' }}>
            <span>{farmName}</span>
            <span>/</span>
            <span style={{ color: '#1a1a18' }}>Production Œufs</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a18', letterSpacing: '-0.4px' }}>
              Production Œufs
            </h1>
            <button
              onClick={() => setShowForm(true)}
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: '#EAF3DE', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="Nouvelle collecte"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="#3B6D11" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '12px', marginBottom: '1.5rem' }}>
          <StatCard color="amber" label="Total collecté" value={`${totalOeufs}`} unit="œufs" sub={`${productions.length} collectes`} />
          <StatCard color="green" label="Qualité A" value={`${qualiteA}`} unit="collectes" sub="meilleure qualité" />
          <StatCard color="blue"  label="Aujourd'hui" value={`${aujourd}`} unit="œufs" sub="collecte du jour" />
        </div>

        {/* Table card */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '0.5px solid #e8e7e2', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a18' }}>Historique</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ background: '#FAEEDA', color: '#633806', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '500' }}>Œufs</span>
              <span style={{ background: '#f1f0ec', color: '#6b6b67', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '500' }}>{productions.length}</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '2px', background: '#f1f0ec', padding: '3px', borderRadius: '10px', width: 'fit-content', marginBottom: '1.25rem' }}>
            {[{ id: 'all', label: 'Vue globale' }, { id: 'animal', label: 'Par animal' }, { id: 'lot', label: 'Par lot' }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: '500',
                cursor: 'pointer', border: 'none', transition: 'all 0.12s',
                background: activeTab === tab.id ? '#fff' : 'transparent',
                color: activeTab === tab.id ? '#1a1a18' : '#9a9a96',
                boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ marginBottom: '1rem', padding: '10px 12px', background: '#FCEBEB', color: '#791F1F', fontSize: '12px', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          {activeTab === 'all'    && <OeufTable productions={productions} loading={loading} />}
          {activeTab === 'animal' && <OeufByAnimal cheptels={cheptels} productions={productions} loading={loading} fetchByAnimal={fetchProductionsByAnimal} />}
          {activeTab === 'lot'    && <OeufByLot lots={lots} productions={productions} loading={loading} fetchByLot={fetchProductionsByLot} />}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(26,26,24,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50, padding: '1rem',
          }}
        >
          <div style={{ width: '100%', maxWidth: '440px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                position: 'absolute', top: '-12px', right: '-12px',
                width: '28px', height: '28px', borderRadius: '50%',
                background: '#fff', border: '0.5px solid #e8e7e2',
                cursor: 'pointer', fontSize: '16px', color: '#6b6b67',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1,
              }}
            >×</button>
            <OeufForm onSuccess={() => { setShowForm(false); fetchAllProductions(); }} />
          </div>
        </div>
      )}
    </div>
  );
};

const colors = {
  green: { bg: '#EAF3DE', stroke: '#3B6D11', sub: '#2f7c4d' },
  amber: { bg: '#FAEEDA', stroke: '#854F0B', sub: '#854F0B' },
  blue:  { bg: '#e8f0fe', stroke: '#185FA5', sub: '#185FA5' },
};

const StatCard = ({ color, label, value, unit, sub }) => {
  const c = colors[color];
  return (
    <div style={{ background: '#fff', border: '0.5px solid #e8e7e2', borderRadius: '12px', padding: '1rem 1.25rem' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <ellipse cx="10" cy="11" rx="6" ry="7" stroke={c.stroke} strokeWidth="1.5"/>
          <path d="M10 4 C10 4 13 1 15 3" stroke={c.stroke} strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ fontSize: '11px', color: '#9a9a96', fontWeight: '500', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: '500', color: '#1a1a18', lineHeight: 1 }}>
        {value} <span style={{ fontSize: '13px', color: '#9a9a96', fontWeight: '400' }}>{unit}</span>
      </div>
      <div style={{ fontSize: '11px', color: c.sub, marginTop: '6px' }}>{sub}</div>
    </div>
  );
};

export default ProductionOeufPage;