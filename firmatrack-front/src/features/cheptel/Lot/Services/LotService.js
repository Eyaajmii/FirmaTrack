import API from "../../../../api/api";

const BASE_URL = "/lots";

export const lotService = {
  getAll: () => API.get(BASE_URL),
  
};