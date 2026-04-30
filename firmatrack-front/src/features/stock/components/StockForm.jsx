import React, { useState } from 'react';
import { useStock } from '../hooks/useStock';
import { useToast, ToastContainer } from '../../../components/common/Toast';

const StockForm = ({ onSuccess }) => {
  const { addStock, loading } = useStock();
  const { toasts, removeToast, toast } = useToast();

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

    if (parseFloat(formData.quantite) < 0) {
      toast.warning("La quantité ne peut pas être négative");
      return;
    }
    if (parseFloat(formData.seuilAlerte) < 0) {
      toast.warning("Le seuil d'alerte ne peut pas être négatif");
      return;
    }
    if (formData.prixUnitaire && parseFloat(formData.prixUnitaire) < 0) {
      toast.warning("Le prix unitaire ne peut pas être négatif");
      return;
    }

    try {
      await addStock(formData);
      toast.success(`"${formData.nom}" ajouté au stock`);
      setFormData({
        nom: '', type: 'ALIMENTATION', quantite: '',
        unite: 'kg', seuilAlerte: '', prixUnitaire: '', dateExpiration: ''
      });
      setTimeout(() => onSuccess(), 1000);
    } catch (err) {
      toast.error("Échec de l'enregistrement. Veuillez réessayer.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Ajouter un intrant</h2>

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
              <label style={labelStyle}>Seuil d'alerte</label>
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

          <button type="submit" disabled={loading} style={{
            ...buttonStyle,
            background: loading ? '#f1f0ec' : '#1a1a18',
            color: loading ? '#9a9a96' : '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Enregistrement...' : 'Ajouter au stock'}
          </button>
        </form>
      </div>
    </>
  );
};

const formContainerStyle = { background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '0.5px solid #e8e7e2' };
const titleStyle = { fontSize: '14px', fontWeight: '500', marginBottom: '1.25rem', color: '#1a1a18' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const fieldGroup = { display: 'flex', flexDirection: 'column', gap: '4px' };
const labelStyle = { fontSize: '10px', fontWeight: '500', color: '#9a9a96', textTransform: 'uppercase', letterSpacing: '0.07em' };
const inputStyle = { padding: '9px 12px', borderRadius: '9px', border: '0.5px solid #e8e7e2', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box', width: '100%' };
const buttonStyle = { marginTop: '4px', padding: '10px', borderRadius: '9px', border: 'none', fontWeight: '500', fontSize: '13px', width: '100%' };

export default StockForm;