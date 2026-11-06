const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const INDIAN_MOBILE_PATTERN = /^[6-9]\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PROFILE_FIELDS = ["fullName", "email", "address", "city", "pincode"];

const isProvided = (value) => value !== undefined && value !== null;

const getProfileError = (error) => {
  if (error?.code === 11000) {
    if (error.keyPattern?.email || error.keyValue?.email) {
      return new ApiError(409, "This email address is already in use");
    }

    if (error.keyPattern?.mobile || error.keyValue?.mobile) {
      return new ApiError(409, "This mobile number is already in use");
    }

    return new ApiError(409, "A profile with these details already exists");
  }

  if (error?.name === "ValidationError") {
    const messages = Object.values(error.errors || {})
      .map((validationError) => validationError.message)
      .filter(Boolean);

    return new ApiError(400, messages.join(", ") || "Invalid profile details");
  }

  return error;
};

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(
    ApiResponse.success(
      {
        user: req.user,
      },
      "Profile fetched successfully"
    )
  );
});

const updateLocation = asyncHandler(async (req, res) => {
  const { address } = req.body;

  req.user.address = address;
  await req.user.save();

  res.status(200).json(
    ApiResponse.success(
      {
        user: req.user,
      },
      "Location updated successfully"
    )
  );
});

const updateProfile = asyncHandler(async (req, res) => {
  const { phone, mobile, ...profileData } = req.body || {};
  const providedFields = PROFILE_FIELDS.filter((field) =>
    isProvided(profileData[field])
  );

  for (const field of providedFields) {
    if (typeof profileData[field] !== "string") {
      throw new ApiError(400, `${field} must be a string`);
    }
  }

  if (isProvided(profileData.fullName)) {
    req.user.fullName = profileData.fullName.trim();
  }

  if (isProvided(profileData.email)) {
    const normalizedEmail = profileData.email.trim().toLowerCase();

    if (normalizedEmail && !EMAIL_PATTERN.test(normalizedEmail)) {
      throw new ApiError(400, "Enter a valid email address");
    }

    req.user.email = normalizedEmail || undefined;
  }

  const requestedMobile = isProvided(mobile) ? mobile : phone;
  if (isProvided(requestedMobile) && requestedMobile.trim() !== "") {
    const normalizedMobile = requestedMobile.trim();

    if (!INDIAN_MOBILE_PATTERN.test(normalizedMobile)) {
      throw new ApiError(400, "Enter a valid 10-digit Indian mobile number");
    }

    req.user.mobile = normalizedMobile;
  }

  for (const field of ["address", "city", "pincode"]) {
    if (isProvided(profileData[field])) {
      req.user[field] = profileData[field].trim();
    }
  }

  try {
    await req.user.save();
  } catch (error) {
    throw getProfileError(error);
  }

  res.status(200).json(
    ApiResponse.success(
      {
        user: req.user,
      },
      "Profile updated successfully"
    )
  );
});
module.exports = {
  getProfile,
  updateLocation,
  updateProfile,
};