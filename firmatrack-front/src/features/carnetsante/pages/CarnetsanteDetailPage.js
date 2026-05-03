import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as service from "../services/CarnetsanteService";

import VaccinationList from "./components/Vaccination/VaccinationList";
import MaladieList from "./components/Maladie/MaladieList";
import TraitementList from "./components/Traitement/TraitementList";

function CarnetSanteDetail() {
  const { id } = useParams(); // 👈 récupère ID depuis URL
  const [carnet, setCarnet] = useState(null);
  const [tab, setTab] = useState("vaccins");

  useEffect(() => {
    fetchCarnet();
  }, [id]);

  const fetchCarnet = async () => {
    try {
      const res = await service.getById(id); // ✅ appel API
      setCarnet(res.data);
    } catch (err) {
      console.error("Erreur chargement carnet", err);
    }
  };

  if (!carnet) return <p>Chargement...</p>;

  return (
    <div>
      <h2>🩺 {carnet.animal?.nom}</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setTab("vaccins")}>Vaccinations</button>
        <button onClick={() => setTab("maladies")}>Maladies</button>
        <button onClick={() => setTab("traitements")}>Traitements</button>
      </div>

      {/* CONTENT */}
      {tab === "vaccins" && <VaccinationList carnetId={carnet.id} />}

      {tab === "maladies" && <MaladieList carnetId={carnet.id} />}

      {tab === "traitements" && <TraitementList carnetId={carnet.id} />}
    </div>
  );
}

export default CarnetSanteDetail;
