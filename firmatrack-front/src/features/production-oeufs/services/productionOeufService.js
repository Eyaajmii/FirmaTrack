import API from "../../../api/api";

const BASE_URL = "/production-oeufs";

export const productionOeufService = {
  // Créer une nouvelle collecte
  createProduction: (data) =>
    API.post(`${BASE_URL}/ajouter`, data),

  // Toutes les productions
  getAllProductions: () =>
    API.get(BASE_URL),

  // Par animal
  getProductionsByCheptel: (cheptelId) =>
    API.get(`${BASE_URL}/animal/${cheptelId}`),

  // Par lot
  getProductionsByLot: (lotId) =>
    API.get(`${BASE_URL}/lot/${lotId}`),

  // Une seule production
  getProductionById: (id) =>
    API.get(`${BASE_URL}/${id}`),

  // Modifier
  updateProduction: (id, data) =>
    API.put(`${BASE_URL}/${id}`, data),

  // Supprimer
  deleteProduction: (id) =>
    API.delete(`${BASE_URL}/${id}`),
};