import React from 'react';

const StockTable = ({ stocks, loading }) => {
  if (loading) return <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px' }}>Chargement...</div>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '0.5px solid #f0efe9', textAlign: 'left' }}>
          <th style={thStyle}>Produit</th>
          <th style={thStyle}>Type</th>
          <th style={thStyle}>Quantité</th>
          <th style={thStyle}>Statut</th>
          <th style={thStyle}>Expiration</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((item) => {
          const isLow = item.quantite <= item.seuilAlerte;
          const isExpired = item.dateExpiration && new Date(item.dateExpiration) < new Date();

          return (
            <tr key={item.id} style={{ borderBottom: '0.5px solid #f0efe9' }}>
              <td style={tdStyle}>
                <div style={{ fontWeight: '500', color: '#1a1a18' }}>{item.nom}</div>
                <div style={{ fontSize: '10px', color: '#b0afa9' }}>Ref: #{item.id}</div>
              </td>
              <td style={tdStyle}>{item.type}</td>
              <td style={tdStyle}>{item.quantite} {item.unite}</td>
              <td style={tdStyle}>
                {/* Logique de statut avec tes styles CSS conservés */}
                {isExpired ? (
                  <span style={badgeStyle('#FCEBEB', '#A32D2D')}>Périmé</span>
                ) : isLow ? (
                  <span style={badgeStyle('#FCEBEB', '#A32D2D')}>Stock Faible</span>
                ) : (
                  <span style={badgeStyle('#EAF3DE', '#3B6D11')}>Optimal</span>
                )}
              </td>
              <td style={tdStyle}>
                <span style={{ color: isExpired ? '#A32D2D' : '#6b6b67' }}>
                  {item.dateExpiration || '-'}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// --- TES STYLES CONSERVÉS À L'IDENTIQUE ---
const thStyle = { padding: '12px 8px', fontSize: '11px', fontWeight: '500', color: '#b0afa9', textTransform: 'uppercase' };
const tdStyle = { padding: '12px 8px', fontSize: '13px', color: '#6b6b67' };
const badgeStyle = (bg, color) => ({
  padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '600', background: bg, color: color
});

export default StockTable;