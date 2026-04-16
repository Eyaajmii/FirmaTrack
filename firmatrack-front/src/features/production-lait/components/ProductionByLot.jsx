import React, { useState, useEffect } from 'react';
import ProductionTable from './ProductionTable';

const ProductionByLot = ({ lots, productions, loading, fetchByLot }) => {
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    if (selectedId) {
      fetchByLot(selectedId);
    }
  }, [selectedId, fetchByLot]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
          Filtrer par Groupe
        </label>
        <select 
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full bg-transparent border-none text-sm font-semibold text-gray-700 focus:ring-0 cursor-pointer"
        >
          <option value="">-- Sélectionnez un lot --</option>
          {lots.map(l => (
            <option key={l.id} value={l.id}>{l.nom}</option>
          ))}
        </select>
      </div>

      {!selectedId ? (
        <div className="text-center py-12 text-xs font-medium text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
          Sélectionnez un lot pour analyser la production du groupe.
        </div>
      ) : (
        <ProductionTable productions={productions} loading={loading} />
      )}
    </div>
  );
};

export default ProductionByLot;