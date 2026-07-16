const { body } = require("express-validator");

const locationValidation = [
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 250 })
    .withMessage("Address must be between 5 and 250 characters"),
];

module.exports = {
  locationValidation,
};