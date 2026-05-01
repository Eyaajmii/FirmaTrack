// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Login from './features/auth/Login';
import Register from './features/auth/Register'; // 1. N'oublie pas l'import !
import AppRoutes from './routes/AppRoutes'; // On importe nos routes

import CheptelPage from './features/cheptel/pages/CheptelPage';
import ProductionListPage from './features/production-lait/pages/ProductionListPage';
import ProductionOeufPage from './features/production-oeufs/pages/ProductionOeufPage';
import StockListPage from './features/stock/pages/StockListPage'; 
import StockAddPage from './features/stock/pages/StockAddPage';
import CarnetsantePage from './features/carnetsante/pages/CarnetsantePage';
import LotPage from "./features/cheptel/Lot/Page/LotPage";
import LotAddPage from "./features/cheptel/Lot/Page/LotAddPage";
import CheptelEditPage from "./features/cheptel/pages/CheptelEditPage";
function App() {
  const token = localStorage.getItem('user_token');
  const isAuth = token && token !== "null" && token !== "";

  return (
    <Router>
      {!isAuth ? (
        /* CAS 1 : Pas de Sidebar, juste le Login */
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* 2. AJOUTE CETTE LIGNE ICI */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        /* CAS 2 : Connecté -> Sidebar + Le contenu dynamique */
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f6f4' }}>
          <Sidebar />
          <main style={{ flex: 1, padding: '20px' }}>
            {/* On appelle le composant qui contient toutes nos routes */}
            <AppRoutes />
          </main>
        </div>
      )}
      <div
        style={{ display: "flex", minHeight: "100vh", background: "#f7f6f4" }}
      >
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/production-lait" replace />}
            />
            <Route path="/cheptel" element={<CheptelPage />} />
            <Route path="/cheptels/edit/:id" element={<CheptelEditPage />} />
            <Route path="/production-lait" element={<ProductionListPage />} />
            <Route path="/production-oeufs" element={<ProductionOeufPage />} />
            <Route path="/stock" element={<StockListPage />} />
            <Route path="/stock/nouveau" element={<StockAddPage />} />
            <Route path="/carnetsante" element={<CarnetsantePage />} />
            <Route path="/lots" element={<LotPage />} />
            <Route path="/lots/nouveau" element={<LotAddPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;