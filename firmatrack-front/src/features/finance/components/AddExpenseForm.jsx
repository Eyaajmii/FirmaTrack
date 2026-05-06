import React, { useState } from 'react';
import financeService from '../services/financeService';

const AddExpenseForm = ({ onExpenseAdded }) => {
  const fermierId = localStorage.getItem('user_id');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    categorie: 'ALIMENTATION',
    montant: '',
    description: ''
  });

  const categories = [
    { value: 'ALIMENTATION', label: '🌾 Alimentation / 3alef' },
    { value: 'EAU_ELECTRICITE', label: '💧 Eau & Électricité' },
    { value: 'SALAIRE_OUVRIER', label: '👥 Salaires Ouvriers' },
    { value: 'SANTE_VETERINAIRE', label: '⚕️ Santé & Vétérinaire' },
    { value: 'TRANSPORT', label: '🚚 Transport' },
    { value: 'ENTRETIEN_MATERIEL', label: '🛠️ Entretien Matériel' },
    { value: 'AUTRES', label: '📦 Autres' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await financeService.addDepense(fermierId, formData);
      setFormData({ categorie: 'ALIMENTATION', montant: '', description: '' }); // Reset
      onExpenseAdded(); // Rafraîchir les calculs sur le dashboard
      alert("Dépense enregistrée !");
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.formContainer}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1.5rem', color: '#1a1a18' }}>
        ➕ Enregistrer une nouvelle dépense
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Catégorie */}
        <div>
          <label style={styles.label}>Catégorie</label>
          <select 
            style={styles.input}
            value={formData.categorie}
            onChange={(e) => setFormData({...formData, categorie: e.target.value})}
          >
            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        {/* Montant */}
        <div>
          <label style={styles.label}>Montant (DT)</label>
          <input 
            type="number" 
            step="0.001"
            placeholder="0.000"
            style={styles.input}
            value={formData.montant}
            onChange={(e) => setFormData({...formData, montant: e.target.value})}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label style={styles.label}>Note / Description</label>
          <textarea 
            placeholder="Ex: Achat de 5 sacs de maïs..."
            style={{ ...styles.input, height: '80px', resize: 'none' }}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            ...styles.button, 
            background: loading ? '#ccc' : '#1a1a18',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Enregistrement...' : 'Enregistrer la dépense'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  formContainer: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(26,26,24,0.08)',
  },
  label: { display: 'block', fontSize: '12px', fontWeight: '500', color: '#7a7a74', marginBottom: '6px' },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #e8e7e2',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'inherit'
  },
  button: {
    padding: '12px',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s'
  }
};

export default AddExpenseForm;