import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { lotService } from "../Lot/Services/LotService";
import * as service from "../services/CheptelService";

function CheptelEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [lots, setLots] = useState([]);

  const [form, setForm] = useState({
    chepnumber: "",
    nom: "",
    type: "",
    race: "",
    gender: "",
    statut: "ALIVE",
    lotId: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const resLots = await lotService.getAll();
        setLots(Array.isArray(resLots.data) ? resLots.data : []);

        const animal = location.state;

        if (animal) {
          setForm({
            chepnumber: animal.chepnumber || "",
            nom: animal.nom || "",
            type: animal.type || "",
            race: animal.race || "",
            gender: animal.gender || "",
            statut: animal.statut || "ALIVE",
            lotId: animal.lot?.id || "",
          });
        } else {
          // 🟡 fallback API
          const res = await service.getById(id);
          const a = res.data;

          setForm({
            chepnumber: a.chepnumber || "",
            nom: a.nom || "",
            type: a.type || "",
            race: a.race || "",
            gender: a.gender || "",
            statut: a.statut || "ALIVE",
            lotId: a.lot?.id || "",
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      chepnumber: form.chepnumber,
      nom: form.nom,
      type: form.type,
      race: form.race,
      gender: form.gender,
      statut: form.statut,
      lot: form.lotId ? { id: Number(form.lotId) } : null,
    };

    try {
      await service.updateAnimal(id, payload);
      navigate("/cheptel");
    } catch (err) {
      console.error("Update error", err);
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

  const gridTwo = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f6f4",
        padding: "2rem",
      }}
    >
      <button onClick={() => navigate("/cheptel")} style={{ marginTop: "1rem" }}>
        ← Retour
      </button>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div
          style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "14px",
            border: "0.5px solid #e8e7e2",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Modifier animal</h2>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* ID + NOM */}
            <div style={gridTwo}>
              <div>
                <label style={labelStyle}>Numéro ID</label>
                <input
                  name="chepnumber"
                  value={form.chepnumber}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Nom</label>
                <input
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* TYPE + RACE */}
            <div style={gridTwo}>
              <div>
                <label style={labelStyle}>Type</label>
                <input
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Race</label>
                <input
                  name="race"
                  value={form.race}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* GENDER + STATUT */}
            <div style={gridTwo}>
              <div>
                <label style={labelStyle}>Genre</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="">-- Choisir --</option>
                  <option value="F">Femelle</option>
                  <option value="M">Mâle</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Statut</label>
                <select
                  name="statut"
                  value={form.statut}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="ALIVE">Vivant</option>
                  <option value="SOLD">Vendu</option>
                  <option value="DEAD">Décédé</option>
                </select>
              </div>
            </div>

            {/* LOT */}
            <div>
              <label style={labelStyle}>Lot</label>

              <select
                name="lotId"
                value={form.lotId}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">-- Aucun lot --</option>
                {lots.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* BUTTON */}
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

export default CheptelEditPage;
