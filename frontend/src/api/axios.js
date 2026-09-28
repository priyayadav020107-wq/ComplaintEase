import axios from "axios";

// Central axios instance. Base URL comes from the frontend .env file
// so it's easy to point at a different backend (e.g. deployed API).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach the saved JWT (if any) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
