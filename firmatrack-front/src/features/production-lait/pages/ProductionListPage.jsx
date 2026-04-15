import { useEffect } from 'react';
import { useProductionLait } from '../hooks/useProductionLait';
import ProductionForm from '../components/ProductionForm';
import ProductionTable from '../components/ProductionTable';

const ProductionListPage = () => {
  const {
    productions,
    loading,
    error,
    fetchAllProductions,
    fetchCheptels,
    fetchLots,
  } = useProductionLait();

  useEffect(() => {
    fetchAllProductions();
    fetchCheptels();
    fetchLots();
  }, [fetchAllProductions, fetchCheptels, fetchLots]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] px-6 py-10"> {/* Fond très clair style UI/UX */}
      <div className="max-w-7xl mx-auto">
        
        {/* Header style épuré */}
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-2">
            <span>Ferme El Baraka</span> 
            <span>/</span>
            <span className="text-gray-900">Production</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Project Production</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Formulaire dans une carte blanche propre */}
          <div className="lg:col-span-4">
            <ProductionForm onSuccess={fetchAllProductions} />
          </div>

          {/* Liste dans une carte avec l'historique */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">Historique</h2>
                <div className="flex gap-2">
                   <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">Lait</span>
                   <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">{productions.length}</span>
                </div>
              </div>

              <ProductionTable productions={productions} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionListPage;