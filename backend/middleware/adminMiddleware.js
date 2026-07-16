const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

const adminAuth = asyncHandler(async (req, res, next) => {
  // console.log("======= ADMIN MIDDLEWARE =======");
  // console.log("URL:", req.originalUrl);
  // console.log("Authorization Header:", req.headers.authorization);
  // console.log("All Headers:", req.headers);

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // console.log("Extracted Token:", token);

  if (!token) {
    throw new ApiError(401, "Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("Decoded Token:", decoded);

    const admin = await Admin.findById(
      decoded.id || decoded._id
    ).select("-password");

    // console.log("Admin:", admin);

    if (!admin) {
      throw new ApiError(401, "Admin not found.");
    }

    if (!admin.isActive) {
      throw new ApiError(403, "Admin account has been disabled.");
    }

    if (!["admin", "superadmin"].includes(admin.role)) {
      throw new ApiError(403, "Unauthorized.");
    }

    req.admin = admin;

    return next();
  } catch (err) {
    console.error("JWT Error:", err);

    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired.");
    }

    if (err.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token.");
    }

    throw err;
  }
});

module.exports = adminAuth;