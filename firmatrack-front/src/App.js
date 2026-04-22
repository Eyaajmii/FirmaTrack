import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
// Importe tes pages ici
import CheptelPage from './features/cheptel/pages/CheptelPage';
import ProductionListPage from './features/production-lait/pages/ProductionListPage';


function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f6f4' }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/production-lait" replace />} />
            { <Route path="/cheptel" element={<CheptelPage />} /> }
            { <Route path="/production-lait" element={<ProductionListPage />} /> }
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;