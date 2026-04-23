import { useEffect, useState } from 'react';
import { useProductionLait } from '../hooks/useProductionLait';
import { useToast, ToastContainer } from '../../../components/common/Toast';

const ProductionForm = ({ onSuccess }) => {
  const { addProduction, loading, cheptels, lots, fetchCheptels, fetchLots } = useProductionLait();
  const { toasts, removeToast, toast } = useToast();

  const [formData, setFormData] = useState({
    dateProduction: new Date().toISOString().split('T')[0],
    quantiteLitre: '',
    typeProduction: 'animal',
    cheptelId: '',
    lotId: '',
  });

  useEffect(() => { fetchCheptels(); fetchLots(); }, [fetchCheptels, fetchLots]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'typeProduction') {
      setFormData(prev => ({ ...prev, typeProduction: value, cheptelId: '', lotId: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const qty = parseFloat(formData.quantiteLitre);

    if (!formData.quantiteLitre) {
      toast.warning("La quantité en litres est obligatoire");
      return;
    } else if (isNaN(qty) || qty < 0) {
      toast.warning("La quantité ne peut pas être négative");
      return;
    } else if (qty === 0) {
      toast.warning("La quantité doit être supérieure à 0");
      return;
    }

    const payload = {
      dateProduction: formData.dateProduction,
      quantiteLitre: parseFloat(formData.quantiteLitre),
    };

    if (formData.typeProduction === 'animal') {
      if (!formData.cheptelId) {
        toast.warning("Veuillez sélectionner un animal");
        return;
      }
      payload.cheptel = { id: parseInt(formData.cheptelId) };
    } else {
      if (!formData.lotId) {
        toast.warning("Veuillez sélectionner un lot");
        return;
      }
      payload.lot = { id: parseInt(formData.lotId) };
    }

    try {
      await addProduction(payload);
      toast.success(`Production enregistrée — ${payload.quantiteLitre} L`);
      setFormData({
        dateProduction: new Date().toISOString().split('T')[0],
        quantiteLitre: '',
        typeProduction: 'animal',
        cheptelId: '',
        lotId: '',
      });
      onSuccess?.();
    } catch (err) {
      toast.error("Échec de l'enregistrement. Veuillez réessayer.");
    }
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '0.5px solid #e8e7e2',
    borderRadius: '9px', fontSize: '13px', color: '#1a1a18',
    background: '#fff', outline: 'none', transition: 'border-color 0.12s',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: '10px', fontWeight: '500', color: '#9a9a96',
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px',
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div style={{ background: '#fff', borderRadius: '14px', border: '0.5px solid #e8e7e2', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a18', marginBottom: '1.25rem' }}>
          Nouvelle production de lait
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Type toggle */}
          <div>
            <span style={labelStyle}>Type de saisie</span>
            <div style={{ display: 'flex', gap: '6px', background: '#f1f0ec', padding: '3px', borderRadius: '9px' }}>
              {[{ val: 'animal', label: 'Par animal' }, { val: 'lot', label: 'Par lot' }].map(({ val, label }) => (
                <button key={val} type="button"
                  onClick={() => setFormData(prev => ({ ...prev, typeProduction: val, cheptelId: '', lotId: '' }))}
                  style={{
                    flex: 1, padding: '7px', borderRadius: '7px', fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', border: 'none', transition: 'all 0.12s',
                    background: formData.typeProduction === val ? '#fff' : 'transparent',
                    color: formData.typeProduction === val ? '#1a1a18' : '#9a9a96',
                    boxShadow: formData.typeProduction === val ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={labelStyle}>Date de production</label>
            <input type="date" name="dateProduction" value={formData.dateProduction}
              onChange={handleChange} style={inputStyle} required />
          </div>

          {/* Quantité */}
          <div>
            <label style={labelStyle}>Quantité (litres)</label>
            <input type="number" name="quantiteLitre" value={formData.quantiteLitre}
              onChange={handleChange} step="0.1" min="0" placeholder="Ex: 28.5"
              style={inputStyle} required />
          </div>

          {/* Animal */}
          {formData.typeProduction === 'animal' && (
            <div>
              <label style={labelStyle}>Animal</label>
              <select name="cheptelId" value={formData.cheptelId} onChange={handleChange}
                style={inputStyle} required>
                <option value="">-- Choisir un animal --</option>
                {cheptels.map(a => (
                  <option key={a.id} value={a.id}>{a.nom} — {a.chepnumber} ({a.race || ''})</option>
                ))}
              </select>
            </div>
          )}

          {/* Lot */}
          {formData.typeProduction === 'lot' && (
            <div>
              <label style={labelStyle}>Lot</label>
              <select name="lotId" value={formData.lotId} onChange={handleChange}
                style={inputStyle} required>
                <option value="">-- Choisir un lot --</option>
                {lots.map(l => (
                  <option key={l.id} value={l.id}>{l.nom}</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '10px',
            background: loading ? '#f1f0ec' : '#1a1a18',
            color: loading ? '#9a9a96' : '#fff',
            border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.12s', marginTop: '4px',
          }}>
            {loading ? 'Enregistrement...' : 'Enregistrer la production'}
          </button>
        </form>
      </div>
    </>
  );
};

export default ProductionForm;