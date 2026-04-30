// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Login from './features/auth/Login';
import Register from './features/auth/Register'; // 1. N'oublie pas l'import !
import AppRoutes from './routes/AppRoutes'; // On importe nos routes

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
    </Router>
  );
}

export default App;