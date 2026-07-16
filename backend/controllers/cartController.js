const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const {
	getCart,
	addToCart,
	updateCartItem,
	removeCartItem,
	clearCart,
} = require("../services/cartService");

const fetchCart = asyncHandler(async (req, res) => {
	const cart = await getCart(req.user._id);

	res.status(200).json(ApiResponse.success({ cart }, "Cart fetched successfully"));
});

const addItemToCart = asyncHandler(async (req, res) => {
	const { productId, quantity = 1 } = req.body;

	if (!productId) {
		throw new ApiError(400, "productId is required");
	}

	const cart = await addToCart(req.user._id, productId, Number(quantity));

	res.status(200).json(ApiResponse.success({ cart }, "Item added to cart"));
});

const updateItemInCart = asyncHandler(async (req, res) => {
	const { productId, quantity } = req.body;

	if (!productId || quantity === undefined) {
		throw new ApiError(400, "productId and quantity are required");
	}

	const cart = await updateCartItem(
		req.user._id,
		productId,
		Number(quantity)
	);

	res.status(200).json(ApiResponse.success({ cart }, "Cart updated successfully"));
});

const removeItemFromCart = asyncHandler(async (req, res) => {
	const productId = req.body.productId || req.query.productId;

	if (!productId) {
		throw new ApiError(400, "productId is required");
	}

	const cart = await removeCartItem(req.user._id, productId);

	res.status(200).json(ApiResponse.success({ cart }, "Item removed from cart"));
});

const clearUserCart = asyncHandler(async (req, res) => {
	const cart = await clearCart(req.user._id);

	res.status(200).json(ApiResponse.success({ cart }, "Cart cleared successfully"));
});

module.exports = {
	fetchCart,
	addItemToCart,
	updateItemInCart,
	removeItemFromCart,
	clearUserCart,
};
