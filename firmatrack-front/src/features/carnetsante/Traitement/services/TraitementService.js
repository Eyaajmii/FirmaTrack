import API from "../../../api/api";

export const getAllTraitements = () => API.get("/traitements");
export const getTraitementById = (id) => API.get(`/traitements/${id}`);
export const createTraitement = (maladieId, data) =>API.post(`/traitements/maladie/${maladieId}`, data);
export const updateTraitement = (id, data) =>API.put(`/traitements/${id}`, data);
export const deleteTraitement = (id) => API.delete(`/traitements/${id}`);
export const terminerTraitement = (id) =>API.put(`/traitements/terminer/${id}`);
export const getTraitementsByMaladie = (maladieId) =>API.get(`/traitements/maladie/${maladieId}`);
export const getTraitementsByStatut = (statut) =>API.get(`/traitements/statut/${statut}`);
