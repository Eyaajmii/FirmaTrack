import { useEffect, useState } from "react";
import { lotService } from "../Lot/Services/LotService";

function CheptelForm({ onAdd }) {
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
    const loadLots = async () => {
      try {
        const res = await lotService.getAll();
        setLots(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erreur chargement lots", err);
      }
    };

    loadLots();
  }, []);

 
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
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

    onAdd(payload);

    setForm({
      chepnumber: "",
      nom: "",
      type: "",
      race: "",
      gender: "",
      statut: "ALIVE",
      lotId: "",
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
      style={{ background: "#fff", padding: "1.5rem", borderRadius: "14px" }}
    >
      <h2>Ajouter un animal</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
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
        <div style={gridTwo}>
  <div>
  <label style={labelStyle}>Type</label>
  <select
    name="type"
    value={form.type}
    onChange={handleChange}
    style={inputStyle}
    required
  >
    <option value="">-- Choisir un type --</option>
    <option value="VACHE">Vache (Filière Lait)</option>
    <option value="POULE">Poule (Filière Œufs)</option>
    <option value="CHEVRE">Chèvre (Lait de chèvre)</option>
    <option value="BREBIS">Brebis</option>
  </select>
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
          Ajouter à l'inventaire
        </button>
      </form>
    </div>
  );
}

export default CheptelForm;