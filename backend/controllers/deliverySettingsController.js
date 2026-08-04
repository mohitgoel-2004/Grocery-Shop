const DeliverySettings = require("../models/DeliverySettings");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");

// Get delivery settings
const getDeliverySettings = asyncHandler(async (req, res) => {
    let settings = await DeliverySettings.findOne();

    // Create default settings if none exists
    if (!settings) {
        settings = await DeliverySettings.create({
            deliveryCharge: 30,
            freeDeliveryThreshold: 499,
            minimumOrderValue: 99,
            isDeliveryChargeEnabled: true,
        });
    }

    res.status(200).json(
        ApiResponse.success(
            { settings },
            "Delivery settings fetched successfully"
        )
    );
});

// Update delivery settings
const updateDeliverySettings = asyncHandler(async (req, res) => {
    const {
        deliveryCharge,
        freeDeliveryThreshold,
        minimumOrderValue,
        isDeliveryChargeEnabled,
    } = req.body;

    if (
        deliveryCharge === undefined ||
        freeDeliveryThreshold === undefined ||
        minimumOrderValue === undefined
    ) {
        throw new ApiError(
            400,
            "All delivery settings are required"
        );
    }

    if (
        deliveryCharge < 0 ||
        freeDeliveryThreshold < 0 ||
        minimumOrderValue < 0
    ) {
        throw new ApiError(
            400,
            "Values cannot be negative"
        );
    }

    let settings = await DeliverySettings.findOne();

    if (!settings) {
        settings = await DeliverySettings.create({
            deliveryCharge,
            freeDeliveryThreshold,
            minimumOrderValue,
            isDeliveryChargeEnabled:
                isDeliveryChargeEnabled ?? true,
        });
    } else {
        settings.deliveryCharge = deliveryCharge;
        settings.freeDeliveryThreshold =
            freeDeliveryThreshold;
        settings.minimumOrderValue =
            minimumOrderValue;

        settings.isDeliveryChargeEnabled =
            isDeliveryChargeEnabled ?? true;

        await settings.save();
    }

    res.status(200).json(
        ApiResponse.success(
            { settings },
            "Delivery settings updated successfully"
        )
    );
});

module.exports = {
    getDeliverySettings,
    updateDeliverySettings,
};