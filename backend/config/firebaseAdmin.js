const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const requiredServiceAccountFields = [
	"project_id",
	"client_email",
	"private_key",
];

const getServiceAccount = () => {
	const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

	if (!rawServiceAccount) {
		const error = new Error(
			"Firebase authentication is not configured on the server"
		);
		error.code = "FIREBASE_CONFIG_MISSING";
		throw error;
	}

	let serviceAccount;

	try {
		serviceAccount = JSON.parse(rawServiceAccount);
	} catch {
		const error = new Error("Firebase authentication configuration is invalid");
		error.code = "FIREBASE_CONFIG_INVALID";
		throw error;
	}

	const hasRequiredFields = requiredServiceAccountFields.every(
		(field) =>
			serviceAccount &&
			typeof serviceAccount === "object" &&
			typeof serviceAccount[field] === "string" &&
			serviceAccount[field].trim().length > 0
	);

	if (!hasRequiredFields) {
		const error = new Error("Firebase authentication configuration is invalid");
		error.code = "FIREBASE_CONFIG_INVALID";
		throw error;
	}

	return {
		...serviceAccount,
		private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
	};
};

const getFirebaseAuth = () => {
	if (getApps().length === 0) {
		initializeApp({
			credential: cert(getServiceAccount()),
		});
	}

	return getAuth();
};

module.exports = getFirebaseAuth;
