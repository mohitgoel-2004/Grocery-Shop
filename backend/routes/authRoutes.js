const express = require("express");

const {
	sendOtp,
	verifyOtp,
	sendEmailOtp,
	verifyEmailOtp,
	firebaseLogin,
} = require("../controllers/authController");
const {
	sendOtpValidation,
	verifyOtpValidation,
	sendEmailOtpValidation,
	verifyEmailOtpValidation,
	firebaseLoginValidation,
} = require("../validators/authValidators");
const validateRequest = require("../middleware/validateRequest");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const rateLimitWindowMs =
	Number(process.env.EMAIL_OTP_RATE_LIMIT_WINDOW_MINUTES || 15) * 60 * 1000;
const emailOtpSendLimiter = rateLimit({
	windowMs: rateLimitWindowMs,
	max: Number(process.env.EMAIL_OTP_SEND_RATE_LIMIT || 5),
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: {
		success: false,
		message: "Too many OTP requests. Please try again later.",
	},
});
const emailOtpVerifyLimiter = rateLimit({
	windowMs: rateLimitWindowMs,
	max: Number(process.env.EMAIL_OTP_VERIFY_RATE_LIMIT || 10),
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: {
		success: false,
		message: "Too many OTP verification attempts. Please try again later.",
	},
});

router.post("/send-otp", sendOtpValidation, validateRequest, sendOtp);
router.post("/verify-otp", verifyOtpValidation, validateRequest, verifyOtp);
router.post(
	"/send-email-otp",
	emailOtpSendLimiter,
	sendEmailOtpValidation,
	validateRequest,
	sendEmailOtp
);
router.post(
	"/email/send-otp",
	emailOtpSendLimiter,
	sendEmailOtpValidation,
	validateRequest,
	sendEmailOtp
);
router.post(
	"/verify-email-otp",
	emailOtpVerifyLimiter,
	verifyEmailOtpValidation,
	validateRequest,
	verifyEmailOtp
);
router.post(
	"/email/verify-otp",
	emailOtpVerifyLimiter,
	verifyEmailOtpValidation,
	validateRequest,
	verifyEmailOtp
);
router.post(
	"/firebase-login",
	firebaseLoginValidation,
	validateRequest,
	firebaseLogin
);

module.exports = router;
