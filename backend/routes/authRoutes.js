const express = require("express");

const {
	sendOtp,
	verifyOtp,
} = require("../controllers/authController");
const {
	sendOtpValidation,
	verifyOtpValidation,
} = require("../validators/authValidators");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post("/send-otp", sendOtpValidation, validateRequest, sendOtp);
router.post("/verify-otp", verifyOtpValidation, validateRequest, verifyOtp);

module.exports = router;
