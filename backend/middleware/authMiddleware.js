const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      throw new ApiError(401, "Your session is invalid or expired. Please log in again.");
    }

    throw new ApiError(401, "Authentication failed. Please log in again.");
  }

  const user = await User.findById(decoded.id).select(
    "_id fullName mobile email address city pincode isVerified createdAt updatedAt"
  );

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;

  next();
});

module.exports = protect;