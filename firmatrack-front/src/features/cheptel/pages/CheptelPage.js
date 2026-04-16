import { useEffect, useState } from "react";
import * as service from "../services/CheptelService";

import CheptelForm from "../components/CheptelForm";
import CheptelFilter from "../components/CheptelFilter";
import CheptelList from "../components/CheptelList";

function CheptelPage() {
  const [animals, setAnimals] = useState([]);

  const fetchAnimals = async () => {
    const res = await service.getAllAnimals();
    setAnimals(res.data);
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleAdd = async (data) => {
    await service.createAnimal(data);
    fetchAnimals();
  };

  const handleDelete = async (id) => {
    await service.deleteAnimal(id);
    fetchAnimals();
  };

  const handleFilter = async (status) => {
    if (!status) { fetchAnimals(); return; }
    const res = await service.getByStatus(status);
    setAnimals(res.data);
  };

  const handleSearch = async (value) => {
    if (!value) { fetchAnimals(); return; }
    try {
      const res = await service.getByNumber(value);
      setAnimals([res.data]);
    } catch {
      setAnimals([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] px-8 py-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Style Pro */}
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">
            <span>FirmaTrack</span>
            <span>/</span>
            <span className="text-gray-900">Inventory</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Project Cheptel</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Colonne Formulaire (Gauche) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Ajouter un animal</h2>
              <CheptelForm onAdd={handleAdd} />
            </div>
          </div>

          {/* Colonne Liste et Filtres (Droite) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8">
              
              {/* Toolbar : Filtres + Reset */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
                <div className="flex-1">
                  <CheptelFilter onFilter={handleFilter} onSearch={handleSearch} />
                </div>
                
                <button 
                  onClick={fetchAnimals}
                  className="ml-4 px-5 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
                >
                  RÉINITIALISER
                </button>
              </div>

              {/* Liste des animaux */}
              <div className="relative">
                <CheptelList animals={animals} onDelete={handleDelete} />
              </div>

              {/* Footer de la carte */}
              <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                   Total : {animals.length} Animaux
                 </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CheptelPage;