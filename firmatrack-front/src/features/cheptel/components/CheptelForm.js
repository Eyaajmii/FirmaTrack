import { useState } from "react";

function CheptelForm({ onAdd }) {
  const [form, setForm] = useState({
    chepnumber: "", nom: "", type: "", race: "", gender: "", statut: "ALIVE",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({ chepnumber: "", nom: "", type: "", race: "", gender: "", statut: "ALIVE" });
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '0.5px solid #e8e7e2',
    borderRadius: '9px', fontSize: '13px', color: '#1a1a18',
    background: '#fff', outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontSize: '10px', fontWeight: '500', color: '#9a9a96',
    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px',
  };

  const gridTwo = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' };

  return (
    <div style={{ background: '#fff', borderRadius: '14px', border: '0.5px solid #e8e7e2', padding: '1.5rem' }}>
      <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a18', marginBottom: '1.25rem' }}>
        Ajouter un animal
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        <div style={gridTwo}>
          <div>
            <label style={labelStyle}>Numéro ID</label>
            <input name="chepnumber" value={form.chepnumber} placeholder="TN-001" onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Nom</label>
            <input name="nom" value={form.nom} placeholder="Marguerite" onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={gridTwo}>
          <div>
            <label style={labelStyle}>Type</label>
            <input name="type" value={form.type} placeholder="Vache..." onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Race</label>
            <input name="race" value={form.race} placeholder="Holstein" onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={gridTwo}>
          <div>
            <label style={labelStyle}>Genre</label>
            <select name="gender" value={form.gender} onChange={handleChange} style={inputStyle}>
              <option value="">-- Choisir --</option>
              <option value="F">Femelle</option>
              <option value="M">Mâle</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Statut</label>
            <select name="statut" value={form.statut} onChange={handleChange} style={inputStyle}>
              <option value="ALIVE">Vivant</option>
              <option value="SOLD">Vendu</option>
              <option value="DEAD">Décédé</option>
            </select>
          </div>
        </div>

        <button type="submit" style={{
          width: '100%', padding: '10px', background: '#1a1a18',
          color: '#fff', border: 'none', borderRadius: '9px',
          fontSize: '13px', fontWeight: '500', cursor: 'pointer',
          marginTop: '4px',
        }}>
          Ajouter à l'inventaire
        </button>
      </form>
    </div>
  );
}

export default CheptelForm;