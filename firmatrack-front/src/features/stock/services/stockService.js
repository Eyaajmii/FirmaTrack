import API from "../../../api/api";

const BASE_URL = "/stock";

export const stockService = {
  // US 49 & 51
  getAllStock: () => API.get(BASE_URL),
  
  createStock: (data) => API.post(BASE_URL, data),

  // US 52
  consommerStock: (id, qte) => 
    API.patch(`${BASE_URL}/${id}/consommer?qte=${qte}`),

  // US 55
  getAlertesQuantite: () => API.get(`${BASE_URL}/alertes/quantite`),
  
  getAlertesPeremption: () => API.get(`${BASE_URL}/alertes/peremption`),

  deleteStock: (id) => API.delete(`${BASE_URL}/${id}`),
};