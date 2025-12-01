import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001" // seu backend
});

export default api;
