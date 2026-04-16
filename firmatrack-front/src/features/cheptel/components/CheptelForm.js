import { useState } from "react";

function CheptelForm({ onAdd }) {
  const [form, setForm] = useState({
    chepnumber: "", nom: "", type: "", race: "", gender: "", statut: "ALIVE",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({ chepnumber: "", nom: "", type: "", race: "", gender: "", statut: "ALIVE" });
  };

  const inputClass = "w-full p-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/10 transition-all placeholder-gray-300";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1 mb-2 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Numéro ID</label>
          <input name="chepnumber" value={form.chepnumber} placeholder="TN-001" onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Nom</label>
          <input name="nom" value={form.nom} placeholder="Marguerite" onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input name="type" value={form.type} placeholder="Type (Vache...)" onChange={handleChange} className={inputClass} />
        <input name="race" value={form.race} placeholder="Race" onChange={handleChange} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
          <option value="">Genre</option>
          <option value="F">Femelle</option>
          <option value="M">Mâle</option>
        </select>
        <select name="statut" value={form.statut} onChange={handleChange} className={inputClass}>
          <option value="ALIVE">VIVANT</option>
          <option value="SOLD">VENDU</option>
          <option value="DEAD">DÉCÉDÉ</option>
        </select>
      </div>

      <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-lg shadow-gray-100 transition-all active:scale-95 text-xs tracking-widest mt-4">
        AJOUTER À L'INVENTAIRE
      </button>
    </form>
  );
}

export default CheptelForm;