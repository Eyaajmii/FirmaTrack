import { useEffect, useState } from "react";
import * as service from "../services/CheptelService";
import ListeCheptelArchive from "../components/ListeCheptelArchive";
import { useToast, ToastContainer } from "../../../components/common/Toast";

function CheptelArchivePage() {
  const farmName = localStorage.getItem("farm_name") || "Ma Ferme";
  const [animals, setAnimals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const { toasts, removeToast, toast } = useToast();

  const fetchArchives = async () => {
    try {
      const res = await service.getArchivedAnimals();
      const data = res?.data;

      if (Array.isArray(data)) {
        setAnimals(data);
        setFiltered(data);
      } else {
        setAnimals([]);
        setFiltered([]);
      }
    } catch (err) {
      console.error(err);
      setAnimals([]);
      setFiltered([]);
    }
  };

  useEffect(() => {
    fetchArchives();
  }, []);
  const handleSearch = (value) => {
    setSearch(value);

    if (!value) {
      setFiltered(animals);
      return;
    }

    const v = value.toLowerCase();

    const result = animals.filter(
      (a) =>
        a.nom?.toLowerCase().includes(v) ||
        a.chepnumber?.toLowerCase().includes(v)
    );

    setFiltered(result);
  };
  const handleReset = () => {
    setSearch("");
    setFiltered(animals);
  };

  const handleRestore = async (id) => {
    try {
      await service.restoreAnimal(id);
      toast.success("Animal restauré avec succès");
      fetchArchives();
    } catch (err) {
      toast.error("Erreur lors de la restauration");
    }
  };
  const statuts = {
    TOTAL: animals.length,
    FILTERED: filtered.length,
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div
        style={{
          minHeight: "100vh",
          background: "#f7f6f4",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem" }}>
            <div
              style={{
                fontSize: "11px",
                color: "#b0afa9",
                marginBottom: "6px",
              }}
            >
              {farmName} / Cheptel / Archives
            </div>

            <h1
              style={{
                fontSize: "22px",
                fontWeight: "500",
                color: "#1a1a18",
              }}
            >
              Cheptel archivé
            </h1>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: "12px",
              marginBottom: "1.25rem",
            }}
          >
            <StatCard
              color="green"
              label="Total archives"
              value={statuts.TOTAL}
              sub="animaux archivés"
            />

            <StatCard
              color="amber"
              label="Résultats affichés"
              value={statuts.FILTERED}
              sub="après filtre"
            />
          </div>
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
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#1a1a18",
                }}
              >
                Archives
              </span>

              <span
                style={{
                  background: "#f1f0ec",
                  color: "#6b6b67",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                }}
              >
                {filtered.length} animaux
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "1.25rem",
              }}
            >
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  value={search}
                  placeholder="Rechercher par nom ou numéro..."
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 10px",
                    borderRadius: "10px",
                    border: "0.5px solid #e8e7e2",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              <button
                onClick={handleReset}
                style={{
                  padding: "9px 14px",
                  border: "0.5px solid #e8e7e2",
                  borderRadius: "9px",
                  fontSize: "12px",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Réinitialiser
              </button>
            </div>
            <ListeCheptelArchive animals={filtered} onRestore={handleRestore} onSelect={setSelectedAnimal}/>
          </div>
        </div>
      </div>
      {selectedAnimal && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedAnimal(null);
            }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(26,26,24,.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 80,
              padding: "1rem",
            }}
          >
            <div
              style={{
                background: "#fff",
                width: "100%",
                maxWidth: "420px",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
              }}
            >
              {/* Header coloré */}
              <div
                style={{
                  background: "#EAF3DE",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                    }}
                  >
                    {{ VACHE: "🐄", POULE: "🐔", CHEVRE: "🐐", BREBIS: "🐑" }[
                      selectedAnimal.type
                    ] || "🐾"}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#1a1a18",
                      }}
                    >
                      {selectedAnimal.nom || "—"}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#5a8a2a",
                        marginTop: "2px",
                      }}
                    >
                      {selectedAnimal.chepnumber}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAnimal(null)}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "#6b6b67",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div
                style={{
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <Row
                  label="Type"
                  value={
                    <span style={{ fontSize: "12px", color: "#4a4a47" }}>
                      {selectedAnimal.type}
                      {selectedAnimal.race ? ` — ${selectedAnimal.race}` : ""}
                    </span>
                  }
                />

                <Row
                  label="Genre"
                  value={
                    selectedAnimal.gender === "F"
                      ? "Femelle"
                      : selectedAnimal.gender === "M"
                      ? "Mâle"
                      : "—"
                  }
                />

                <Row
                  label="Statut"
                  value={
                    <span
                      style={{
                        display: "inline-flex",
                        padding: "3px 9px",
                        borderRadius: "20px",
                        fontSize: "10px",
                        fontWeight: "500",
                        ...{
                          ALIVE: {
                            background: "#EAF3DE",
                            color: "#27500A",
                            border: "0.5px solid #C0DD97",
                          },
                          SOLD: {
                            background: "#FAEEDA",
                            color: "#633806",
                            border: "0.5px solid #FAC775",
                          },
                          DEAD: {
                            background: "#FCEBEB",
                            color: "#791F1F",
                            border: "0.5px solid #F7C1C1",
                          },
                        }[selectedAnimal.statut],
                      }}
                    >
                      {{ ALIVE: "Vivant", SOLD: "Vendu", DEAD: "Décédé" }[
                        selectedAnimal.statut
                      ] || selectedAnimal.statut}
                    </span>
                  }
                />

                <Row
                  label="Poids"
                  value={
                    selectedAnimal.poids ? `${selectedAnimal.poids} kg` : "—"
                  }
                />
                <Row
                  label="Date de naissance"
                  value={selectedAnimal.dateNaissance || "—"}
                />
                <Row
                  label="Date d'entrée"
                  value={selectedAnimal.dateEntre || "—"}
                />
                <Row label="Lot" value={selectedAnimal.lot?.nom || "—"} />

                <div style={{ marginTop: "1rem" }}>
                  <button
                    onClick={() => setSelectedAnimal(null)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "0.5px solid #e8e7e2",
                      background: "#fff",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#1a1a18",
                    }}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
const colors = {
  green: { bg: "#EAF3DE", stroke: "#3B6D11", sub: "#2f7c4d" },
  amber: { bg: "#FAEEDA", stroke: "#854F0B", sub: "#854F0B" },
  red:   { bg: "#FCEBEB", stroke: "#A32D2D", sub: "#A32D2D" },
};
const StatCard = ({ color = "green", label, value, sub }) => {
  const c = colors[color] ?? colors.green;

  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid #e8e7e2",
        borderRadius: "12px",
        padding: "1rem 1.25rem",
      }}
    >
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "8px",
          background: c.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5" r="3" stroke={c.stroke} strokeWidth="1.4" />
          <path
            d="M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5"
            stroke={c.stroke}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div
        style={{
          fontSize: "11px",
          color: "#9a9a96",
          fontWeight: "500",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "24px",
          fontWeight: "500",
          color: "#1a1a18",
          lineHeight: 1,
        }}
      >
        {value}
      </div>

      <div style={{ fontSize: "11px", color: c.sub, marginTop: "6px" }}>
        {sub}
      </div>
    </div>
  );
};
function Row({ label, value }) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 0",
          borderBottom: "0.5px solid #f0efe9",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            color: "#9a9a96",
            fontWeight: "500",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: "12px", color: "#1a1a18", fontWeight: "500" }}>
          {value}
        </span>
      </div>
    );
}
export default CheptelArchivePage;