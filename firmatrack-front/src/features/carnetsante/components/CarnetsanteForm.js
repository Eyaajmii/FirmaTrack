import { useEffect, useState } from "react";
import * as animalService from "../../cheptel/services/CheptelService";

function CarnetsanteForm({ onAdd }) {
  const [animals, setAnimals] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    groupeSanguin: "",
    allergies: "",
    observationsGenerales: "",
    animalId: "",
  });

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const res = await animalService.getAllAnimals();
        setAnimals(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erreur chargement animaux", err);
      }
    };
    loadAnimals();
  }, []);

  const handleChange = (e) => {
    setErrorMsg('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.animalId) {
      setErrorMsg("Veuillez sélectionner un animal");
      return;
    }

    const payload = {
      groupeSanguin: form.groupeSanguin,
      allergies: form.allergies,
      observationsGenerales: form.observationsGenerales,
      animal: { id: Number(form.animalId) },
    };

    setLoading(true);
    const result = await onAdd(payload);
    setLoading(false);

    if (result?.success === false) {
      setErrorMsg(result.message);
      return;
    }

    setErrorMsg('');
    setForm({ groupeSanguin: "", allergies: "", observationsGenerales: "", animalId: "" });
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    border: "0.5px solid #e8e7e2", borderRadius: "9px",
    fontSize: "13px", background: "#fff", outline: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block", fontSize: "10px", fontWeight: "500",
    color: "#9a9a96", textTransform: "uppercase",
    letterSpacing: "0.07em", marginBottom: "6px",
  };

  return (
    <div style={{ background: "#fff", borderRadius: "14px", border: "0.5px solid #e8e7e2", padding: "1.5rem" }}>
      <h2 style={{ fontSize: "14px", fontWeight: "500", marginBottom: "1.25rem", color: "#1a1a18" }}>
        Ajouter un carnet de santé
      </h2>

      {/* Message d'erreur */}
      {errorMsg && (
        <div style={{
          padding: "10px 12px", background: "#FCEBEB", color: "#A32D2D",
          borderRadius: "8px", fontSize: "12px", marginBottom: "12px",
          border: "0.5px solid #f7c1c1",
        }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

        {/* Animal */}
        <div>
          <label style={labelStyle}>Animal</label>
          <select name="animalId" value={form.animalId} onChange={handleChange} style={inputStyle}>
            <option value="">-- Choisir un animal --</option>
            {animals.map((a) => (
              <option key={a.id} value={a.id}>
                {a.chepnumber} • {a.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Groupe sanguin */}
        <div>
          <label style={labelStyle}>Groupe sanguin</label>
          <input
            name="groupeSanguin" value={form.groupeSanguin}
            onChange={handleChange} placeholder="Ex: A+"
            style={inputStyle}
          />
        </div>

        {/* Allergies */}
        <div>
          <label style={labelStyle}>Allergies</label>
          <input
            name="allergies" value={form.allergies}
            onChange={handleChange} placeholder="Ex: Pollen"
            style={inputStyle}
          />
        </div>

        {/* Observations */}
        <div>
          <label style={labelStyle}>Observations générales</label>
          <textarea
            name="observationsGenerales" value={form.observationsGenerales}
            onChange={handleChange} placeholder="Notes vétérinaires..."
            style={{ ...inputStyle, minHeight: "90px", resize: "none", fontFamily: "inherit" }}
          />
        </div>

        <button type="submit" disabled={loading} style={{
          width: "100%", padding: "10px",
          background: loading ? "#f1f0ec" : "#1a1a18",
          color: loading ? "#9a9a96" : "#fff",
          border: "none", borderRadius: "9px", fontSize: "13px",
          cursor: loading ? "not-allowed" : "pointer", fontWeight: "500",
        }}>
          {loading ? "Enregistrement..." : "Ajouter carnet"}
        </button>
      </form>
    </div>
  );
}

export default CarnetsanteForm;