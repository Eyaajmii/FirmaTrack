import { useState } from 'react';

const FILTERS = [
  { key: 'tous',            label: 'Tous' },
  { key: 'Bovins',          label: 'Bovins' },
  { key: 'Volailles',       label: 'Volailles' },
  { key: 'Ovins',           label: 'Ovins' },
  { key: 'urgence',         label: 'Urgence',           dot: '#e8453c' },
  { key: 'deplacementFerme',label: 'Déplacement ferme' },
];

const VetFilterBar = ({ activeFilter, onFilterChange }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '7px',
      flexWrap: 'wrap',
      marginBottom: '18px',
    }}>
      {FILTERS.map(f => {
        const isActive = activeFilter === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 13px',
              borderRadius: '20px',
              border: isActive
                ? '1.5px solid #1a1a18'
                : '1px solid rgba(26,26,24,0.15)',
              background: isActive ? '#1a1a18' : 'rgba(255,255,255,0.7)',
              color: isActive ? '#fff' : '#6a6a64',
              fontSize: '12px',
              fontWeight: isActive ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'DM Sans, sans-serif',
              backdropFilter: 'blur(4px)',
            }}
          >
            {f.label}
            {f.dot && (
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: f.dot, flexShrink: 0,
                boxShadow: isActive ? '0 0 0 2px rgba(232,69,60,0.25)' : 'none',
              }}/>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default VetFilterBar;