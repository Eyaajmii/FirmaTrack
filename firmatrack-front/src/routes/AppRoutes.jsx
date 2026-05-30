import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import CheptelPage from "../features/cheptel/pages/CheptelPage";
import CheptelEditPage from "../features/cheptel/pages/CheptelEditPage";
import ProductionListPage from "../features/production-lait/pages/ProductionListPage";
import ProductionOeufPage from "../features/production-oeufs/pages/ProductionOeufPage";
import CarnetsantePage from "../features/carnetsante/pages/CarnetsantePage";
import LotPage from "../features/cheptel/Lot/Page/LotPage";
import LotAddPage from "../features/cheptel/Lot/Page/LotAddPage";
import LotEditPage from "../features/cheptel/Lot/Page/LotEditPage";
import CarnetsanteEditPage from "../features/carnetsante/pages/CarnetsanteEditPage";
import CarnetSanteDetail from "../features/carnetsante/pages/CarnetsanteDetailPage";
import StockListPage from "../features/stock/pages/StockListPage";
import StockAddPage from "../features/stock/pages/StockAddPage";
import RendezVousPage from "../features/carnetsante/RendezVous/pages/RendezVousPage";

import SaisieCharges from "../features/finance/pages/SaisieCharges";
import FinancePage from "../features/finance/pages/FinancePage";
import DashboardVeto from "../features/veterinaire/DashboardVeto";
import ForumPage from "../features/forum/pages/ForumPage";
import PostDetail from "../features/forum/pages/PostDetail";

import ProfilePage from "../features/auth/ProfilePage";
import VetListMapPage from "../features/veterinaire/pages/VetListMapPage";
import VetDetailPage from "../features/veterinaire/pages/VetDetailPage";
import VigilanceSanitaire from "../features/veterinaire/pages/VigilanceSanitaire";

import NotificationsPage from "../features/notifications/pages/NotificationsPage";

import AdminDashboard from "../features/auth/AdminDashboard"; 

const AppRoutes = () => {
  const userRole = localStorage.getItem("user_role");

  const isFermier = userRole === "FERMIER" || userRole === "ELEVEUR";
  const isVeterinaire = userRole === "VETERINAIRE";

  return (
    <Routes>
      <Route
        path="/"
        element={
          userRole === "ADMIN" ? (
            <Navigate to="/admin-dashboard" replace />
          ) : isVeterinaire ? (
            <Navigate to="/veterinaire-dashboard" replace /> // Correction de l'espace indésirable
          ) : (
            <Navigate to="/cheptel" replace />
          )
        }
      />
      <Route
        path="/veterinaire-dashboard"
        element={isVeterinaire ? <DashboardVeto /> : <Navigate to="/" />}
      />
      <Route
        path="/forum"
        element={
          isFermier || isVeterinaire || userRole === "ADMIN" ? (
            <ForumPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/forum/posts/:id"
        element={
          isFermier || isVeterinaire || userRole === "ADMIN" ? (
            <PostDetail />
          ) : (
            <Navigate to="/" />
          )
        }
      />
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
        path="/stock"
        element={isFermier ? <StockListPage /> : <Navigate to="/" />}
      />

      <Route
        path="/stock/nouveau"
        element={isFermier ? <StockAddPage /> : <Navigate to="/" />}
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
        path="/lots/edit/:id"
        element={isFermier ? <LotEditPage /> : <Navigate to="/" />}
      />

      <Route
        path="/cheptels/edit/:id"
        element={isFermier ? <CheptelEditPage /> : <Navigate to="/" />}
      />

      <Route
        path="/carnetsante"
        element={
          isFermier || isVeterinaire || userRole === "ADMIN" ? (
            <CarnetsantePage />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/carnetsante/:id"
        element={
          isFermier || isVeterinaire || userRole === "ADMIN" ? (
            <CarnetSanteDetail />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/carnetsante/edit/:id"
        element={
          isFermier || isVeterinaire || userRole === "ADMIN" ? (
            <CarnetsanteEditPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/rendezvous"
        element={
          isFermier || isVeterinaire || userRole === "ADMIN" ? (
            <RendezVousPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/finance"
        element={isFermier ? <FinancePage /> : <Navigate to="/" />}
      />

      <Route
        path="/finance/enregistrer"
        element={isFermier ? <SaisieCharges /> : <Navigate to="/" />}
      />
      <Route path="/veterinairesproches" element={isFermier || userRole === "ADMIN"? <VetListMapPage /> : <Navigate to="/" />} />
      <Route path="/veterinairesproche/:id" element={isFermier || userRole === "ADMIN"? <VetDetailPage /> : <Navigate to="/" />} />

      <Route
        path="/profile"
        element={isFermier || isVeterinaire || userRole === "ADMIN" ? <ProfilePage /> : <Navigate to="/" />}
      />
      <Route path="/vigilance" element={isFermier || isVeterinaire || userRole === "ADMIN" ? <VigilanceSanitaire /> : <Navigate to="/" />} />
      <Route 
        path="/admin-dashboard" 
        element={userRole === "ADMIN" ? <AdminDashboard /> : <Navigate to="/" />} 
      />
      <Route path="/notifications" element={isFermier || isVeterinaire || userRole === "ADMIN" ? <NotificationsPage /> : <Navigate to="/" />} />
      {/* 7. Page 404 - Fallback */}
      <Route
        path="*"
        element={
          <h1 className="text-3xl text-red-600 p-10 text-center font-bold">
            404 - Page non trouvée
          </h1>
        }
      />
    </Routes>
  );
};

export default AppRoutes;