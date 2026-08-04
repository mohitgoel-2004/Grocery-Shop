const mongoose = require("mongoose");

const deliverySettingsSchema = new mongoose.Schema(
    {
        deliveryCharge: {
            type: Number,
            required: true,
            min: 0,
            default: 30,
        },

        freeDeliveryThreshold: {
            type: Number,
            required: true,
            min: 0,
            default: 499,
        },

        minimumOrderValue: {
            type: Number,
            required: true,
            min: 0,
            default: 99,
        },

        isDeliveryChargeEnabled: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "DeliverySettings",
    deliverySettingsSchema
);