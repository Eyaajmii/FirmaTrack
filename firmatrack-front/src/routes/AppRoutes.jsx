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
