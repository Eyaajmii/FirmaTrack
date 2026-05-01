import { Routes, Route, Navigate } from 'react-router-dom';

import CheptelPage from "../features/cheptel/pages/CheptelPage";
import CheptelEditPage from "../features/cheptel/pages/CheptelEditPage";

import ProductionListPage from "../features/production-lait/pages/ProductionListPage";
import ProductionOeufPage from "../features/production-oeufs/pages/ProductionOeufPage";

import CarnetsantePage from "../features/carnetsante/pages/CarnetsantePage";

import LotPage from "../features/cheptel/Lot/Page/LotPage";
import LotAddPage from "../features/cheptel/Lot/Page/LotAddPage";
import LotEditPage from '../features/cheptel/Lot/Page/LotEditPage';

const AppRoutes = () => {
  const userRole = localStorage.getItem('user_role');

  const isFermier = userRole === 'FERMIER' || userRole === 'ELEVEUR';
  const isVeterinaire = userRole === 'VETERINAIRE';

  return (
    <Routes>
      <Route
        path="/"
        element={
          isVeterinaire
            ? <Navigate to="/veterinaire-dashboard" replace />
            : <Navigate to="/cheptel" replace />
        }
      />
      {/*Vétérinaire */}
      <Route
        path="/veterinaire-dashboard"
        element={
          isVeterinaire
            ? <div className="p-10 text-2xl font-bold">⚕️ Espace Vétérinaire</div>
            : <Navigate to="/" />
        }
      />

      {/*Fermier / Éleveur */}
      <Route
        path="/cheptel"
        element={isFermier ? <CheptelPage /> : <Navigate to="/" />}
      />

      <Route
        path="/production-lait"
        element={isFermier ? <ProductionListPage /> : <Navigate to="/" />}
      />

      <Route
        path="/production-oeufs"
        element={isFermier ? <ProductionOeufPage /> : <Navigate to="/" />}
      />

      <Route
        path="/carnetsante"
        element={isFermier ? <CarnetsantePage /> : <Navigate to="/" />}
      />

      <Route
        path="/lots"
        element={isFermier ? <LotPage /> : <Navigate to="/" />}
      />

      <Route
        path="/lots/nouveau"
        element={isFermier ? <LotAddPage /> : <Navigate to="/" />}
      />

      <Route
        path="/cheptels/edit/:id"
        element={isFermier ? <CheptelEditPage /> : <Navigate to="/" />}
      />
      <Route
        path="/lots/edit/:id"
        element={isFermier ? <LotEditPage /> : <Navigate to="/" />}
      />
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