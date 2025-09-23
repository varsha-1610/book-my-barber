// src/utils/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // backend port
  withCredentials: true,            // if using cookies/sessions
});

export default api;
