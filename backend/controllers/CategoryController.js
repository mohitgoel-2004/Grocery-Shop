const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");

// GET
exports.listCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json(
        ApiResponse.success(
            { categories },
            "Categories fetched successfully"
        )
    );
});

// CREATE
exports.createCategory = asyncHandler(async (req, res) => {

    const category = await Category.create(req.body);

    res.status(201).json(
        ApiResponse.success(
            { category },
            "Category created successfully"
        )
    );
});

// UPDATE
exports.updateCategory = asyncHandler(async (req, res) => {

    const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
        returnDocument: "after",
        runValidators: true,
    }
);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    res.status(200).json(
        ApiResponse.success(
            { category },
            "Category updated successfully"
        )
    );
});

// DELETE
exports.deleteCategory = asyncHandler(async (req, res) => {

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    res.status(200).json(
        ApiResponse.success(
            {},
            "Category deleted successfully"
        )
    );
});