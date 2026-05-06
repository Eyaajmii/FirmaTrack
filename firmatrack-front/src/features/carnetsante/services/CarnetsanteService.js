import API from "../../../api/api";

export const getAllcarnet = () => API.get("/carnetsante");
export const getById = (id) => API.get(`/carnetsante/${id}`);
export const createCarnet = (data) => API.post("/carnetsante", data);
export const updateCarnet = (id, data) =>API.put(`/carnetsante/${id}`, data);
export const deleteCarnet = (id) => API.delete(`/carnetsante/${id}`);
export const getByAnimal = (animalId) =>API.get(`/carnetsante/animal/${animalId}`);
export const getByFermier = (fermierId) =>API.get(`/carnetsante/fermier/${fermierId}`);
export const getByVeterinaire = (veterinaireId) =>API.get(`/carnetsante/veterinaire/${veterinaireId}`);
