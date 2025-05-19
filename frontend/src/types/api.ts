import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {},
});

export default api;
