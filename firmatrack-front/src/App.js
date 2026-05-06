import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";

import AppRoutes from "./routes/AppRoutes";

function App() {
  const token = localStorage.getItem("user_token");
  const isAuth = token && token !== "null" && token !== "";

  return (
    <Router>
      {/* 🔐 CAS NON CONNECTÉ */}
      {!isAuth ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        /* ✅ CAS CONNECTÉ */
        <div
          style={{ display: "flex", minHeight: "100vh", background: "#f7f6f4" }}
        >
          {/* Sidebar unique */}
          <Sidebar />

          {/* Contenu principal */}
          <main style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>
            <AppRoutes />
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;
