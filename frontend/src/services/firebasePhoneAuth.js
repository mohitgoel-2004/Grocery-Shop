import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth, firebaseConfigError } from "../firebase";

let recaptchaVerifier = null;
let recaptchaContainerId = null;
let confirmationResult = null;

const getFirebaseErrorMessage = (error) => {
  switch (error?.code) {
    case "auth/invalid-phone-number":
      return "Enter a valid Indian mobile number.";
    case "auth/invalid-verification-code":
      return "The OTP is invalid. Check the code and try again.";
    case "auth/code-expired":
      return "This OTP has expired. Request a new OTP.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again later.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded. Please try again later.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA verification failed. Please try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return error?.message || "Phone authentication failed. Please try again.";
  }
};


const ensureFirebaseAuth = () => {
  if (firebaseConfigError) {
    throw new Error(firebaseConfigError);
  }

  if (!auth) {
    throw new Error("Firebase authentication is unavailable.");
  }

  return auth;
};


const ensureRecaptchaVerifier = (containerId) => {
  const firebaseAuth = ensureFirebaseAuth();
  const container = document.getElementById(containerId);

  console.log("Firebase Auth instance:", firebaseAuth);
  console.log("Auth settings:", firebaseAuth.settings);
  console.log(
    "Auth testing flag:",
    firebaseAuth.settings?.appVerificationDisabledForTesting
  );

  if (!container) {
    throw new Error("The reCAPTCHA container is unavailable.");
  }

  if (recaptchaVerifier && recaptchaContainerId === containerId) {
    return recaptchaVerifier;
  }

  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
  }

  recaptchaVerifier = new RecaptchaVerifier(
    firebaseAuth,
    containerId,
    { size: "invisible" }
  );

  recaptchaContainerId = containerId;
  return recaptchaVerifier;
};



export const sendFirebaseOtp = async (
  mobile,
  containerId = "recaptcha-container"
) => {
  try {
    const verifier = ensureRecaptchaVerifier(containerId);
    confirmationResult = await signInWithPhoneNumber(
      ensureFirebaseAuth(),
      `+91${mobile}`,
      verifier
    );
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
    recaptchaContainerId = null;
    return confirmationResult;
  } catch (error) {

    console.error("OTP Error Code:", error.code);
  console.error("OTP Error Message:", error.message);
  console.error("Complete OTP Error:", error);

    confirmationResult = null;
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
      recaptchaContainerId = null;
    }
    throw new Error(getFirebaseErrorMessage(error));
  }
};

export const confirmFirebaseOtp = async (otp) => {
  if (!confirmationResult) {
    throw new Error("Your OTP session has expired. Request a new OTP.");
  }

  try {
    const userCredential = await confirmationResult.confirm(otp);
    return userCredential.user;
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
};

export const clearFirebasePhoneAuth = () => {
  confirmationResult = null;

  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
    recaptchaContainerId = null;
  }
};
