import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { lotService } from "../Services/LotService";
import * as animalService from "../../services/CheptelService";

function LotEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [animals, setAnimals] = useState([]);
  const [selectedAnimals, setSelectedAnimals] = useState([]);

  const [form, setForm] = useState({
    nom: "",
    description: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const resAnimals = await animalService.getAllAnimals();
        setAnimals(Array.isArray(resAnimals.data) ? resAnimals.data : []);

        const lot = location.state || null;

        if (lot) {
          setForm({
            nom: lot.nom || "",
            description: lot.description || "",
          });

          setSelectedAnimals(lot.cheptels || []);
        } else {
          const res = await lotService.getById(id);
          const l = res.data;

          setForm({
            nom: l.nom || "",
            description: l.description || "",
          });

          setSelectedAnimals(l.cheptels || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [id, location.state]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleAnimal = (animal) => {
    const exists = selectedAnimals.find((a) => a.id === animal.id);

    if (exists) {
      setSelectedAnimals(selectedAnimals.filter((a) => a.id !== animal.id));
    } else {
      setSelectedAnimals([...selectedAnimals, animal]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nom: form.nom,
      description: form.description,
      cheptels: selectedAnimals.map((a) => ({ id: a.id })),
    };

    try {
      await lotService.update(id, payload);
      navigate("/lots");
    } catch (err) {
      console.error("Update lot error", err);
    }
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
    <div style={{ minHeight: "100vh", background: "#f7f6f4", padding: "2rem" }}>
      <button onClick={() => navigate("/lots")}>← Retour</button>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div
          style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "14px",
            border: "0.5px solid #e8e7e2",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Modifier lot</h2>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* NOM */}
            <div>
              <label style={labelStyle}>Nom</label>
              <input
                name="nom"
                value={form.nom}
                onChange={handleChange}
                style={inputStyle}
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

            {/* ANIMALS */}
            <div>
              <label style={labelStyle}>Cheptels</label>

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

            {/* SELECTED */}
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
              style={{
                padding: "10px",
                background: "#1a1a18",
                color: "#fff",
                border: "none",
                borderRadius: "9px",
                cursor: "pointer",
              }}
            >
              Mettre à jour
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LotEditPage;
