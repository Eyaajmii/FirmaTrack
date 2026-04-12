import { useState } from "react";

function CheptelForm({ onAdd }) {
  const [form, setForm] = useState({
    chepnumber: "",
    nom: "",
    type: "",
    race: "",
    gender: "",
    statut: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);

    setForm({
      chepnumber: "",
      nom: "",
      type: "",
      race: "",
      gender: "",
      statut: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="chepnumber" placeholder="Numéro" onChange={handleChange} />
      <input name="nom" placeholder="Nom" onChange={handleChange} />
      <input name="type" placeholder="Type" onChange={handleChange} />
      <input name="race" placeholder="Race" onChange={handleChange} />
      <input name="gender" placeholder="Gender" onChange={handleChange} />
      <input name="statut" placeholder="Statut" onChange={handleChange} />

      <button type="submit">Ajouter</button>
    </form>
  );
}

export default CheptelForm;
