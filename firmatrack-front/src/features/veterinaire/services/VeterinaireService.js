import API from "../../../api/api";

export const getAllVeterinaires = () => API.get("/veterinaires");

export const getVeterinaireById = (id) => API.get(`/veterinaires/${id}`);

export const getBySpecialite = (specialite) =>
  API.get(`/veterinaires/specialite/${specialite}`);

export const getUrgence = () => API.get("/veterinaires/urgence");

export const getDeplacementFerme = () =>
  API.get("/veterinaires/deplacement-ferme");

export const createVeterinaire = (data) => API.post("/veterinaires", data);

export const updateVeterinaire = (id, data) =>
  API.put(`/veterinaires/${id}`, data);

// 🔹 Delete vétérinaire
export const deleteVeterinaire = (id) => API.delete(`/veterinaires/${id}`);
