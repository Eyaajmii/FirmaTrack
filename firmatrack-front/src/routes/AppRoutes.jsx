import { Routes, Route } from 'react-router-dom';

// Imports corrects des pages
import CheptelPage from '../features/cheptel/pages/CheptelPage';
import ProductionListPage from '../features/production-lait/pages/ProductionListPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Accueil */}
      <Route 
        path="/" 
        element={
          <div className="flex items-center justify-center h-full text-4xl font-bold text-gray-700">
            Bienvenue sur <span className="text-blue-600">FirmaTrack</span>
          </div>
        } 
      />

      {/* Cheptel */}
      <Route path="/cheptel" element={<CheptelPage />} />

      {/* Production Lait */}
      <Route path="/production-lait" element={<ProductionListPage />} />

      {/* 404 */}
      <Route 
        path="*" 
        element={
          <h1 className="text-3xl text-red-600 p-10 text-center">
            404 - Page non trouvée
          </h1>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;