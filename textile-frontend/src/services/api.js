import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;