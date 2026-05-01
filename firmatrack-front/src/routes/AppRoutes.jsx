// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import CheptelPage from '../features/cheptel/pages/CheptelPage';
import ProductionListPage from '../features/production-lait/pages/ProductionListPage';
import ProductionOeufPage from '../features/production-oeufs/pages/ProductionOeufPage';

import { Routes, Route } from "react-router-dom";

// Imports corrects des pages
import CheptelPage from "../features/cheptel/pages/CheptelPage";
import ProductionListPage from "../features/production-lait/pages/ProductionListPage";
import CarnetsantePage from "../features/carnetsante/pages/CarnetsantePage";
import ProductionOeufPage from "./features/production-oeufs/pages/ProductionOeufPage";
import LotPage from "./features/cheptel/Lot/Page/LotPage";
import LotAddPage from "./features/cheptel/Lot/Page/LotAddPage";
import CheptelEditPage from "./features/cheptel/pages/CheptelEditPage";
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
      <Route path="/cheptels/edit/:id" element={<CheptelEditPage />} />
      {/* Carnet sante */}
      <Route path="/carnetsante" element={<CarnetsantePage />} />
      {/* Production Lait */}
      <Route path="/production-lait" element={<ProductionListPage />} />
      {/* Lots */}
      <Route path="/lots" element={<LotPage />} />
      <Route path="/lots/nouveau" element={<LotAddPage />} />
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
