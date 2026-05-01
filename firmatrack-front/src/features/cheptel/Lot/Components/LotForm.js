import { useEffect, useState } from "react";
import * as animalService from "../../services/CheptelService";

function LotForm({ onAdd, loading }) {
  const [animals, setAnimals] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    nom: "",
    description: "",
  });

  // 🟢 selected animals (multi-select logic)
  const [selectedAnimals, setSelectedAnimals] = useState([]);

  // 🔄 load animals
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

  // 📌 inputs
  const handleChange = (e) => {
    setErrorMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ add/remove animal
  const toggleAnimal = (animal) => {
    const exists = selectedAnimals.find((a) => a.id === animal.id);

    if (exists) {
      setSelectedAnimals(selectedAnimals.filter((a) => a.id !== animal.id));
    } else {
      setSelectedAnimals([...selectedAnimals, animal]);
    }
  };

  // 🚀 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedAnimals.length === 0) {
      setErrorMsg("Veuillez sélectionner au moins un animal");
      return;
    }

    const payload = {
      nom: form.nom,
      description: form.description,
      cheptels: selectedAnimals.map((a) => ({ id: a.id })),
    };

    await onAdd(payload);

    // reset
    setForm({ nom: "", description: "" });
    setSelectedAnimals([]);
  };

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "0.5px solid #e8e7e2",
    borderRadius: "9px",
    fontSize: "13px",
    background: "#fff",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "10px",
    fontWeight: "500",
    color: "#9a9a96",
    textTransform: "uppercase",
    marginBottom: "6px",
  };

  const chipStyle = (active) => ({
    padding: "6px 10px",
    borderRadius: "20px",
    border: active ? "0.5px solid #3B6D11" : "0.5px solid #e8e7e2",
    background: active ? "#EAF3DE" : "#fff",
    fontSize: "11px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  });

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        border: "0.5px solid #e8e7e2",
        padding: "1.5rem",
      }}
    >
      <h2 style={{ fontSize: "14px", fontWeight: "500", marginBottom: "1rem" }}>
        Ajouter un lot
      </h2>

      {/* ERROR */}
      {errorMsg && (
        <div
          style={{
            padding: "10px",
            background: "#FCEBEB",
            color: "#A32D2D",
            borderRadius: "8px",
            fontSize: "12px",
            marginBottom: "12px",
          }}
        >
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {/* NOM */}
        <div>
          <label style={labelStyle}>Nom du lot</label>
          <input
            name="nom"
            value={form.nom}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Lot veaux"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: "80px" }}
          />
        </div>

        {/* 🟢 MULTI SELECTION UI */}
        <div>
          <label style={labelStyle}>Cheptels disponibles</label>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {animals.map((a) => {
              const active = selectedAnimals.find((x) => x.id === a.id);

              return (
                <div
                  key={a.id}
                  onClick={() => toggleAnimal(a)}
                  style={chipStyle(active)}
                >
                  {a.chepnumber} • {a.nom}
                  {active && <span>✔</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* SELECTED LIST */}
        {selectedAnimals.length > 0 && (
          <div>
            <label style={labelStyle}>Sélectionnés</label>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {selectedAnimals.map((a) => (
                <span
                  key={a.id}
                  style={{
                    padding: "5px 8px",
                    borderRadius: "15px",
                    background: "#1a1a18",
                    color: "#fff",
                    fontSize: "11px",
                  }}
                >
                  {a.chepnumber} ({a.nom})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SUBMIT */}
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
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "500",
          }}
        >
          {loading ? "Création..." : "Ajouter le lot"}
        </button>
      </form>
    </div>
  );
}

export default LotForm;
