import { useEffect, useState } from 'react';
import { useProductionLait } from '../hooks/useProductionLait';

const ProductionForm = ({ onSuccess }) => {
  const { addProduction, loading, error, setError, cheptels, lots, fetchCheptels, fetchLots } = useProductionLait();

  const [formData, setFormData] = useState({
    dateProduction: new Date().toISOString().split('T')[0],
    quantiteLitre: '',
    typeProduction: 'animal',
    cheptelId: '',
    lotId: '',
  });

  useEffect(() => {
    fetchCheptels();
    fetchLots();
  }, [fetchCheptels, fetchLots]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'typeProduction') {
      setFormData(prev => ({ ...prev, [name]: value, cheptelId: '', lotId: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.quantiteLitre) { setError("La quantité en litres est obligatoire"); return; }

    const payload = {
      dateProduction: formData.dateProduction,
      quantiteLitre: parseFloat(formData.quantiteLitre),
    };

    if (formData.typeProduction === 'animal') {
      if (!formData.cheptelId) { setError("Veuillez sélectionner un animal"); return; }
      payload.cheptel = { id: parseInt(formData.cheptelId) };
    } else {
      if (!formData.lotId) { setError("Veuillez sélectionner un lot"); return; }
      payload.lot = { id: parseInt(formData.lotId) };
    }

    try {
      await addProduction(payload);
      alert("✅ Production enregistrée avec succès !");
      setFormData({
        dateProduction: new Date().toISOString().split('T')[0],
        quantiteLitre: '',
        typeProduction: 'animal',
        cheptelId: '',
        lotId: '',
      });
      onSuccess?.();
    } catch (err) {}
  };

  const inputClass = "w-full p-3 text-sm border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition placeholder-gray-300";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Nouvelle Production de Lait</h2>

      {error && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Type */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Type de saisie
          </label>
          <div className="flex gap-2">
            {['animal', 'lot'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, typeProduction: type, cheptelId: '', lotId: '' }))}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border transition ${
                  formData.typeProduction === type
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
              >
                {type === 'animal' ? 'Par Animal' : 'Par Lot'}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Date de production
          </label>
          <input type="date" name="dateProduction" value={formData.dateProduction} onChange={handleChange} className={inputClass} required />
        </div>

        {/* Quantité */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Quantité (Litres)
          </label>
          <input type="number" name="quantiteLitre" value={formData.quantiteLitre} onChange={handleChange} step="0.1" min="0" placeholder="Ex: 28.5" className={inputClass} required />
        </div>

        {/* Animal */}
        {formData.typeProduction === 'animal' && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Animal
            </label>
            <select name="cheptelId" value={formData.cheptelId} onChange={handleChange} className={inputClass} required>
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
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Lot
            </label>
            <select name="lotId" value={formData.lotId} onChange={handleChange} className={inputClass} required>
              <option value="">-- Choisir un lot --</option>
              {lots.map(l => (
                <option key={l.id} value={l.id}>{l.nom}</option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3.5 rounded-xl transition text-sm"
        >
          {loading ? "Enregistrement..." : "Enregistrer la Production"}
        </button>

      </form>
    </div>
  );
};

export default ProductionForm;