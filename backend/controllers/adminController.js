const Admin = require("../models/Admin");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const generateToken = require("../utils/generateToken");

/**
 * @desc    Admin Login
 * @route   POST /api/admin/login
 * @access  Public
 */
const loginAdmin = asyncHandler(async (req, res) => {
  // console.log("BODY:", req.body);

  const { email, password } = req.body;

  const admin = await Admin.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  // console.log("ADMIN FOUND:", admin);

  if (!admin) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await admin.matchPassword(password);

  // console.log("PASSWORD MATCH:", isMatch);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Update Last Login
  admin.lastLogin = new Date();
  await admin.save();

  // JWT Token
  const accessToken = generateToken({
    _id: admin._id,
    role: admin.role,
  });

  res.status(200).json(
    ApiResponse.success(
      {
        accessToken,
        tokenType: "Bearer",

        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          avatar: admin.avatar,
          lastLogin: admin.lastLogin,
        },
      },
      "Admin login successful"
    )
  );
});

/**
 * @desc    Get Admin Profile
 * @route   GET /api/admin/profile
 * @access  Private
 */
const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select("-password");

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

 res.status(200).json(
    ApiResponse.success(
      admin,
        "Profile fetched successfully"
    )
);
});

/**
 * @desc    Admin Logout
 * @route   POST /api/admin/logout
 * @access  Private
 */
const logoutAdmin = asyncHandler(async (req, res) => {
  res.status(200).json(
    ApiResponse.success(
      {},
      "Logout successful"
    )
  );
});

module.exports = {
  loginAdmin,
  getAdminProfile,
  logoutAdmin,
};