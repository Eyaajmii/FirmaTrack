import API from "../../../../api/api";

const BASE_URL = "/lots";

export const lotService = {
  getAll: () => API.get(BASE_URL),
  create: (lot) => API.post(BASE_URL, lot),
  update: (id,lot) => API.put(`${BASE_URL}/${id}`,lot),
  deleteLot: (id) => API.delete(`${BASE_URL}/${id}`),
  createLot: (lot) => API.post(`${BASE_URL}/with-cheptels`, lot),
};
