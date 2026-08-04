import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api";

export const getDeliverySettings = async () => {
    const response = await axios.get(
        `${API_BASE_URL}/admin/delivery-settings`
    );

    return (
        response.data?.data?.settings ||
        response.data?.settings
    );
};

export const updateDeliverySettings = async (data) => {
    const response = await axios.put(
        `${API_BASE_URL}/admin/delivery-settings`,
        data
    );

    return (
        response.data?.data?.settings ||
        response.data?.settings
    );
};