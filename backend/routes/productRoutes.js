const express = require("express");

const {
	listProducts,
	fetchProductById,
	listCategories,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", listProducts);
router.get("/categories", listCategories);
router.get("/:id", fetchProductById);

module.exports = router;
