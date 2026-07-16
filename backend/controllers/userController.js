const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");

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
  const { fullName, email, phone, address, city, pincode } = req.body;

  if (fullName !== undefined) req.user.fullName = fullName;
  if (email !== undefined) req.user.email = email;
  if (phone !== undefined) req.user.mobile = phone;
  if (address !== undefined) req.user.address = address;
  if (city !== undefined) req.user.city = city;
  if (pincode !== undefined) req.user.pincode = pincode;

  await req.user.save();

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