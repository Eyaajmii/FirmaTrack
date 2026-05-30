import { useEffect, useState } from "react";
import * as service from "../services/CheptelService";
import CheptelForm from "../components/CheptelForm";
import CheptelFilter from "../components/CheptelFilter";
import CheptelList from "../components/CheptelList";
import { useToast, ToastContainer } from "../../../components/common/Toast";

function CheptelPage() {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { toasts, removeToast, toast } = useToast();

  const fetchAnimals = async () => {
    try {
      const res = await service.getAllAnimals();

      console.log("API RESPONSE:", res.data);

      const data = res?.data;

      if (Array.isArray(data)) {
        setAnimals(data);
      } else {
        setAnimals([]);
        console.error("Invalid API response:", data);
      }
    } catch (err) {
      console.error(err);
      setAnimals([]);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleAdd = async (data) => {
    try {
      await service.createAnimal(data);
      fetchAnimals();
      toast.success(`"${data.nom}" ajouté aux cheptels avec succès.`);
    } catch (err) {
      toast.error("Échec de l'enregistrement. Veuillez réessayer.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await service.deleteAnimal(id);
      fetchAnimals();
      toast.success("Animal supprimé avec succès.");
    } catch (err) {
      toast.error("Échec de la suppression. Veuillez réessayer.");
    }
  };

  const handleFilter = async (status) => {
    if (!status) {
      fetchAnimals();
      return;
    }
    const res = await service.getByStatus(status);
    setAnimals(res.data);
  };

  const handleSearch = async (value) => {
    if (!value) {
      fetchAnimals();
      return;
    }
    try {
      const res = await service.getByNumber(value);
      setAnimals([res.data]);
    } catch {
      setAnimals([]);
    }
  };

  const statuts = {
    ALIVE: animals.filter((a) => a.statut === "ALIVE").length,
    SOLD: animals.filter((a) => a.statut === "SOLD").length,
    DEAD: animals.filter((a) => a.statut === "DEAD").length,
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div
        style={{ minHeight: "100vh", background: "#f7f6f4", padding: "2rem" }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
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
              <span style={{ color: "#1a1a18" }}>Cheptel</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: "500",
                  color: "#1a1a18",
                  letterSpacing: "-0.4px",
                }}
              >
                Cheptel
              </h1>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#EAF3DE",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Ajouter un animal"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3v10M3 8h10"
                    stroke="#3B6D11"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0,1fr))",
              gap: "12px",
              marginBottom: "1.5rem",
            }}
          >
            <StatCard
              color="green"
              label="Vivants"
              value={statuts.ALIVE}
              sub={`sur ${animals.length} animaux`}
            />
            <StatCard
              color="amber"
              label="Vendus"
              value={statuts.SOLD}
              sub="cette période"
            />
            <StatCard
              color="red"
              label="Décédés"
              value={statuts.DEAD}
              sub="cette période"
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
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#1a1a18",
                }}
              >
                Cheptels
              </span>
              <span
                style={{
                  background: "#f1f0ec",
                  color: "#6b6b67",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "500",
                }}
              >
                {animals.length} animaux
              </span>
            </div>

            <CheptelFilter
              onFilter={handleFilter}
              onSearch={handleSearch}
              onReset={fetchAnimals}
            />

            <div style={{ marginTop: "1.25rem" }}>
              <CheptelList
                animals={animals}
                onDelete={handleDelete}
                onSelect={setSelectedAnimal}
              />
            </div>
          </div>
        </div>
        {showForm && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowForm(false);
            }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(26,26,24,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: "1rem",
            }}
          >
            <div
              style={{ width: "100%", maxWidth: "480px", position: "relative" }}
            >
              <button
                onClick={() => setShowForm(false)}
                style={{
                  position: "absolute",
                  top: "-12px",
                  right: "-12px",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "#fff",
                  border: "0.5px solid #e8e7e2",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#6b6b67",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                ×
              </button>
              <CheptelForm
                onAdd={(data) => {
                  handleAdd(data);
                  setShowForm(false);
                }}
              />
            </div>
          </div>
        )}
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
      </div>
    </>
  );
}

const colors = {
  green: { bg: "#EAF3DE", stroke: "#3B6D11", sub: "#2f7c4d" },
  amber: { bg: "#FAEEDA", stroke: "#854F0B", sub: "#854F0B" },
  red: { bg: "#FCEBEB", stroke: "#A32D2D", sub: "#A32D2D" },
};

const StatCard = ({ color, label, value, sub }) => {
  const c = colors[color];
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
export default CheptelPage;
