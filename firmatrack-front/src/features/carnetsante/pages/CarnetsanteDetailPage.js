import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as service from "../services/CarnetsanteService";
import * as traitservice from "../Traitement/services/TraitementService";
import * as medservice from "../Medicament/services/MedicamentService";

import MaladieList from "../Maladie/Components/MaladieList";
import TraitementList from "../Traitement/components/TraitementList";
import MedicamentList from "../Medicament/components/MedicamentList";
import VaccinationList from "../Vaccination/components/VaccinationList";
import RendezVousList from "../RendezVous/components/RendezVousList";

function CarnetSanteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [carnet, setCarnet] = useState(null);
  const [tab, setTab] = useState("maladies");

  const [selectedMaladie, setSelectedMaladie] = useState(null);
  const [selectedTraitement, setSelectedTraitement] = useState(null);

  const [traitements, setTraitements] = useState([]);
  const [medicaments, setMedicaments] = useState([]);

  useEffect(() => {
    loadCarnet();
  }, [id]);

  const loadCarnet = async () => {
    const res = await service.getById(id);
    setCarnet(res.data);
  };

  useEffect(() => {
    if (selectedMaladie?.id) {
      fetchTraitements(selectedMaladie.id);
      setSelectedTraitement(null);
      setMedicaments([]);
    }
  }, [selectedMaladie]);

  useEffect(() => {
    if (selectedTraitement?.id) {
      fetchMedicaments(selectedTraitement.id);
    }
  }, [selectedTraitement]);

  const fetchTraitements = async (id) => {
    const res = await traitservice.getTraitementsByMaladie(id);
    setTraitements(res.data);
  };

  const fetchMedicaments = async (id) => {
    const res = await medservice.getMedicamentsByTraitement(id);
    setMedicaments(res.data);
  };

  if (!carnet) return <p style={{ padding: "2rem" }}>Chargement...</p>;

  return (
    <div style={{ minHeight: "100vh", background: "#f7f6f4", padding: "2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <button onClick={() => navigate("/carnetsante")}>← Retour</button>

          <div style={{ fontSize: "11px", color: "#b0afa9" }}>
            Carnets / <span style={{ color: "#1a1a18" }}>Détails</span>
          </div>

          <h1 style={{ fontSize: "22px", fontWeight: "500" }}>
            🩺 {carnet.animal?.nom}
          </h1>
        </div>

        <div
          style={{
            background: "#fff",
            border: "0.5px solid #e8e7e2",
            borderRadius: "14px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "12px",
          }}
        >
          <Info label="Groupe sanguin" value={carnet.groupeSanguin} />
          <Info label="Allergies" value={carnet.allergies || "Aucune"} />
          <Info label="Observations" value={carnet.observationsGenerales} />
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
          {["maladies", "vaccins", "rdv"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "11px",
                border: "0.5px solid #e8e7e2",
                background: tab === t ? "#1a1a18" : "#fff",
                color: tab === t ? "#fff" : "#4a4a47",
                cursor: "pointer",
              }}
            >
              {t === "maladies"
                ? "Maladies"
                : t === "vaccins"
                ? "Vaccinations"
                : "Rendez-vous"}
            </button>
          ))}
        </div>

        <div
          style={{
            background: "#fff",
            border: "0.5px solid #e8e7e2",
            borderRadius: "14px",
            padding: "1.5rem",
          }}
        >
          {tab === "maladies" && (
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <Title title="Maladies" />
                <MaladieList
                  maladies={carnet.maladies}
                  onSelect={(m) => setSelectedMaladie(m)}
                />
              </div>

              {selectedMaladie && (
                <div style={{ flex: 1 }}>
                  <Title title="Traitements" />
                  <TraitementList
                    traitements={traitements}
                    onSelect={(t) => setSelectedTraitement(t)}
                  />
                </div>
              )}

              {selectedTraitement && (
                <div style={{ flex: 1 }}>
                  <Title title="Médicaments" />
                  <MedicamentList medicaments={medicaments} />
                </div>
              )}
            </div>
          )}

          {tab === "vaccins" && (
            <>
              <Title title="Vaccinations" />
              <VaccinationList vaccinations={carnet.vaccinations} />
            </>
          )}

          {tab === "rdv" && (
            <div
              style={{ textAlign: "center", padding: "2rem", color: "#999" }}
            >
              <RendezVousList rdvs={carnet.rendezVous || []} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Info = ({ label, value }) => (
  <div>
    <div style={{ fontSize: "11px", color: "#999" }}>{label}</div>
    <div style={{ fontSize: "14px", fontWeight: "500" }}>{value || "—"}</div>
  </div>
);

const Title = ({ title }) => (
  <div style={{ marginBottom: "10px", fontSize: "13px", fontWeight: "500" }}>
    {title}
  </div>
);

export default CarnetSanteDetail;
