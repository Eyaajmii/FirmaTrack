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
            style={{
              display: "flex",
              gap: "6px",
              alignItems: "center",
              fontSize: "11px",
              color: "#b0afa9",
              marginBottom: "6px",
            }}
          >
            <span>Ferme El Baraka</span>
            <span>/</span>
            <span style={{ color: "#1a1a18" }}>Lots</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: "500",
                color: "#1a1a18",
                letterSpacing: "-0.4px",
              }}
            >
              Lots
            </h1>

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

const StatCard = ({ color, label, value, sub }) => {
  const styles = {
    green: {
      bg: "#EAF3DE",
      icon: "#3A7D1C",
    },
    amber: {
      bg: "#FAEEDA",
      icon: "#C77700",
    },
  };

  const icons = {
    green: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 17L9 11L13 15L21 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 7H15M21 7V13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    amber: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 19V5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M4 19H20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <rect
          x="7"
          y="12"
          width="3"
          height="7"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="12"
          y="9"
          width="3"
          height="10"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="17"
          y="6"
          width="3"
          height="13"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "1rem",
        borderRadius: "14px",
        border: "1px solid #eee",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* accent background */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: styles[color].bg,
          opacity: 0.6,
        }}
      />

      {/* icon */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: styles[color].bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: styles[color].icon,
          marginBottom: 8,
        }}
      >
        {icons[color]}
      </div>

      {/* label */}
      <div
        style={{
          fontSize: "11px",
          color: "#777",
          textTransform: "uppercase",
          letterSpacing: "0.6px",
        }}
      >
        {label}
      </div>

      {/* value */}
      <div
        style={{
          fontSize: "22px",
          fontWeight: "600",
          color: "#1a1a18",
          marginTop: 4,
        }}
      >
        {value}
      </div>

      {/* sub */}
      <div
        style={{
          fontSize: "11px",
          color: "#999",
          marginTop: 2,
        }}
      >
        {sub}
      </div>
    </div>
  );
};
export default LotPage;
