const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const OTP = require("../models/OTP");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const generateToken = require("../utils/generateToken");
const otpService = require("../services/otpService");

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 5);

const createSixDigitOtp = () =>
	String(crypto.randomInt(100000, 1000000));

const ensureUser = async (mobile) => {
	let user = await User.findOne({ mobile });

	if (!user) {
		user = await User.create({ mobile });
	}

	return user;
};

const sendOtp = asyncHandler(async (req, res) => {
	const { mobile } = req.body;

	const user = await ensureUser(mobile);
	const otp = createSixDigitOtp();
	const hashedOtp = await bcrypt.hash(otp, 10);
	const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

	await OTP.deleteMany({ mobile });
	await OTP.create({
		mobile,
		otp: hashedOtp,
		expiresAt,
	});

	await otpService.sendOtp({ mobile, otp });

	const payload = {
		mobile,
		userId: user._id,
		expiresAt,
	};

	if (process.env.NODE_ENV !== "production") {
		payload.otp = otp;
	}

	res.status(200).json(
		ApiResponse.success(payload, "OTP sent successfully")
	);
});

const verifyOtp = asyncHandler(async (req, res) => {
	const { mobile, otp } = req.body;
	const otpRecord = await OTP.findOne({ mobile });

	if (!otpRecord) {
		throw new ApiError(404, "OTP not found or already used");
	}

	if (otpRecord.expiresAt.getTime() < Date.now()) {
		await OTP.deleteOne({ _id: otpRecord._id });
		throw new ApiError(400, "OTP has expired");
	}

	const isOtpValid = await bcrypt.compare(otp, otpRecord.otp);

	if (!isOtpValid) {
		throw new ApiError(400, "Invalid OTP");
	}

	await OTP.deleteOne({ _id: otpRecord._id });

	const user = await User.findOneAndUpdate(
		{ mobile },
		{ $set: { isVerified: true } },
		{ upsert: true, runValidators: true, returnDocument: "after" }
	).select("mobile address isVerified createdAt updatedAt");

	const accessToken = generateToken(user);

	res.status(200).json(
		ApiResponse.success(
			{
				accessToken,
				tokenType: "Bearer",
				user,
			},
			"OTP verified successfully"
		)
	);
});

module.exports = {
	sendOtp,
	verifyOtp,
};
