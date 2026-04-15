import API from "../../../api/api";

const BASE_URL = "/production-lait";

export const productionLaitService = {
  // Créer une nouvelle production
  createProduction: (productionData) => 
    API.post(`${BASE_URL}/ajouter`, productionData),

  // Récupérer toutes les productions
  getAllProductions: () => 
    API.get(BASE_URL),

  // Productions par animal (cheptel)
  getProductionsByCheptel: (cheptelId) => 
    API.get(`${BASE_URL}/animal/${cheptelId}`),

  // Productions par lot
  getProductionsByLot: (lotId) => 
    API.get(`${BASE_URL}/lot/${lotId}`),

  // (Optionnel - à ajouter plus tard)
  // deleteProduction: (id) => API.delete(`${BASE_URL}/${id}`),
  // updateProduction: (id, data) => API.put(`${BASE_URL}/${id}`, data),
};