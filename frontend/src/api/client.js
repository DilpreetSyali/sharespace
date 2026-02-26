import axios from "axios";

// ✅ Use SAME-ORIGIN requests, Vite proxy will forward /api → http://localhost:5000
const api = axios.create({
  baseURL: "",
  });

  api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("sharespace_user") || "null");
      if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
        return config;
        });

        export default api;