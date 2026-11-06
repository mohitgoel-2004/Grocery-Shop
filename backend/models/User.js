const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    mobile: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, "Enter valid mobile"],
    },

    fullName: {
        type: String,
        default: "",
        trim: true,
    },

    email: {
        type: String,
        default: undefined,
        lowercase: true,
        trim: true,
    },

    address: {
        type: String,
        default: "",
    },

    city: {
        type: String,
        default: "",
    },

    pincode: {
        type: String,
        default: "",
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    // ===========================
    // ADMIN CUSTOMER
    // ===========================
role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
},
  status: {
  type: String,
  enum: ["active", "blocked"],
  default: "active",
},

isPremium: {
  type: Boolean,
  default: false,
},

deleted: {
  type: Boolean,
  default: false,
},
    notes: [
        {
            text: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
},
{
    timestamps: true,
});

userSchema.index(
    { email: 1 },
    {
        unique: true,
        partialFilterExpression: { email: { $gt: "" } },
    }
);

module.exports = mongoose.model("User", userSchema);