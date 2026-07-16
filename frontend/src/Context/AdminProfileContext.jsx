import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getAdminProfile,
} from "../services/adminProfileService";

const AdminProfileContext = createContext();

export const AdminProfileProvider = ({ children }) => {
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // Fetch Profile
  // ===============================
  const fetchAdminProfile = async () => {
    try {
      setLoading(true);

      const res = await getAdminProfile();

      setAdminProfile(res.admin);
    } catch (err) {
      console.error("Failed to load admin profile", err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Update Profile in Context
  // ===============================
  const updateAdminProfile = (data) => {
    setAdminProfile(data);
  };

  // ===============================
  // Refresh Profile From Backend
  // ===============================
  const refreshProfile = async () => {
    await fetchAdminProfile();
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  return (
    <AdminProfileContext.Provider
      value={{
        adminProfile,
        setAdminProfile,
        updateAdminProfile,
        refreshProfile,
        loading,
      }}
    >
      {children}
    </AdminProfileContext.Provider>
  );
};

// ===============================
// Custom Hook
// ===============================
export const useAdminProfile = () => {
  const context = useContext(AdminProfileContext);

  if (!context) {
    throw new Error(
      "useAdminProfile must be used inside AdminProfileProvider"
    );
  }

  return context;
};