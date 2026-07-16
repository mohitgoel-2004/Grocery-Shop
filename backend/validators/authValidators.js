const { body } = require("express-validator");

const mobileValidator = body("mobile")
  .trim()
  .notEmpty()
  .withMessage("Mobile number is required")
  .matches(/^[6-9]\d{9}$/)
  .withMessage("Enter a valid 10-digit Indian mobile number");

const otpValidator = body("otp")
  .trim()
  .notEmpty()
  .withMessage("OTP is required")
  .isLength({ min: 6, max: 6 })
  .withMessage("OTP must be exactly 6 digits")
  .matches(/^\d{6}$/)
  .withMessage("OTP must contain only numbers");

const sendOtpValidation = [mobileValidator];
const verifyOtpValidation = [mobileValidator, otpValidator];

module.exports = {
  sendOtpValidation,
  verifyOtpValidation,
};