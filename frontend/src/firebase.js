
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration from .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check required Firebase configuration
const requiredFirebaseConfig = [
  ["VITE_FIREBASE_API_KEY", firebaseConfig.apiKey],
  ["VITE_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
  ["VITE_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
  ["VITE_FIREBASE_APP_ID", firebaseConfig.appId],
];

const missingFirebaseConfig = requiredFirebaseConfig
  .filter(([, value]) => !value || !value.trim())
  .map(([name]) => name);

export const firebaseConfigError =
  missingFirebaseConfig.length > 0
    ? `Firebase configuration is incomplete. Missing: ${missingFirebaseConfig.join(
        ", "
      )}`
    : null;

// Initialize Firebase only when configuration is valid
const app = firebaseConfigError
  ? null
  : getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

// Export one Auth instance
export const auth = app ? getAuth(app) : null;

// Local development testing only.
// Use only with phone numbers configured in Firebase test numbers.
if (auth && import.meta.env.DEV) {
  auth.settings.appVerificationDisabledForTesting = true;
}