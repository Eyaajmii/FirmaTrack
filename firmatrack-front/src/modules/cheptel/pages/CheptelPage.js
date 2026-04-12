import { useEffect, useState } from "react";
import * as service from "../services/CheptelService";

import CheptelForm from "../components/CheptelForm";
import CheptelFilter from "../components/CheptelFilter";
import CheptelList from "../components/CheptelList";
import "../styles/cheptel.css";

function CheptelPage() {
  const [animals, setAnimals] = useState([]);
  //getAll
  const fetchAnimals = async () => {
    const res = await service.getAllAnimals();
    setAnimals(res.data);
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  //ajouter Cheptel
  const handleAdd = async (data) => {
    await service.createAnimal(data);
    fetchAnimals();
  };

  //supprimerCheptel
  const handleDelete = async (id) => {
    await service.deleteAnimal(id);
    fetchAnimals();
  };

  //Filtrer 
  const handleFilter = async (status) => {
    if (!status) {
      fetchAnimals();
      return;
    }
    const res = await service.getByStatus(status);
    setAnimals(res.data);
  };

  //rechercher
  const handleSearch = async (value) => {
    if (!value) {
      fetchAnimals();
      return;
    }

    try {
      const res = await service.getByNumber(value);
      setAnimals([res.data]);
    } catch {
      setAnimals([]);
    }
  };

  return (
    <div className="container">
      <h1>Gestion du Cheptel</h1>

      <CheptelForm onAdd={handleAdd} />

      <CheptelFilter onFilter={handleFilter} onSearch={handleSearch} />

      <button onClick={fetchAnimals}>Reset</button>

      <CheptelList animals={animals} onDelete={handleDelete} />
    </div>
  );
}

export default CheptelPage;
