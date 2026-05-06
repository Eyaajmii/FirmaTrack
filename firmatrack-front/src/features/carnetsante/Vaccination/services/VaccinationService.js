import API from "../../../api/api";

export const getAllVaccinations = () => API.get("/vaccinations");
export const getVaccinationById = (id) => API.get(`/vaccinations/${id}`);
export const createVaccination = (carnetId, data) =>API.post(`/vaccinations/carnet/${carnetId}`, data);
export const updateVaccination = (id, data) =>API.put(`/vaccinations/${id}`, data);
export const deleteVaccination = (id) => API.delete(`/vaccinations/${id}`);
// Filtres
export const getVaccinationsByCarnet = (carnetId) =>API.get(`/vaccinations/carnet/${carnetId}`);
export const getVaccinationsByStatut = (statut) =>API.get(`/vaccinations/statut/${statut}`);
// Prévisions / planning
export const getVaccinationsAvenir = () => API.get("/vaccinations/avenir");
export const getVaccinationsAvenirByAnimal = (animalId) =>API.get(`/vaccinations/animal/${animalId}/avenir`);
export const getVaccinationsAvenirByFermier = (fermierId) =>API.get(`/vaccinations/fermier/${fermierId}/avenir`);
export const marquerVaccinationRealisee = (id) =>API.put(`/vaccinations/realisee/${id}`);
