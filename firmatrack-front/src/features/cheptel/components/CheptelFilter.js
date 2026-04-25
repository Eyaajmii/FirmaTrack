function CheptelFilter({ onFilter, onSearch, onReset }) {
  const inputStyle = {
    padding: '9px 12px', border: '0.5px solid #e8e7e2', borderRadius: '9px',
    fontSize: '12px', color: '#1a1a18', background: '#fff', outline: 'none',
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
          style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
          <circle cx="6.5" cy="6.5" r="4.5" stroke="#b0afa9" strokeWidth="1.5"/>
          <path d="M10 10l3 3" stroke="#b0afa9" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          placeholder="Rechercher par numéro..."
          onChange={(e) => onSearch(e.target.value)}
          style={{ ...inputStyle, width: '100%', paddingLeft: '30px', boxSizing: 'border-box' }}
        />
      </div>

      {/* Statut filter */}
      <select onChange={(e) => onFilter(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
        <option value="">Tous les statuts</option>
        <option value="ALIVE">Vivants</option>
        <option value="SOLD">Vendus</option>
        <option value="DEAD">Décédés</option>
      </select>

      {/* Reset */}
      <button
        onClick={onReset}
        style={{
          padding: '9px 14px', border: '0.5px solid #e8e7e2', borderRadius: '9px',
          fontSize: '12px', color: '#6b6b67', background: '#fff', cursor: 'pointer',
        }}
      >
        Réinitialiser
      </button>
    </div>
  );
}

export default CheptelFilter;