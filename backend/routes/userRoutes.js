const express = require("express");

const protect = require("../middleware/authMiddleware");
const {
  getProfile,
  updateLocation,
  updateProfile,
} = require("../controllers/userController");
const { locationValidation } = require("../validators/userValidators");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put(
  "/location",
  protect,
  locationValidation,
  validateRequest,
  updateLocation
);

module.exports = router;