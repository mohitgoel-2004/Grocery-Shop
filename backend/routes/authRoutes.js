const express = require("express");

const {
	sendOtp,
	verifyOtp,
	firebaseLogin,
} = require("../controllers/authController");
const {
	sendOtpValidation,
	verifyOtpValidation,
	firebaseLoginValidation,
} = require("../validators/authValidators");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post("/send-otp", sendOtpValidation, validateRequest, sendOtp);
router.post("/verify-otp", verifyOtpValidation, validateRequest, verifyOtp);
router.post(
	"/firebase-login",
	firebaseLoginValidation,
	validateRequest,
	firebaseLogin
);

module.exports = router;
