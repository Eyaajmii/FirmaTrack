import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as service from "../services/CarnetsanteService";
import * as animalService from "../../cheptel/services/CheptelService";

function CarnetsanteEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    groupeSanguin: "",
    allergies: "",
    observationsGenerales: "",
    animalId: "",
  });

  // 🔹 Chargement données
  useEffect(() => {
    const load = async () => {
      try {
        // charger animaux
        const resAnimals = await animalService.getAllAnimals();
        setAnimals(Array.isArray(resAnimals.data) ? resAnimals.data : []);

        // récupérer carnet depuis navigation
        const carnet = location.state || null;

        if (carnet) {
          setForm({
            groupeSanguin: carnet.groupeSanguin || "",
            allergies: carnet.allergies || "",
            observationsGenerales: carnet.observationsGenerales || "",
            animalId: carnet.animal?.id || "",
          });
        } else {
          // fallback API
          const res = await service.getById(id);
          const c = res.data;

          setForm({
            groupeSanguin: c.groupeSanguin || "",
            allergies: c.allergies || "",
            observationsGenerales: c.observationsGenerales || "",
            animalId: c.animal?.id || "",
          });
        }
      } catch (err) {
        console.error("Erreur chargement carnet", err);
        setErrorMsg("Impossible de charger les données");
      }
    };

    load();
  }, [id, location.state]);

  // 🔹 changement input
  const handleChange = (e) => {
    setErrorMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 submit update
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

    try {
      setLoading(true);
      await service.updateCarnet(id, payload);
      navigate("/carnetsante");
    } catch (err) {
      console.error("Erreur update carnet", err);
      setErrorMsg("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 styles
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
    marginBottom: "6px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f6f4", padding: "2rem" }}>
      {/* 🔙 retour */}
      <button onClick={() => navigate("/carnetsante")}>← Retour</button>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div
          style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "14px",
            border: "0.5px solid #e8e7e2",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Modifier carnet de santé</h2>

          {/* ❌ erreur */}
          {errorMsg && (
            <div
              style={{
                padding: "10px",
                background: "#FCEBEB",
                color: "#A32D2D",
                borderRadius: "8px",
                fontSize: "12px",
                marginBottom: "10px",
              }}
            >
              {errorMsg}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Animal */}
            <div>
              <label style={labelStyle}>Animal</label>
              <select
                name="animalId"
                value={form.animalId}
                disabled // ✅ BLOQUÉ
                style={{
                  ...inputStyle,
                  background: "#f1f0ec", // optionnel pour montrer visuellement disabled
                  cursor: "not-allowed",
                }}
              >
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
                name="groupeSanguin"
                value={form.groupeSanguin}
                onChange={handleChange}
                placeholder="Ex: A+"
                style={inputStyle}
              />
            </div>

            {/* Allergies */}
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

            {/* Observations */}
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

            {/* bouton */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px",
                background: loading ? "#f1f0ec" : "#1a1a18",
                color: loading ? "#9a9a96" : "#fff",
                border: "none",
                borderRadius: "9px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CarnetsanteEditPage;
