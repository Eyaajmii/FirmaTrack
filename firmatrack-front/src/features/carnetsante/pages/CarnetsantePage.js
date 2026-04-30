import { useEffect, useState } from "react";
import * as service from "../services/CarnetsanteService";
import CarnetsanteList from "../components/CarnetsanteList";
import CarnetsanteForm from "../components/CarnetsanteForm";

function CarnetsantePage() {
  const [carnets, setCarnets] = useState([]);
  const [selectedCarnet, setSelectedCarnet] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // 🔵 fetch all
  const fetchCarnets = async () => {
    const res = await service.getAllcarnet();
    setCarnets(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    fetchCarnets();
  }, []);

  // 🟢 ADD CARNET
  // Dans CarnetsantePage.js — remplace handleAdd par :
const handleAdd = async (data) => {
  try {
    await service.createCarnet(data);
    fetchCarnets();
    return { success: true };
  } catch (err) {
    const msg = err.response?.data || "Erreur lors de l'ajout";
    return { success: false, message: msg };
  }
};

  // 🔴 DELETE
  const handleDelete = async (id) => {
    await service.deleteCarnet(id);
    fetchCarnets();
  };

  // 📊 stats
  const stats = {
    total: carnets.length,
    avecMaladies: carnets.filter((c) => c.maladies?.length > 0).length,
    avecVaccins: carnets.filter((c) => c.vaccinations?.length > 0).length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f6f4", padding: "2rem" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{ fontSize: "11px", color: "#b0afa9", marginBottom: "6px" }}
          >
            Ferme El Baraka /{" "}
            <span style={{ color: "#1a1a18" }}>Carnet de santé</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 style={{ fontSize: "22px", fontWeight: "500" }}>
              Carnet de santé des animaux
            </h1>

            {/* ➕ ADD BUTTON */}
            <button
              onClick={() => setShowForm(true)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#EAF3DE",
                border: "none",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "12px",
            marginBottom: "1.5rem",
          }}
        >
          <StatCard
            label="Total carnets"
            value={stats.total}
            icon="heart"
            color="#3B6D11"
          />
          <StatCard
            label="Maladies"
            value={stats.avecMaladies}
            icon="virus"
            color="#A32D2D"
          />
          <StatCard
            label="Vaccins"
            value={stats.avecVaccins}
            icon="syringe"
            color="#854F0B"
          />
        </div>

        {/* TABLE */}
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            border: "0.5px solid #e8e7e2",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              Liste des carnets
            </span>

            <span
              style={{
                background: "#f1f0ec",
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "11px",
              }}
            >
              {carnets.length} carnets
            </span>
          </div>

          <CarnetsanteList
            carnets={carnets}
            onDelete={handleDelete}
            onSelect={setSelectedCarnet}
          />
        </div>
      </div>

      {/* 🟢 FORM MODAL */}
      {showForm && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div style={{ width: "100%", maxWidth: "480px" }}>
            <CarnetsanteForm
              onAdd={(data) => {
                handleAdd(data);
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}

      {/* 🔵 DETAIL MODAL */}
      {selectedCarnet && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCarnet(null);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 80,
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "520px",
              borderRadius: "14px",
              padding: "1.5rem",
            }}
          >
            <h2>🩺 Carnet de santé</h2>

            <p>
              <strong>Animal :</strong> {selectedCarnet.animal?.nom}
            </p>
            <p>
              <strong>Groupe :</strong> {selectedCarnet.groupeSanguin}
            </p>
            <p>
              <strong>Allergies :</strong> {selectedCarnet.allergies || "—"}
            </p>
            <p>
              <strong>Obs :</strong>{" "}
              {selectedCarnet.observationsGenerales || "—"}
            </p>

            <button onClick={() => setSelectedCarnet(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STAT CARD ================= */
const StatCard = ({ label, value, icon, color }) => {
  const icons = {
    heart: (
      <path
        d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
    ),
    virus: <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" />,
    syringe: (
      <path
        d="M4 20l6-6m2-2l6-6m-4 0l4 4m-2 2l-4-4"
        stroke={color}
        strokeWidth="1.5"
      />
    ),
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid #e8e7e2",
        borderRadius: "12px",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "30px",
          height: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "8px",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          {icons[icon]}
        </svg>
      </div>

      <div style={{ fontSize: "11px", color: "#999" }}>{label}</div>

      <div style={{ fontSize: "22px", fontWeight: "500" }}>{value}</div>
    </div>
  );
};

export default CarnetsantePage;
