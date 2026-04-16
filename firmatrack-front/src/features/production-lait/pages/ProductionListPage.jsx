import { useEffect, useState } from 'react';
import { useProductionLait } from '../hooks/useProductionLait';
import ProductionForm from '../components/ProductionForm';
import ProductionTable from '../components/ProductionTable';

// NOUVEAUX IMPORTS
import ProductionByAnimal from '../components/ProductionByAnimal';
import ProductionByLot from '../components/ProductionByLot';

const ProductionListPage = () => {
  // NOUVEAU : État pour gérer l'onglet actif
  const [activeTab, setActiveTab] = useState('all');

  const {
    productions,
    loading,
    error,
    cheptels, // ajouté
    lots,     // ajouté
    fetchAllProductions,
    fetchCheptels,
    fetchLots,
    fetchProductionsByAnimal, // ajouté
    fetchProductionsByLot     // ajouté
  } = useProductionLait();

  // Chargement initial des références (Animaux et Lots)
  useEffect(() => {
    fetchCheptels();
    fetchLots();
  }, [fetchCheptels, fetchLots]);

  // NOUVEAU : Recharger la liste globale quand on clique sur l'onglet "Vue Globale"
  useEffect(() => {
    if (activeTab === 'all') {
      fetchAllProductions();
    }
  }, [activeTab, fetchAllProductions]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] px-6 py-10"> {/* Fond très clair style UI/UX */}
      <div className="max-w-7xl mx-auto">
        
        {/* Header style épuré (CONSERVÉ) */}
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-2">
            <span>Ferme El Baraka</span> 
            <span>/</span>
            <span className="text-gray-900">Production</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Project Production</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Formulaire dans une carte blanche propre (CONSERVÉ) */}
          <div className="lg:col-span-4">
            <ProductionForm onSuccess={() => activeTab === 'all' ? fetchAllProductions() : null} />
          </div>

          {/* Liste dans une carte avec l'historique (CONSERVÉ) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
              
              {/* En-tête de la carte (CONSERVÉ) */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Historique</h2>
                <div className="flex gap-2">
                   <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">Lait</span>
                   <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">{productions.length}</span>
                </div>
              </div>

              {/* --- DÉBUT DES NOUVEAUTÉS : ONGLETS --- */}
              <div className="bg-gray-50 p-1 rounded-xl flex gap-1 mb-8 w-fit">
                {[
                  { id: 'all', label: 'Vue Globale' },
                  { id: 'animal', label: 'Par Animal' },
                  { id: 'lot', label: 'Par Lot' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-500 text-xs font-bold rounded-xl">
                  {error}
                </div>
              )}

              {/* Rendu dynamique selon l'onglet choisi */}
              {activeTab === 'all' && (
                <ProductionTable productions={productions} loading={loading} />
              )}
              
              {activeTab === 'animal' && (
                <ProductionByAnimal 
                  cheptels={cheptels} 
                  productions={productions} 
                  loading={loading} 
                  fetchByAnimal={fetchProductionsByAnimal} 
                />
              )}

              {activeTab === 'lot' && (
                <ProductionByLot 
                  lots={lots} 
                  productions={productions} 
                  loading={loading} 
                  fetchByLot={fetchProductionsByLot} 
                />
              )}
              {/* --- FIN DES NOUVEAUTÉS --- */}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionListPage;