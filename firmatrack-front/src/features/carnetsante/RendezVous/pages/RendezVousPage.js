import { useEffect, useState } from "react";
import * as service from "../services/RendezVousService";
import RendezVousForm from "../components/RendezVousForm";
import RendezVousFilter from "../components/RendezVousFilter";
import RendezVousList from "../components/RendezVousList";

function RendezVousPage() {
  const [rendezvous, setRendezvous] = useState([]);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchRendezVous = async () => {
    try {
      const res = await service.getAllRendezVous();
      setRendezvous(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setRendezvous([]);
    }
  };

  useEffect(() => {
    fetchRendezVous();
  }, []);

  // ✅ ADD
  const handleAdd = async (data) => {
    try {
      await service.createRendezVous(data);
      fetchRendezVous();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data || "Erreur lors de l'ajout";
      return { success: false, message: msg };
    }
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    await service.deleteRendezVous(id);
    fetchRendezVous();
  };

  // 🔍 FILTER
  const handleFilter = async (status) => {
    try {
      if (!status) return fetchRendezVous();

      const res = await service.getRendezVousByStatut(status);
      setRendezvous(Array.isArray(res.data) ? res.data : []);
    } catch {
      setRendezvous([]);
    }
  };

  // 🔎 SEARCH
  const handleSearch = async (value) => {
    if (!value) return fetchRendezVous();

    try {
      const res = await service.getRendezVousById(value);
      setRendezvous(res?.data ? [res.data] : []);
    } catch {
      setRendezvous([]);
    }
  };

  // 📊 STATS (corrigé status → statut)
  const statuts = {
    Demande: rendezvous.filter((r) => r.statut === "Demande").length,
    Confirme: rendezvous.filter((r) => r.statut === "Confirme").length,
    Termine: rendezvous.filter((r) => r.statut === "Termine").length,
    Annule: rendezvous.filter((r) => r.statut === "Annule").length,
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
            <span style={{ color: "#1a1a18" }}>Rendez-vous</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1 style={{ fontSize: "22px", fontWeight: "500" }}>Rendez-vous</h1>

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
          <StatCard label="En attente" value={statuts.Demande} />
          <StatCard label="Confirmés" value={statuts.Confirme} />
          <StatCard label="Terminés" value={statuts.Termine} />
          <StatCard label="Annulés" value={statuts.Annule} />
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
              Liste des rendez-vous
            </span>

            <span
              style={{
                background: "#f1f0ec",
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "11px",
              }}
            >
              {rendezvous.length} RDV
            </span>
          </div>

          <RendezVousFilter
            onFilter={handleFilter}
            onSearch={handleSearch}
            onReset={fetchRendezVous}
          />

          <div style={{ marginTop: "1rem" }}>
            <RendezVousList
              rdvs={rendezvous}
              onDelete={handleDelete}
              onSelect={setSelectedRdv}
            />
          </div>
        </div>
      </div>

      {/* 🟢 FORM MODAL */}
      {showForm && (
        <div
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
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
            <RendezVousForm
              onAdd={async (data) => {
                const res = await handleAdd(data);
                if (res.success) setShowForm(false);
                return res;
              }}
            />
          </div>
        </div>
      )}

      {/* 🟡 DETAIL MODAL */}
      {selectedRdv && (
        <div
          onClick={(e) => e.target === e.currentTarget && setSelectedRdv(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              minWidth: "300px",
            }}
          >
            <h2>Détail Rendez-vous</h2>

            <p>
              <strong>ID :</strong> {selectedRdv.id}
            </p>
            <p>
              <strong>Date :</strong> {selectedRdv.dateRDv}
            </p>
            <p>
              <strong>Statut :</strong> {selectedRdv.statut}
            </p>

            <button onClick={() => setSelectedRdv(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STAT CARD ================= */
const StatCard = ({ label, value }) => (
  <div
    style={{
      background: "#fff",
      padding: "1rem",
      borderRadius: "10px",
      border: "0.5px solid #e8e7e2",
    }}
  >
    <div style={{ fontSize: "11px", color: "#999" }}>{label}</div>
    <div style={{ fontSize: "22px", fontWeight: "500" }}>{value}</div>
  </div>
);

export default RendezVousPage;
