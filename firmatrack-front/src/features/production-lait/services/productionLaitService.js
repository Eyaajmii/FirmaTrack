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

  // READ ONE  
  getProductionById: (id) =>
    API.get(`${BASE_URL}/${id}`),

  // UPDATE  
  updateProduction: (id, data) =>
    API.put(`${BASE_URL}/${id}`, data),

  // DELETE  
  deleteProduction: (id) =>
    API.delete(`${BASE_URL}/${id}`),
};