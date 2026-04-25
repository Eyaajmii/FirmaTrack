import { useEffect, useState } from "react";
import * as service from "../services/CheptelService";
import CheptelForm from "../components/CheptelForm";
import CheptelFilter from "../components/CheptelFilter";
import CheptelList from "../components/CheptelList";

function CheptelPage() {
  const [animals, setAnimals] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchAnimals = async () => {
    const res = await service.getAllAnimals();
    setAnimals(res.data);
  };

  useEffect(() => { fetchAnimals(); }, []);

  const handleAdd = async (data) => {
    await service.createAnimal(data);
    fetchAnimals();
  };

  const handleDelete = async (id) => {
    await service.deleteAnimal(id);
    fetchAnimals();
  };

  const handleFilter = async (status) => {
    if (!status) { fetchAnimals(); return; }
    const res = await service.getByStatus(status);
    setAnimals(res.data);
  };

  const handleSearch = async (value) => {
    if (!value) { fetchAnimals(); return; }
    try {
      const res = await service.getByNumber(value);
      setAnimals([res.data]);
    } catch {
      setAnimals([]);
    }
  };

  const statuts = {
    ALIVE: animals.filter(a => a.statut === 'ALIVE').length,
    SOLD:  animals.filter(a => a.statut === 'SOLD').length,
    DEAD:  animals.filter(a => a.statut === 'DEAD').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f4', padding: '2rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Breadcrumb + title */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11px', color: '#b0afa9', marginBottom: '6px' }}>
            <span>Ferme El Baraka</span>
            <span>/</span>
            <span style={{ color: '#1a1a18' }}>Cheptel</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a18', letterSpacing: '-0.4px' }}>
              Cheptel
            </h1>
            <button
              onClick={() => setShowForm(true)}
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: '#EAF3DE', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="Ajouter un animal"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="#3B6D11" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '12px', marginBottom: '1.5rem' }}>
          <StatCard color="green" label="Vivants" value={statuts.ALIVE} sub={`sur ${animals.length} animaux`} />
          <StatCard color="amber" label="Vendus"  value={statuts.SOLD}  sub="cette période" />
          <StatCard color="red"   label="Décédés" value={statuts.DEAD}  sub="cette période" />
        </div>

        {/* Table card */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '0.5px solid #e8e7e2', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a18' }}>Inventaire</span>
            <span style={{ background: '#f1f0ec', color: '#6b6b67', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '500' }}>
              {animals.length} animaux
            </span>
          </div>

          <CheptelFilter onFilter={handleFilter} onSearch={handleSearch} onReset={fetchAnimals} />

          <div style={{ marginTop: '1.25rem' }}>
            <CheptelList animals={animals} onDelete={handleDelete} />
          </div>
        </div>
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(26,26,24,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50, padding: '1rem',
          }}
        >
          <div style={{ width: '100%', maxWidth: '480px', position: 'relative' }}>
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
            <CheptelForm onAdd={(data) => { handleAdd(data); setShowForm(false); }} />
          </div>
        </div>
      )}
    </div>
  );
}

const colors = {
  green: { bg: '#EAF3DE', stroke: '#3B6D11', sub: '#2f7c4d' },
  amber: { bg: '#FAEEDA', stroke: '#854F0B', sub: '#854F0B' },
  red:   { bg: '#FCEBEB', stroke: '#A32D2D', sub: '#A32D2D' },
};

const StatCard = ({ color, label, value, sub }) => {
  const c = colors[color];
  return (
    <div style={{ background: '#fff', border: '0.5px solid #e8e7e2', borderRadius: '12px', padding: '1rem 1.25rem' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5" r="3" stroke={c.stroke} strokeWidth="1.4"/>
          <path d="M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke={c.stroke} strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ fontSize: '11px', color: '#9a9a96', fontWeight: '500', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: '500', color: '#1a1a18', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '11px', color: c.sub, marginTop: '6px' }}>{sub}</div>
    </div>
  );
};

export default CheptelPage;