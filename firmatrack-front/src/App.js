import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
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
  return (
    <Router>
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