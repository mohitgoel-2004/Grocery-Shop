
import api from "../api/axios";

export const getDeliverySettings = async () => {
  const response = await api.get("/admin/delivery-settings");

  return (
    response.data?.data?.settings ||
    response.data?.settings
  );
};

export const updateDeliverySettings = async (data) => {
  const response = await api.put(
    "/admin/delivery-settings",
    data
  );

  return (
    response.data?.data?.settings ||
    response.data?.settings
  );
};
