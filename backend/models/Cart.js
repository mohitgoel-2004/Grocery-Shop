const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		name: { type: String, required: true },
		image: { type: String, default: "" },
		price: { type: Number, required: true },
		quantity: { type: Number, required: true, min: 1, default: 1 },
		weight: { type: String, default: "0" },
	},
	{ _id: false }
);

const cartSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			unique: true,
			required: true,
		},
		items: {
			type: [cartItemSchema],
			default: [],
		},
		subtotal: {
			type: Number,
			default: 0,
		},
		total: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Cart", cartSchema);
