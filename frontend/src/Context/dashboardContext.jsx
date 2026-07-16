import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getDashboard } from "../services/dashboardService";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dashboard, setDashboard] = useState({
    summary: {},
    today: {},
    inventory: {},
    recentOrders: [],
    topProducts: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDashboard();

     console.log("Dashboard Response =", response);
console.log("Dashboard Response Data =", response.data);

      // Backend response:
      // {
      //   success: true,
      //   data: { summary, today, inventory, recentOrders, topProducts }
      // }

      if (response?.success) {
        setDashboard(response.data);
      } else {
        setError("Failed to load dashboard");
      }
    } catch (err) {
      console.error("Dashboard Error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Dashboard Error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        dashboard,
        loading,
        error,
        refreshDashboard: loadDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard must be used inside DashboardProvider"
    );
  }

  return context;
};