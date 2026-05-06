import API from "../../../../api/api";
export const getAllMedicaments = () => API.get("/medicaments");
export const getMedicamentById = (id) => API.get(`/medicaments/${id}`);
export const createMedicament = (traitementId, stockId, data) =>API.post(`/medicaments/traitement/${traitementId}/stock/${stockId}`, data);
export const updateMedicament = (id, data) =>API.put(`/medicaments/${id}`, data);
export const deleteMedicament = (id) => API.delete(`/medicaments/${id}`);
// Filtrage
export const getMedicamentsByTraitement = (traitementId) =>
  API.get(`/medicaments/traitement/${traitementId}`);
