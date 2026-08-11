const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // Customer notification ke liye user required hai
    // Admin notification ke liye null ho sakta hai
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    recipientType: {
      type: String,
      enum: ["customer", "admin"],
      required: true,
      default: "customer",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "order",
        "delivery",
        "payment",
        "offer",
        "account",
        "system",
      ],
      default: "system",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    data: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);