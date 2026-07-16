const mongoose = require("mongoose");

const connectDB = async () => {
	const mongoUri =
		process.env.MONGODB_URI ||
		"mongodb://127.0.0.1:27017/grocery_delivery";

	if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
		throw new Error("MONGODB_URI is required in production");
	}

	mongoose.set("strictQuery", true);

	await mongoose.connect(mongoUri, {
		dbName: process.env.MONGODB_NAME || undefined,
	});

	console.log(`MongoDB connected: ${mongoose.connection.host}`);
};

module.exports = connectDB;
