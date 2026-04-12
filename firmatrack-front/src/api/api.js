import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:8888/api",
});
export default API;