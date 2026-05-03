import API from "../../../api/api";

export const getAllMaladies = () => API.get("/maladies");
export const getMaladieById = (id) => API.get(`/maladies/${id}`);
export const createMaladie = (carnetId, data) =>API.post(`/maladies/carnet/${carnetId}`, data);
export const updateMaladie = (id, data) =>API.put(`/maladies/${id}`, data);
export const deleteMaladie = (id) =>API.delete(`/maladies/${id}`);
// Filtres
export const getMaladiesByCarnet = (carnetId) =>API.get(`/maladies/carnet/${carnetId}`);
export const getMaladiesByVeterinaire = (vetId) =>API.get(`/maladies/veterinaire/${vetId}`);
export const getMaladiesByStatut = (statut) =>API.get(`/maladies/statut/${statut}`);
export const getMaladiesActives = () =>API.get("/maladies/actives");