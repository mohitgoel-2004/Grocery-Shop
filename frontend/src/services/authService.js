import api from "../api/axios";

export const sendOtp = async (mobile) => {
  const response = await api.post("/auth/send-otp", { mobile });
  return response.data;
};

export const verifyOtp = async (mobile, otp) => {
  const response = await api.post("/auth/verify-otp", { mobile, otp });
  return response.data;
};

export const firebaseLogin = async (idToken) => {
  const response = await api.post("/auth/firebase-login", { idToken });
  return response.data;
};

export { sendFirebaseOtp, confirmFirebaseOtp } from "./firebasePhoneAuth";