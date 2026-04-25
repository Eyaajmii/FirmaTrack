import { useEffect, useState } from 'react';
import { useProductionOeuf } from '../hooks/useProductionOeuf';
import { useToast, ToastContainer } from '../../../components/common/Toast';

const OeufForm = ({ onSuccess }) => {
  const { addProduction, loading, cheptels, lots, fetchCheptels, fetchLots } = useProductionOeuf();
  const { toasts, removeToast, toast } = useToast();

  const [formData, setFormData] = useState({
    dateProduction: new Date().toISOString().split('T')[0],
    quantiteOeufs: '',
    qualite: 'A',
    notes: '',
    typeProduction: 'animal',
    cheptelId: '',
    lotId: '',
  });

  // Erreurs de validation inline (pas de toast pour ces-ci, restent dans le form)
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => { fetchCheptels(); fetchLots(); }, [fetchCheptels, fetchLots]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Efface l'erreur du champ quand l'utilisateur corrige
    setFieldErrors(prev => ({ ...prev, [name]: null }));
    if (name === 'typeProduction') {
      setFormData(prev => ({ ...prev, typeProduction: value, cheptelId: '', lotId: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const errors = {};
    const qty = parseInt(formData.quantiteOeufs);

    if (!formData.quantiteOeufs) {
      errors.quantiteOeufs = "La quantité est obligatoire";
    } else if (isNaN(qty) || qty < 0) {
      errors.quantiteOeufs = "La quantité ne peut pas être négative";
    } else if (qty === 0) {
      errors.quantiteOeufs = "La quantité doit être supérieure à 0";
    }

    if (!formData.dateProduction) {
      errors.dateProduction = "La date est obligatoire";
    }

    if (formData.typeProduction === 'animal' && !formData.cheptelId) {
      errors.cheptelId = "Veuillez sélectionner un animal";
    }
    if (formData.typeProduction === 'lot' && !formData.lotId) {
      errors.lotId = "Veuillez sélectionner un lot";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Toast warning pour le premier message d'erreur
      toast.warning(Object.values(errors)[0]);
      return;
    }

    const payload = {
      dateProduction: formData.dateProduction,
      quantiteOeufs: parseInt(formData.quantiteOeufs),
      qualite: formData.qualite,
      notes: formData.notes || null,
    };

    if (formData.typeProduction === 'animal') {
      payload.cheptelId = parseInt(formData.cheptelId);
    } else {
      payload.lotId = parseInt(formData.lotId);
    }

    try {
      await addProduction(payload);
      toast.success(`Collecte enregistrée — ${payload.quantiteOeufs} œufs (Qualité ${payload.qualite})`);
      setFormData({
        dateProduction: new Date().toISOString().split('T')[0],
        quantiteOeufs: '', qualite: 'A', notes: '',
        typeProduction: 'animal', cheptelId: '', lotId: '',
      });
      setFieldErrors({});
      onSuccess?.();
    } catch (err) {
      toast.error("Échec de l'enregistrement. Veuillez réessayer.");
    }
  };

  const inputStyle = (hasError) => ({
    width: '100%', padding: '9px 12px', boxSizing: 'border-box',
    border: `0.5px solid ${hasError ? '#f7c1c1' : '#e8e7e2'}`,
    borderRadius: '9px', fontSize: '13px', color: '#1a1a18',
    background: hasError ? '#fffafa' : '#fff', outline: 'none',
    transition: 'border-color 0.12s',
  });

  const labelStyle = {
    display: 'block', fontSize: '10px', fontWeight: '500', color: '#9a9a96',
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px',
  };

  const errorMsg = (field) => fieldErrors[field] ? (
    <span style={{ fontSize: '11px', color: '#A32D2D', marginTop: '4px', display: 'block' }}>
      {fieldErrors[field]}
    </span>
  ) : null;

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div style={{ background: '#fff', borderRadius: '14px', border: '0.5px solid #e8e7e2', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a18', marginBottom: '1.25rem' }}>
          Nouvelle collecte d'œufs
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Toggle type */}
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
            <label style={labelStyle}>Date de collecte</label>
            <input type="date" name="dateProduction" value={formData.dateProduction}
              onChange={handleChange} style={inputStyle(fieldErrors.dateProduction)} required />
            {errorMsg('dateProduction')}
          </div>

          {/* Quantité */}
          <div>
            <label style={labelStyle}>Quantité (œufs)</label>
            <input type="number" name="quantiteOeufs" value={formData.quantiteOeufs}
              onChange={handleChange} min="1" placeholder="Ex: 48"
              style={inputStyle(fieldErrors.quantiteOeufs)} />
            {errorMsg('quantiteOeufs')}
          </div>

          {/* Qualité */}
          <div>
            <label style={labelStyle}>Qualité</label>
            <div style={{ display: 'flex', gap: '6px', background: '#f1f0ec', padding: '3px', borderRadius: '9px' }}>
              {['A', 'B', 'C'].map(q => (
                <button key={q} type="button"
                  onClick={() => setFormData(prev => ({ ...prev, qualite: q }))}
                  style={{
                    flex: 1, padding: '7px', borderRadius: '7px', fontSize: '12px', fontWeight: '500',
                    cursor: 'pointer', border: 'none', transition: 'all 0.12s',
                    background: formData.qualite === q ? '#fff' : 'transparent',
                    color: formData.qualite === q ? '#1a1a18' : '#9a9a96',
                    boxShadow: formData.qualite === q ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  }}>
                  Qualité {q}
                </button>
              ))}
            </div>
          </div>

          {/* Animal */}
          {formData.typeProduction === 'animal' && (
            <div>
              <label style={labelStyle}>Animal</label>
              <select name="cheptelId" value={formData.cheptelId} onChange={handleChange}
                style={inputStyle(fieldErrors.cheptelId)}>
                <option value="">-- Choisir un animal --</option>
                {cheptels.map(a => (
                  <option key={a.id} value={a.id}>{a.nom} — {a.chepnumber} ({a.race || ''})</option>
                ))}
              </select>
              {errorMsg('cheptelId')}
            </div>
          )}

          {/* Lot */}
          {formData.typeProduction === 'lot' && (
            <div>
              <label style={labelStyle}>Lot</label>
              <select name="lotId" value={formData.lotId} onChange={handleChange}
                style={inputStyle(fieldErrors.lotId)}>
                <option value="">-- Choisir un lot --</option>
                {lots.map(l => (
                  <option key={l.id} value={l.id}>{l.nom}</option>
                ))}
              </select>
              {errorMsg('lotId')}
            </div>
          )}

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes (optionnel)</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange}
              placeholder="Observations..." rows={2}
              style={{ ...inputStyle(false), resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '10px',
            background: loading ? '#f1f0ec' : '#1a1a18',
            color: loading ? '#9a9a96' : '#fff',
            border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px',
          }}>
            {loading ? 'Enregistrement...' : 'Enregistrer la collecte'}
          </button>
        </form>
      </div>
    </>
  );
};

export default OeufForm;