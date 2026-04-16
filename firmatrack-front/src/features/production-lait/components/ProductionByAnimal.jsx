import React, { useState, useEffect } from 'react';
import ProductionTable from './ProductionTable';

const ProductionByAnimal = ({ cheptels, productions, loading, fetchByAnimal }) => {
  const [selectedId, setSelectedId] = useState('');

  // Quand on choisit un animal, on déclenche la recherche API
  useEffect(() => {
    if (selectedId) {
      fetchByAnimal(selectedId);
    }
  }, [selectedId, fetchByAnimal]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sélecteur au design épuré */}
      <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
          Filtrer par Sujet
        </label>
        <select 
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full bg-transparent border-none text-sm font-semibold text-gray-700 focus:ring-0 cursor-pointer"
        >
          <option value="">-- Sélectionnez un animal --</option>
          {cheptels.map(a => (
            <option key={a.id} value={a.id}>{a.nom} ({a.chepnumber})</option>
          ))}
        </select>
      </div>

      {/* Affichage conditionnel */}
      {!selectedId ? (
        <div className="text-center py-12 text-xs font-medium text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
          Sélectionnez un animal pour voir son rendement.
        </div>
      ) : (
        <ProductionTable productions={productions} loading={loading} />
      )}
    </div>
  );
};

export default ProductionByAnimal;