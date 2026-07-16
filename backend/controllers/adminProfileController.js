const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

// ===============================
// GET PROFILE
// ===============================
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// UPDATE PROFILE
// ===============================
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.mobile = mobile || admin.mobile;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin,
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);

    if (res.headersSent) return;

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// CHANGE PASSWORD
// ===============================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin._id).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    admin.password = newPassword;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// UPLOAD PROFILE IMAGE
// ===============================
exports.uploadProfileImage = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    admin.avatar = `/uploads/admin/${req.file.filename}`;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Profile image updated",
      avatar: admin.avatar,
    });
  } catch (err) {
    console.error("UPLOAD IMAGE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};