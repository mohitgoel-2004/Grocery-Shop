import axios from "axios";

const api = axios.create({
  baseURL: "http://10.77.245.168:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});





api.interceptors.request.use((config) => {
  let token;

  if (
    config.url.includes("/admin") ||
    config.url.includes("/notifications/send")
  ) {
    token = localStorage.getItem("adminToken");
  } else {
    token =
      localStorage.getItem("customerToken") ||
      localStorage.getItem("token");
  }

  console.log("REQUEST URL:", config.url);
  console.log("TOKEN:", token);
  console.log("AUTH HEADER:", token ? `Bearer ${token}` : "NO TOKEN");
  console.log("FINAL CONFIG:", config);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});





export default api;