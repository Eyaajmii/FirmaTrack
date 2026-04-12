import API from "../../../api/api";

export const getAllAnimals = () => API.get("/cheptel");

export const getById = (id) => API.get(`/cheptel/${id}`);

export const getByStatus = (statut) => API.get(`/cheptel/status/${statut}`);
export const getByNumber = (chepnumber) =>
  API.get(`/cheptel/number/${chepnumber}`);

export const createAnimal = (data) => API.post("/cheptel", data);

export const updateAnimal = (id, data) => API.put(`/cheptel/${id}`, data);

export const deleteAnimal = (id) => API.delete(`/cheptel/${id}`);
