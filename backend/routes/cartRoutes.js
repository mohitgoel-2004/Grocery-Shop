const express = require("express");

const protect = require("../middleware/authMiddleware");
const {
	fetchCart,
	addItemToCart,
	updateItemInCart,
	removeItemFromCart,
	clearUserCart,
} = require("../controllers/cartController");

const router = express.Router();

router.use(protect);

router.get("/", fetchCart);
router.post("/add", addItemToCart);
router.put("/update", updateItemInCart);
router.delete("/remove", removeItemFromCart);
router.delete("/clear", clearUserCart);

module.exports = router;
