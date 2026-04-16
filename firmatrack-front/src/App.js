import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Contenu principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Barre de navigation supérieure */}
          <Navbar />

          {/* Zone principale où s'affichent les différentes pages */}
          <main className="flex-1 overflow-auto p-6 bg-gray-50">
            <AppRoutes />
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;