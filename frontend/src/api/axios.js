import axios from "axios";

const api = axios.create({
  baseURL: "http://10.77.245.168:5000/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    let token;

    // =====================================================
    // 1. If request already has Authorization header,
    //    DO NOT overwrite it
    // =====================================================

    if (
      config.headers?.Authorization ||
      config.headers?.authorization
    ) {
      console.log(
        "🔐 Using Authorization header provided by request"
      );

      console.log("REQUEST URL:", config.url);

      console.log(
        "AUTH HEADER:",
        config.headers.Authorization ||
          config.headers.authorization
      );

      // Important:
      // Don't force Content-Type here.
      // Axios/browser will handle FormData automatically.
      return config;
    }

    // =====================================================
    // 2. Admin routes
    // =====================================================

    if (
      config.url?.includes("/admin") ||
      config.url?.includes("/notifications/send") ||
      config.url?.includes("/inventory")
    ) {
      token =
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");
    }

    // =====================================================
    // 3. Customer routes
    // =====================================================

    else {
      token =
        localStorage.getItem("customerToken") ||
        localStorage.getItem("token");
    }

    console.log("REQUEST URL:", config.url);
    console.log("TOKEN:", token);

    console.log(
      "AUTH HEADER:",
      token ? `Bearer ${token}` : "NO TOKEN"
    );

    // =====================================================
    // 4. Attach token
    // =====================================================

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // =====================================================
    // 5. IMPORTANT:
    //    Do NOT set Content-Type globally.
    //    Axios handles FormData automatically.
    // =====================================================

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;