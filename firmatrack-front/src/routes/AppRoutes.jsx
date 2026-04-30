// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import CheptelPage from '../features/cheptel/pages/CheptelPage';
import ProductionListPage from '../features/production-lait/pages/ProductionListPage';
import ProductionOeufPage from '../features/production-oeufs/pages/ProductionOeufPage';

const AppRoutes = () => {
  const userRole = localStorage.getItem('user_role');

  return (
    <Routes>
      {/* 1. Redirection automatique à l'accueil selon le rôle */}
      <Route path="/" element={
        userRole === 'VETERINAIRE' 
        ? <Navigate to="/veterinaire-dashboard" replace /> 
        : <Navigate to="/cheptel" replace />
      } />

      {/* 2. Routes FERMIER */}
      <Route path="/cheptel" element={
        userRole === 'FERMIER' || userRole === 'ELEVEUR' ? <CheptelPage /> : <Navigate to="/" />
      } />
      <Route path="/production-lait" element={
        userRole === 'FERMIER' || userRole === 'ELEVEUR' ? <ProductionListPage /> : <Navigate to="/" />
      } />
      <Route path="/production-oeufs" element={
        userRole === 'FERMIER' || userRole === 'ELEVEUR' ? <ProductionOeufPage /> : <Navigate to="/" />
      } />

      {/* 3. Routes VETERINAIRE */}
      <Route path="/veterinaire-dashboard" element={
        userRole === 'VETERINAIRE' 
        ? <div className="p-10 text-2xl font-bold">⚕️ Espace Vétérinaire</div> 
        : <Navigate to="/" />
      } />

      {/* 4. Page 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;