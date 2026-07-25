const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  console.log("\n========== AUTH MIDDLEWARE ==========");

  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Authorization Header:", req.headers.authorization);
  console.log("Cookies:", req.cookies);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  const authHeader = req.headers.authorization || "";

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies?.accessToken;

  console.log("Extracted Token:", token);

  if (!token) {
    console.log("❌ No token found");
    throw new ApiError(401, "Authentication required");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ JWT Verified");
    console.log("Decoded Token:", decoded);
  } catch (err) {
    console.log("❌ JWT Verify Error:", err.message);
    throw new ApiError(401, err.message);
  }

  const user = await User.findById(decoded.id).select(
    "_id fullName mobile email address city pincode isVerified createdAt updatedAt"
  );

  console.log("User Found:", user);

  if (!user) {
    console.log("❌ User not found in database");
    throw new ApiError(401, "User not found");
  }

  req.user = user;

  console.log("✅ Authentication Success");
  console.log("=====================================\n");

  next();
});

module.exports = protect;