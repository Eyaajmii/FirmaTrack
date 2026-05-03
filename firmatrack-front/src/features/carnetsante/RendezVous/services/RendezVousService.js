import API from "../../../api/api";

export const createRendezVous = (data) => API.post("/rendezvous", data);
export const updateRendezVous = (id, data) =>API.put(`/rendezvous/${id}`, data);
export const deleteRendezVous = (id) => API.delete(`/rendezvous/${id}`);
export const getRendezVousById = (id) => API.get(`/rendezvous/${id}`);
// Actions métier
export const confirmerRendezVous = (id) =>API.put(`/rendezvous/confirmer/${id}`);
export const terminerRendezVous = (id) => API.put(`/rendezvous/terminer/${id}`);
// Filtres
export const getRendezVousByVeterinaire = (vetId) =>API.get(`/rendezvous/veterinaire/${vetId}`);
export const getRendezVousByFermier = (fermierId) =>API.get(`/rendezvous/fermier/${fermierId}`);
export const getRendezVousByAnimal = (animalId) =>API.get(`/rendezvous/animal/${animalId}`);
export const getRendezVousByStatut = (statut) =>API.get(`/rendezvous/statut/${statut}`);
