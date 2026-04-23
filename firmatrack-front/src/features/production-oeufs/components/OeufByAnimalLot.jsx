// ─── OeufByAnimal.jsx ─────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import OeufTable from './OeufTable';

export const OeufByAnimal = ({ cheptels, productions, loading, fetchByAnimal }) => {
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    if (selectedId) fetchByAnimal(selectedId);
  }, [selectedId, fetchByAnimal]);

  const filterStyle = {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: '#faf9f7', borderRadius: '10px', padding: '10px 14px',
    border: '0.5px solid #e8e7e2',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={filterStyle}>
        <span style={{ fontSize: '10px', fontWeight: '500', color: '#b0afa9', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
          Filtrer par animal
        </span>
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}
          style={{ flex: 1, background: 'transparent', border: 'none', fontSize: '13px', fontWeight: '500', color: '#1a1a18', outline: 'none', cursor: 'pointer' }}>
          <option value="">-- Sélectionnez un animal --</option>
          {cheptels.map(a => (
            <option key={a.id} value={a.id}>{a.nom} ({a.chepnumber})</option>
          ))}
        </select>
      </div>
      {!selectedId ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', border: '1.5px dashed #e8e7e2', borderRadius: '10px', fontSize: '12px', color: '#b0afa9' }}>
          Sélectionnez un animal pour voir sa production.
        </div>
      ) : (
        <OeufTable productions={productions} loading={loading} />
      )}
    </div>
  );
};

// ─── OeufByLot.jsx ────────────────────────────────────────────────────────────
export const OeufByLot = ({ lots, productions, loading, fetchByLot }) => {
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    if (selectedId) fetchByLot(selectedId);
  }, [selectedId, fetchByLot]);

  const filterStyle = {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: '#faf9f7', borderRadius: '10px', padding: '10px 14px',
    border: '0.5px solid #e8e7e2',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={filterStyle}>
        <span style={{ fontSize: '10px', fontWeight: '500', color: '#b0afa9', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
          Filtrer par lot
        </span>
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}
          style={{ flex: 1, background: 'transparent', border: 'none', fontSize: '13px', fontWeight: '500', color: '#1a1a18', outline: 'none', cursor: 'pointer' }}>
          <option value="">-- Sélectionnez un lot --</option>
          {lots.map(l => (
            <option key={l.id} value={l.id}>{l.nom}</option>
          ))}
        </select>
      </div>
      {!selectedId ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', border: '1.5px dashed #e8e7e2', borderRadius: '10px', fontSize: '12px', color: '#b0afa9' }}>
          Sélectionnez un lot pour analyser la production du groupe.
        </div>
      ) : (
        <OeufTable productions={productions} loading={loading} />
      )}
    </div>
  );
};