
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://groceryhub-backend-qknk.onrender.com/api"
    : "http://localhost:5000/api");

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const url = config.url || "";

    const publicAuthRoutes = [
      "/auth/send-email-otp",
      "/auth/verify-email-otp",
      "/auth/firebase-login",
      "/auth/send-otp",
      "/auth/verify-otp",
    ];

    const isPublicAuthRoute = publicAuthRoutes.some((route) =>
      url.includes(route)
    );

    if (isPublicAuthRoute) {
      delete config.headers.Authorization;
      delete config.headers.authorization;
      return config;
    }

    let token;

    if (
      url.includes("/admin") ||
      url.includes("/notifications/send") ||
      url.includes("/inventory")
    ) {
      token =
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");
    } else {
      token =
        localStorage.getItem("customerToken") ||
        sessionStorage.getItem("customerToken") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
