const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		name: { type: String, required: true },
		image: { type: String, default: "" },
		price: { type: Number, required: true },
		quantity: { type: Number, required: true, min: 1 },
		weight: { type: String, default: "" },
	},
	{ _id: false }
);

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		items: {
			type: [orderItemSchema],
			required: true,
			default: [],
		},
		deliveryAddress: {
			type: String,
			required: true,
		},
		paymentMethod: {
			type: String,
			enum: ["cod", "upi", "card"],
			default: "cod",
		},
		subtotal: {
			type: Number,
			required: true,
		},
		deliveryCharge: {
			type: Number,
			required: true,
		},
		tax: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		status: {
    type: String,
    default: "pending",
    enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "refund"
    ]
},
		cancelledAt: {
			type: Date,
			default: null,
		},
		orderNumber: {
			type: String,
			required: true,
			unique: true,
		},
		paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending",
},

trackingNumber: {
    type: String,
    default: "",
},

adminNote: {
    type: String,
    default: "",
},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Order", orderSchema);
