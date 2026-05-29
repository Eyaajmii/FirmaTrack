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
export const getVeterinairesProches = (lat, lng, rayonKm = 20) =>
  API.get(`/veterinaires/proches?lat=${lat}&lng=${lng}&rayonKm=${rayonKm}`);

export const calculDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const ouvrirItineraireGPS = (lat, lng) => {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    "_blank",
    "noopener,noreferrer"
  );
};

export const appelerVeterinaire = (telephone) => {
  if (!telephone) return alert("Aucun numéro disponible.");
  window.location.href = `tel:${telephone}`;
};
