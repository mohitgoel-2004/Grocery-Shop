const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const Product = require("../models/Product");
const Category = require("../models/Category");

const {
  getProducts,
  getProductById,
  getCategories,
} = require("../services/productService");

// ======================
// Helper
// ======================

const slugify = (text = "") =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

// ======================
// Customer APIs
// ======================

const listProducts = asyncHandler(async (req, res) => {
  const products = await getProducts(req.query);

  res.status(200).json(
    ApiResponse.success(
      { products },
      "Products fetched successfully"
    )
  );
});

const fetchProductById = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(
    ApiResponse.success(
      { product },
      "Product fetched successfully"
    )
  );
});

const listCategories = asyncHandler(async (req, res) => {
  const categories = await getCategories();

  res.status(200).json(
    ApiResponse.success(
      { categories },
      "Categories fetched successfully"
    )
  );
});

// ======================
// Admin APIs
// ======================

const createProduct = asyncHandler(async (req, res) => {
  try {
    console.log("Incoming Product:", req.body);

    const {
      name,
      category,
      brand,
      description,
      price,
      discount,
      stock,
      sku,
      weight,
      unit,
      images,
      status,
    } = req.body;

    if (!name) {
      throw new ApiError(400, "Product name is required");
    }

    if (!category) {
      throw new ApiError(400, "Category is required");
    }

    if (price === undefined || price === null) {
      throw new ApiError(400, "Price is required");
    }

    const slug = slugify(name);

    const existing = await Product.findOne({ slug });

    if (existing) {
      throw new ApiError(400, "Product already exists");
    }

   const productData = {
  name,
  slug,
  category,
  brand,
  description,
  price,
  discount: discount || 0,
  stock: stock || 0,
  weight: weight || 0,
  unit: unit || "pcs",
  images: images || [],
  status: status || "active",
  image: images?.length ? images[0] : "",
};

// SKU sirf tab add karo jab value ho
if (sku && sku.trim() !== "") {
  productData.sku = sku.trim();
}

const product = await Product.create(productData);

    res.status(201).json(
      ApiResponse.success(
        { product },
        "Product created successfully"
      )
    );
  } catch (error) {
    console.error("CREATE PRODUCT ERROR");
    console.error(error);

    throw error;
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const body = { ...req.body };

  if (body.name) {
    body.slug = slugify(body.name);
  }

  if (Array.isArray(body.images) && body.images.length > 0) {
    body.image = body.images[0];
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    body,
    {
      returnDocument: "after",
      runValidators: true,
    }
  ).populate("category");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(
    ApiResponse.success(
      { product },
      "Product updated successfully"
    )
  );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(
    ApiResponse.success(
      {},
      "Product deleted successfully"
    )
  );
});

const toggleProductStatus = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.status =
    product.status === "active"
      ? "inactive"
      : "active";

  product.isActive = product.status === "active";

  await product.save();

  res.status(200).json(
    ApiResponse.success(
      { product },
      "Status updated successfully"
    )
  );
});

const getAdminProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    category,
    status,
  } = req.query;

  const query = {};

  if (search) {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    query.category = category;
  }

  if (status) {
    query.status = status;
  }

  const products = await Product.find(query)
    .populate("category")
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Product.countDocuments(query);

  res.status(200).json(
    ApiResponse.success({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    })
  );
});

const getAdminProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(
    ApiResponse.success(
      { product },
      "Product fetched successfully"
    )
  );
});
const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, image, description, status } = req.body;

  const category = await Category.create({
    name,
    slug: slugify(name),
    icon,
    image,
    description,
    status,
  });

  res.status(201).json(
    ApiResponse.success(
      { category },
      "Category created successfully"
    )
  );
});
const updateCategory = asyncHandler(async (req, res) => {
  const body = { ...req.body };

  if (body.name) {
    body.slug = slugify(body.name);
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    body,
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
const deleteCategory = asyncHandler(async (req, res) => {

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

module.exports = {
  listProducts,
  fetchProductById,
  listCategories,

  createCategory,
  updateCategory,
  deleteCategory,

  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  getAdminProducts,
  getAdminProductById,
};