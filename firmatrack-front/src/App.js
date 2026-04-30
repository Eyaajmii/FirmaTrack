import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import CheptelPage from "./features/cheptel/pages/CheptelPage";
import ProductionListPage from "./features/production-lait/pages/ProductionListPage";
import ProductionOeufPage from "./features/production-oeufs/pages/ProductionOeufPage";
import StockListPage from "./features/stock/pages/StockListPage";

function App() {
  return (
    <Router>
      <div
        style={{ display: "flex", minHeight: "100vh", background: "#f7f6f4" }}
      >
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
          {" "}
          {/* ← minWidth: 0 ajouté */}
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/production-lait" replace />}
            />
            <Route path="/cheptel" element={<CheptelPage />} />
            <Route path="/production-lait" element={<ProductionListPage />} />
            <Route path="/production-oeufs" element={<ProductionOeufPage />} />
            <Route path="/stock" element={<StockListPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
