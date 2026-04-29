import React, { useState } from 'react';
import { useStock } from '../hooks/useStock';

const StockForm = ({ onSuccess }) => {
  const { addStock, loading, error, setError } = useStock();
  
  const [formData, setFormData] = useState({
    nom: '',
    type: 'ALIMENTATION',
    quantite: '',
    unite: 'kg',
    seuilAlerte: '',
    prixUnitaire: '',
    dateExpiration: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addStock(formData);
      onSuccess(); // Ferme la modal et rafraîchit la liste
    } catch (err) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={formContainerStyle}>
      <h2 style={titleStyle}>Ajouter un intrant</h2>
      
      {error && <div style={errorStyle}>{error}</div>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={fieldGroup}>
          <label style={labelStyle}>Nom du produit</label>
          <input 
            type="text" name="nom" required 
            value={formData.nom} onChange={handleChange}
            style={inputStyle} placeholder="ex: Foin, Vaccin Rage..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={fieldGroup}>
            <label style={labelStyle}>Type</label>
            <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
              <option value="ALIMENTATION">Alimentation</option>
              <option value="MEDICAMENT">Médicament</option>
              <option value="MATERIEL">Matériel</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Unité</label>
            <input 
              type="text" name="unite" value={formData.unite} 
              onChange={handleChange} style={inputStyle} placeholder="kg, L, doses..."
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={fieldGroup}>
            <label style={labelStyle}>Quantité Initiale</label>
            <input 
              type="number" name="quantite" required
              value={formData.quantite} onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Seuil d'alerte </label>
            <input 
              type="number" name="seuilAlerte" required
              value={formData.seuilAlerte} onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Date d'expiration (Optionnel)</label>
          <input 
            type="date" name="dateExpiration" 
            value={formData.dateExpiration} onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Prix Unitaire (DT)</label>
          <input 
            type="number" step="0.01" name="prixUnitaire" 
            value={formData.prixUnitaire} onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Enregistrement...' : 'Ajouter au stock'}
        </button>
      </form>
    </div>
  );
};

// Styles cohérents avec FirmaTrack
const formContainerStyle = { background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '0.5px solid #e8e7e2' };
const titleStyle = { fontSize: '18px', fontWeight: '500', marginBottom: '1.5rem', color: '#1a1a18' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const fieldGroup = { display: 'flex', flexDirection: 'column', gap: '4px' };
const labelStyle = { fontSize: '11px', fontWeight: '500', color: '#9a9a96', textTransform: 'uppercase' };
const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #f0efe9', fontSize: '13px', outline: 'none', background: '#fcfcfb' };
const buttonStyle = { marginTop: '10px', padding: '12px', borderRadius: '10px', background: '#1a1a18', color: '#fff', border: 'none', fontWeight: '500', cursor: 'pointer' };
const errorStyle = { padding: '10px', background: '#FCEBEB', color: '#A32D2D', borderRadius: '8px', fontSize: '12px', marginBottom: '10px' };

export default StockForm;