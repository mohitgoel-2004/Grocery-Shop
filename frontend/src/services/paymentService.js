import api from "./api";

export const createPaymentOrder = async (amount) => {
    const res = await api.post("/payments/create-order", {
        amount,
    });

    return res.data.order;
};