import React from 'react';

const CheptelList = ({ animals, onDelete }) => {
  if (!animals || animals.length === 0) {
    return <div className="py-10 text-center text-gray-400 text-sm italic">Aucun animal trouvé.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
            <th className="pb-4">Animal</th>
            <th className="pb-4">Identification</th>
            <th className="pb-4">Statut</th>
            <th className="pb-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {animals.map((animal) => (
            <tr key={animal.id} className="group hover:bg-gray-50/50 transition-colors">
              <td className="py-5">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">{animal.nom}</span>
                  <span className="text-xs text-gray-400">{animal.type} — {animal.race}</span>
                </div>
              </td>
              <td className="py-5">
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                  {animal.chepnumber}
                </span>
              </td>
              <td className="py-5">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                  animal.statut === 'ALIVE' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {animal.statut}
                </span>
              </td>
              <td className="py-5 text-right">
                <button 
                  onClick={() => onDelete(animal.id)}
                  className="opacity-0 group-hover:opacity-100 px-3 py-1.5 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  SUPPRIMER
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CheptelList;