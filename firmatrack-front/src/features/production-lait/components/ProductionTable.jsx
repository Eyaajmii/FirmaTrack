import React, { useState } from 'react';
import { useProductionLait } from '../hooks/useProductionLait';

const ITEMS_PER_PAGE = 5;

const ProductionTable = ({ productions, loading }) => {
  const { deleteProduction, updateProduction } = useProductionLait();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  if (loading) return (
    <div className="text-center py-10 text-gray-400 text-sm">Chargement...</div>
  );

  if (!productions || productions.length === 0) return (
    <div className="text-center py-10 text-gray-400 text-sm">Aucune production enregistrée.</div>
  );

  const totalPages = Math.ceil(productions.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = productions.slice(start, start + ITEMS_PER_PAGE);

  const handleEditClick = (prod) => {
    setEditingId(prod.id);
    setEditData({ quantiteLitre: prod.quantiteLitre, dateProduction: prod.dateProduction });
  };

  const handleEditSave = async (prod) => {
    await updateProduction(prod.id, {
      ...prod,
      quantiteLitre: parseFloat(editData.quantiteLitre),
      dateProduction: editData.dateProduction,
    });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await deleteProduction(id);
    setConfirmDeleteId(null);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {['Date', 'Animal / Lot', 'Quantité', 'Type', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((prod, index) => {
              const isAnimal = !!prod.cheptel;
              const name = isAnimal
                ? `${prod.cheptel.nom} (${prod.cheptel.chepnumber || ''})`
                : prod.lot?.nom || 'Lot inconnu';
              const isEditing = editingId === prod.id;
              const isConfirmDelete = confirmDeleteId === prod.id;

              return (
                <tr key={prod.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  
                  {/* Date */}
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {isEditing ? (
                      <input type="date" value={editData.dateProduction}
                        onChange={e => setEditData(p => ({ ...p, dateProduction: e.target.value }))}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs w-32 focus:outline-none focus:border-gray-900" />
                    ) : (
                      new Date(prod.dateProduction).toLocaleDateString('fr-FR')
                    )}
                  </td>

                  {/* Nom */}
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{name}</td>

                  {/* Quantité */}
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {isEditing ? (
                      <input type="number" step="0.1" min="0" value={editData.quantiteLitre}
                        onChange={e => setEditData(p => ({ ...p, quantiteLitre: e.target.value }))}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-xs w-20 focus:outline-none focus:border-gray-900" />
                    ) : (
                      `${prod.quantiteLitre} L`
                    )}
                  </td>

                  {/* Badge type */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${
                      isAnimal ? 'bg-white text-gray-700 border-gray-300' : 'bg-gray-900 text-white border-gray-900'
                    }`}>
                      {isAnimal ? 'Animal' : 'Lot'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleEditSave(prod)}
                          className="px-3 py-1 text-xs font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition">
                          Sauvegarder
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="px-3 py-1 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                          Annuler
                        </button>
                      </div>
                    ) : isConfirmDelete ? (
                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-gray-500">Confirmer ?</span>
                        <button onClick={() => handleDelete(prod.id)}
                          className="px-3 py-1 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                          Oui
                        </button>
                        <button onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-1 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                          Non
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(prod)}
                          className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                          Modifier
                        </button>
                        <button onClick={() => setConfirmDeleteId(prod.id)}
                          className="px-3 py-1 text-xs font-medium text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition">
                          Supprimer
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination — identique à l'original */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {start + 1}–{Math.min(start + ITEMS_PER_PAGE, productions.length)} sur {productions.length}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
              ← Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-xs font-medium rounded-lg transition ${page === currentPage ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
              Suivant →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionTable;