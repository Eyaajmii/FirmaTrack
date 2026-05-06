import { useEffect, useState } from "react";
import * as ChepService from "../../../cheptel/services/CheptelService";
import * as Vetservice from "../../../veterinaire/services/VeterinaireService";

function RendezVousForm({ onAdd }) {
  const [cheptels, setCheptels] = useState([]);
  const [veterinaires, setVeterinaires] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    dateRDv: "",
    symptomes: "",
    remarques: "",
    veterinaireId: "",
    animalId: "",
  });

  useEffect(() => {
    const loadChep = async () => {
      try {
        const res = await ChepService.getAllAnimals();
        setCheptels(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erreur chargement animaux", err);
      }
    };
    loadChep();
  }, []);

  useEffect(() => {
    const loadVet = async () => {
      try {
        const res = await Vetservice.getAllVeterinaires();
        console.log("res.data complet :", res.data);
        console.log("type :", typeof res.data);
        setVeterinaires(
          Array.isArray(res.data) ? res.data : res.data.data || []
        );
      } catch (err) {
        console.error("Erreur chargement vétérinaires", err);
      }
    };
    loadVet();
  }, []);

  const handleChange = (e) => {
    setErrorMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.dateRDv || !form.animalId || !form.veterinaireId) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const payload = {
      dateRDv: form.dateRDv,
      symptomes: form.symptomes,
      remarques: form.remarques,
      veterinaire: { id: Number(form.veterinaireId) },
      animal: { id: Number(form.animalId) },
      statut: "Demande",
    };

    setLoading(true);
    const result = await onAdd(payload);
    setLoading(false);

    if (result?.success === false) {
      setErrorMsg(result.message);
      return;
    }

    setErrorMsg("");
    setForm({
      dateRDv: "",
      symptomes: "",
      remarques: "",
      veterinaireId: "",
      animalId: "",
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "0.5px solid #e8e7e2",
    borderRadius: "9px",
    fontSize: "13px",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: "10px",
    fontWeight: "500",
    color: "#9a9a96",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: "6px",
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        border: "0.5px solid #e8e7e2",
        padding: "1.5rem",
      }}
    >
      <h2
        style={{
          fontSize: "14px",
          fontWeight: "500",
          marginBottom: "1.25rem",
          color: "#1a1a18",
        }}
      >
        Prendre un rendez-vous
      </h2>

      {/* Message erreur */}
      {errorMsg && (
        <div
          style={{
            padding: "10px 12px",
            background: "#FCEBEB",
            color: "#A32D2D",
            borderRadius: "8px",
            fontSize: "12px",
            marginBottom: "12px",
            border: "0.5px solid #f7c1c1",
          }}
        >
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {/* Date */}
        <div>
          <label style={labelStyle}>Date</label>
          <input
            type="datetime-local"
            name="dateRDv"
            value={form.dateRDv}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Animal */}
        <div>
          <label style={labelStyle}>Animal</label>
          <select
            name="animalId"
            value={form.animalId}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">-- Choisir --</option>
            {cheptels.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Vétérinaire */}
        <div>
          <label style={labelStyle}>Vétérinaire</label>
          <select
            name="veterinaireId"
            value={form.veterinaireId}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">-- Choisir --</option>
            {veterinaires.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nomVet || v.user?.name || "Vétérinaire sans nom"}
              </option>
            ))}
          </select>
        </div>

        {/* Symptômes */}
        <div>
          <label style={labelStyle}>Symptômes</label>
          <textarea
            name="symptomes"
            value={form.symptomes}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "80px", resize: "none" }}
          />
        </div>

        {/* Remarques */}
        <div>
          <label style={labelStyle}>Remarques</label>
          <textarea
            name="remarques"
            value={form.remarques}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "80px", resize: "none" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: loading ? "#f1f0ec" : "#1a1a18",
            color: loading ? "#9a9a96" : "#fff",
            border: "none",
            borderRadius: "9px",
            fontSize: "13px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "500",
          }}
        >
          {loading ? "Enregistrement..." : "Prendre rendez-vous"}
        </button>
      </form>
    </div>
  );
}

export default RendezVousForm;
