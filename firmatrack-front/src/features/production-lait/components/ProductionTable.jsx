import React, { useState } from 'react';

const ITEMS_PER_PAGE = 5;

const ProductionTable = ({ productions, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        Chargement des productions...
      </div>
    );
  }

  if (!productions || productions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        Aucune production enregistrée pour le moment.
      </div>
    );
  }

  const totalPages = Math.ceil(productions.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = productions.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Animal / Lot
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Quantité
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((prod, index) => {
              const isAnimal = !!prod.cheptel;
              const name = isAnimal
                ? `${prod.cheptel.nom} (${prod.cheptel.chepnumber || ''})`
                : prod.lot?.nom || 'Lot inconnu';

              return (
                <tr
                  key={prod.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(prod.dateProduction).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {name}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {prod.quantiteLitre} L
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${
                      isAnimal
                        ? 'bg-white text-gray-700 border-gray-300'
                        : 'bg-gray-900 text-white border-gray-900'
                    }`}>
                      {isAnimal ? 'Animal' : 'Lot'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {start + 1}–{Math.min(start + ITEMS_PER_PAGE, productions.length)} sur {productions.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              ← Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-xs font-medium rounded-lg transition ${
                  page === currentPage
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionTable;