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
  console.log("\n========== UPDATE PROFILE ==========");
  console.log("REQ BODY:", req.body);
  console.log("USER ID:", req.user._id);

  const { fullName, email, phone, address, city, pincode } = req.body;

  console.log("fullName:", fullName);
  console.log("email:", email);
  console.log("phone:", phone);

  if (fullName !== undefined) {
    req.user.fullName = fullName.trim();
  }

  if (email !== undefined) {
    req.user.email = email.trim().toLowerCase();
  }

  if (phone !== undefined) {
    req.user.mobile = phone.trim();
  }

  if (address !== undefined) {
    req.user.address = address;
  }

  if (city !== undefined) {
    req.user.city = city;
  }

  if (pincode !== undefined) {
    req.user.pincode = pincode;
  }

  console.log("BEFORE SAVE:", {
    fullName: req.user.fullName,
    email: req.user.email,
    mobile: req.user.mobile,
  });

  await req.user.save();

  console.log("AFTER SAVE:", {
    fullName: req.user.fullName,
    email: req.user.email,
    mobile: req.user.mobile,
  });

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