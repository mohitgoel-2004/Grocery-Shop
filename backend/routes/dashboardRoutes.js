const express = require("express");

const adminAuth = require("../middleware/adminMiddleware");

const {
    getDashboard,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", adminAuth, getDashboard);

module.exports = router;