const asyncHandler = require("../utils/asyncHandler");
const { getDashboardSummary } = require("../services/dashboardService");

const getDashboard = asyncHandler(async (req, res) => {
    // console.log("Dashboard controller called");
    // console.log("Admin:", req.admin);

    const dashboard = await getDashboardSummary();

    // console.log("Dashboard generated successfully");

    res.status(200).json({
        success: true,
        data: dashboard,
    });
});

module.exports = {
    getDashboard,
};