import { useEffect, useState } from "react";
import * as animalService from "../../cheptel/services/CheptelService";

function CarnetsanteForm({ onAdd }) {
  const [animals, setAnimals] = useState([]);

  const [form, setForm] = useState({
    groupeSanguin: "",
    allergies: "",
    observationsGenerales: "",
    animalId: "",
  });

  // 🔵 LOAD ANIMALS
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

  // 🟢 CHANGE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.animalId) {
      alert("Veuillez sélectionner un animal");
      return;
    }

    const payload = {
      groupeSanguin: form.groupeSanguin,
      allergies: form.allergies,
      observationsGenerales: form.observationsGenerales,
      animal: {
        id: Number(form.animalId),
      },
    };

    onAdd(payload);

    // reset form
    setForm({
      groupeSanguin: "",
      allergies: "",
      observationsGenerales: "",
      animalId: "",
    });
  };

  // 🎨 styles
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
      {/* TITLE */}
      <h2
        style={{
          fontSize: "14px",
          fontWeight: "500",
          marginBottom: "1.25rem",
        }}
      >
        🩺 Ajouter un carnet de santé
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* 🐄 ANIMAL SELECT */}
        <div>
          <label style={labelStyle}>Animal (chepnumber)</label>

          <select
            name="animalId"
            value={form.animalId}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">-- choisir un animal --</option>

            {animals.map((a) => (
              <option key={a.id} value={a.id}>
                {a.chepnumber} • {a.nom}
              </option>
            ))}
          </select>
        </div>

        {/* 🧬 GROUPE SANGUIN */}
        <div>
          <label style={labelStyle}>Groupe sanguin</label>
          <input
            name="groupeSanguin"
            value={form.groupeSanguin}
            onChange={handleChange}
            placeholder="Ex: A+"
            style={inputStyle}
          />
        </div>

        {/* ⚠️ ALLERGIES */}
        <div>
          <label style={labelStyle}>Allergies</label>
          <input
            name="allergies"
            value={form.allergies}
            onChange={handleChange}
            placeholder="Ex: Pollen"
            style={inputStyle}
          />
        </div>

        {/* 📝 OBSERVATIONS */}
        <div>
          <label style={labelStyle}>Observations générales</label>
          <textarea
            name="observationsGenerales"
            value={form.observationsGenerales}
            onChange={handleChange}
            placeholder="Notes vétérinaires..."
            style={{
              ...inputStyle,
              minHeight: "90px",
              resize: "none",
            }}
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#1a1a18",
            color: "#fff",
            border: "none",
            borderRadius: "9px",
            fontSize: "13px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Ajouter carnet
        </button>
      </form>
    </div>
  );
}

export default CarnetsanteForm;
