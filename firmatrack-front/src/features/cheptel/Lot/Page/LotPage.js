import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { lotService } from "../Services/LotService";
import LotList from "../Components/LotList";

function LotPage() {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLot, setSelectedLot] = useState(null);

  const navigate = useNavigate();

  const fetchLots = async () => {
    try {
      setLoading(true);
      const res = await lotService.getAll();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setLots(data);
    } catch (err) {
      console.error("Erreur chargement lots", err);
      setLots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  const handleDelete = async (id) => {
    try {
      await lotService.deleteLot(id);
      fetchLots();
    } catch (err) {
      console.error("Erreur suppression lot", err);
    }
  };

  const totalAnimals = Array.isArray(lots)
    ? lots.reduce((sum, lot) => sum + (lot.cheptels?.length || 0), 0)
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f7f6f4", padding: "2rem" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{ fontSize: "11px", color: "#b0afa9", marginBottom: "6px" }}
          >
            Ferme El Baraka / Lots
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1>Lots</h1>

            <button
              onClick={() => navigate("/lots/nouveau")}
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
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "12px",
          }}
        >
          <StatCard
            color="green"
            label="Total lots"
            value={lots.length}
            sub="actifs"
          />
          <StatCard
            color="amber"
            label="Animaux"
            value={totalAnimals}
            sub="dans tous les lots"
          />
        </div>

        {/* LIST */}
        <div
          style={{
            marginTop: "1.5rem",
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "14px",
          }}
        >
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <LotList
              lots={lots}
              onDelete={handleDelete}
              onSelect={setSelectedLot}
            />
          )}
        </div>
      </div>

      {selectedLot && (
        <div
          onClick={(e) => e.target === e.currentTarget && setSelectedLot(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,26,24,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "520px",
              borderRadius: "16px",
              padding: "1.5rem",
              border: "0.5px solid #e8e7e2",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            {/* HEADER */}
            <div style={{ marginBottom: "1rem" }}>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                📦 Détail du lot
              </h2>
              <p style={{ fontSize: "12px", color: "#9a9a96" }}>
                Informations complètes du lot sélectionné
              </p>
            </div>

            {/* INFOS */}
            <div
              style={{
                display: "grid",
                gap: "10px",
                fontSize: "13px",
                marginBottom: "1rem",
              }}
            >
              <div>
                <strong>ID:</strong> {selectedLot.id}
              </div>

              <div>
                <strong>Nom:</strong> {selectedLot.nom}
              </div>

              <div>
                <strong>Description:</strong>{" "}
                {selectedLot.description || "Aucune description"}
              </div>

              <div>
                <strong>Total animaux:</strong>{" "}
                {selectedLot.cheptels?.length || 0}
              </div>
            </div>

            {/* 🐄 CHEPTELS LIST */}
            <div>
              <h3 style={{ fontSize: "13px", marginBottom: "8px" }}>
                🐄 Cheptels dans ce lot
              </h3>

              {selectedLot.cheptels && selectedLot.cheptels.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                  }}
                >
                  {selectedLot.cheptels.map((c) => (
                    <span
                      key={c.id}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        background: "#EAF3DE",
                        color: "#27500A",
                        border: "0.5px solid #C0DD97",
                      }}
                    >
                      {c.chepnumber} • {c.nom}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "12px", color: "#9a9a96" }}>
                  Aucun animal dans ce lot
                </p>
              )}
            </div>

            {/* FOOTER */}
            <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
              <button
                onClick={() => setSelectedLot(null)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "0.5px solid #e8e7e2",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* STAT CARD */
const StatCard = ({ color, label, value, sub }) => {
  const colors = {
    green: { bg: "#EAF3DE" },
    amber: { bg: "#FAEEDA" },
  };

  return (
    <div style={{ background: "#fff", padding: "1rem", borderRadius: "12px" }}>
      <div
        style={{
          width: 28,
          height: 28,
          background: colors[color].bg,
          borderRadius: 8,
        }}
      />
      <div style={{ fontSize: "11px" }}>{label}</div>
      <div style={{ fontSize: "20px" }}>{value}</div>
      <div style={{ fontSize: "11px" }}>{sub}</div>
    </div>
  );
};

export default LotPage;
