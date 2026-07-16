const { validationResult } = require("express-validator");

const ApiError = require("../utils/apiError");

const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    throw new ApiError(400, "Validation failed", result.array());
  }

  next();
};

module.exports = validateRequest;