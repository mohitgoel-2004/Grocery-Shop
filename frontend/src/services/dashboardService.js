import api from "./api";

export const getDashboard = async () => {
  const adminToken = localStorage.getItem("adminToken");

  console.log("Dashboard Token:", adminToken);

  const res = await api.get("/admin/dashboard", {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  console.log("Dashboard API Response:", res);

  return res.data;
};