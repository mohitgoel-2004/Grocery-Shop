const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const Product = require("../models/Product");
const Category = require("../models/Category");
const XLSX = require("xlsx");

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

  if (Array.isArray(body.images)) {
    body.image = body.images.length > 0 ? body.images[0] : "";
  }

  if (body.status) {
    body.isActive = body.status === "active";
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    body,
    {
      new: true,
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
  query.$or = [
    {
      name: {
        $regex: search,
        $options: "i",
      },
    },
    {
      sku: {
        $regex: search,
        $options: "i",
      },
    },
  ];
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

// ======================================================
// ADMIN - BULK IMPORT PRODUCTS FROM EXCEL / CSV
// ======================================================

// ======================================================
// ADMIN - BULK IMPORT PRODUCTS FROM EXCEL / CSV
// ======================================================

const bulkImportProducts = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(
      400,
      "Please upload an Excel (.xlsx/.xls) or CSV file"
    );
  }

  try {
    // ------------------------------------------
    // Read uploaded Excel / CSV file
    // ------------------------------------------

    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
    });

    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      throw new ApiError(
        400,
        "Excel/CSV file does not contain any sheet"
      );
    }

    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
      raw: false,
    });

    if (!rows.length) {
      throw new ApiError(
        400,
        "Excel/CSV file is empty"
      );
    }

    // ------------------------------------------
    // Helper functions
    // ------------------------------------------

    const normalizeNumber = (value, defaultValue = 0) => {
      if (
        value === "" ||
        value === null ||
        value === undefined
      ) {
        return defaultValue;
      }

      const number = Number(value);

      return Number.isFinite(number) ? number : NaN;
    };

    const normalizeBoolean = (
      value,
      defaultValue = false
    ) => {
      if (
        value === "" ||
        value === null ||
        value === undefined
      ) {
        return defaultValue;
      }

      if (typeof value === "boolean") {
        return value;
      }

      const normalized = String(value)
        .trim()
        .toLowerCase();

      return [
        "true",
        "1",
        "yes",
        "y",
      ].includes(normalized);
    };

    const allowedUnits = [
      "kg",
      "g",
      "gm",
      "L",
      "mL",
      "pcs",
      "pack",
      "box",
    ];

    const allowedStatuses = [
      "active",
      "inactive",
      "draft",
    ];

    // ------------------------------------------
    // Get all categories
    // ------------------------------------------

    const categories = await Category.find({})
      .select("_id name")
      .lean();

    const categoryMap = new Map();

    categories.forEach((category) => {
      categoryMap.set(
        String(category.name)
          .trim()
          .toLowerCase(),
        category._id
      );
    });

    // ------------------------------------------
    // Get existing SKU + slug
    // ------------------------------------------

    const existingProducts = await Product.find({})
      .select("sku slug")
      .lean();

    const existingSkus = new Set();
    const existingSlugs = new Set();

    existingProducts.forEach((product) => {
      if (product.sku) {
        existingSkus.add(
          String(product.sku)
            .trim()
            .toLowerCase()
        );
      }

      if (product.slug) {
        existingSlugs.add(
          String(product.slug)
            .trim()
            .toLowerCase()
        );
      }
    });

    // ------------------------------------------
    // Import tracking
    // ------------------------------------------

    const validProducts = [];
    const errors = [];

    const importedSkus = new Set();
    const importedSlugs = new Set();

    // ------------------------------------------
    // Process every Excel / CSV row
    // ------------------------------------------

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      // Excel header = row 1
      // First product = row 2
      const rowNumber = index + 2;

      const name = String(row.name || "").trim();

      const categoryName = String(
        row.category || ""
      ).trim();

      const brand = String(
        row.brand || ""
      ).trim();

      const description = String(
        row.description || ""
      ).trim();

      const sku = String(
        row.sku || ""
      ).trim();

      // ----------------------------------------
      // Name validation
      // ----------------------------------------

      if (!name) {
        errors.push({
          row: rowNumber,
          field: "name",
          message: "Product name is required",
        });

        continue;
      }

      // ----------------------------------------
      // Category validation
      // ----------------------------------------

      if (!categoryName) {
        errors.push({
          row: rowNumber,
          field: "category",
          message: "Category is required",
        });

        continue;
      }

    let categoryId = categoryMap.get(
  categoryName.toLowerCase()
);

if (!categoryId) {
  const newCategory = await Category.create({
    name: categoryName,
    slug: slugify(categoryName),
    status: "active",
  });

  categoryId = newCategory._id;

  categoryMap.set(
    categoryName.toLowerCase(),
    categoryId
  );
}
      // ----------------------------------------
      // Price
      // ----------------------------------------

      const price = normalizeNumber(row.price);

      if (!Number.isFinite(price)) {
        errors.push({
          row: rowNumber,
          field: "price",
          message: "Valid price is required",
        });

        continue;
      }

      if (price < 0) {
        errors.push({
          row: rowNumber,
          field: "price",
          message: "Price cannot be negative",
        });

        continue;
      }

      // ----------------------------------------
      // Discount
      // ----------------------------------------

      const discount = normalizeNumber(
        row.discount,
        0
      );

      if (!Number.isFinite(discount)) {
        errors.push({
          row: rowNumber,
          field: "discount",
          message: "Invalid discount",
        });

        continue;
      }

      if (discount < 0 || discount > 100) {
        errors.push({
          row: rowNumber,
          field: "discount",
          message:
            "Discount must be between 0 and 100",
        });

        continue;
      }

      // ----------------------------------------
      // Inventory
      // ----------------------------------------

      const stock = normalizeNumber(
        row.stock,
        0
      );

      const reservedStock = normalizeNumber(
        row.reservedStock,
        0
      );

      const damagedStock = normalizeNumber(
        row.damagedStock,
        0
      );

      const expiredStock = normalizeNumber(
        row.expiredStock,
        0
      );

      const lowStockThreshold = normalizeNumber(
        row.lowStockThreshold,
        10
      );

      if (
        !Number.isFinite(stock) ||
        stock < 0
      ) {
        errors.push({
          row: rowNumber,
          field: "stock",
          message: "Invalid stock",
        });

        continue;
      }

      if (
        !Number.isFinite(reservedStock) ||
        reservedStock < 0
      ) {
        errors.push({
          row: rowNumber,
          field: "reservedStock",
          message: "Invalid reserved stock",
        });

        continue;
      }

      if (
        !Number.isFinite(damagedStock) ||
        damagedStock < 0
      ) {
        errors.push({
          row: rowNumber,
          field: "damagedStock",
          message: "Invalid damaged stock",
        });

        continue;
      }

      if (
        !Number.isFinite(expiredStock) ||
        expiredStock < 0
      ) {
        errors.push({
          row: rowNumber,
          field: "expiredStock",
          message: "Invalid expired stock",
        });

        continue;
      }

      if (
        !Number.isFinite(lowStockThreshold) ||
        lowStockThreshold < 0
      ) {
        errors.push({
          row: rowNumber,
          field: "lowStockThreshold",
          message: "Invalid low stock threshold",
        });

        continue;
      }

      // ----------------------------------------
      // Unit
      // ----------------------------------------

      const unit = String(
        row.unit || "pcs"
      ).trim();

      if (!allowedUnits.includes(unit)) {
        errors.push({
          row: rowNumber,
          field: "unit",
          message:
            `Invalid unit "${unit}". Allowed values: ${allowedUnits.join(
              ", "
            )}`,
        });

        continue;
      }

      // ----------------------------------------
      // Status
      // ----------------------------------------

      const status = String(
        row.status || "active"
      )
        .trim()
        .toLowerCase();

      if (!allowedStatuses.includes(status)) {
        errors.push({
          row: rowNumber,
          field: "status",
          message:
            `Invalid status "${status}"`,
        });

        continue;
      }

      // ----------------------------------------
      // SKU validation
      // ----------------------------------------

      const normalizedSku = sku
        ? sku.toLowerCase()
        : "";

      if (normalizedSku) {
        if (existingSkus.has(normalizedSku)) {
          errors.push({
            row: rowNumber,
            field: "sku",
            message:
              `SKU "${sku}" already exists in database`,
          });

          continue;
        }

        if (importedSkus.has(normalizedSku)) {
          errors.push({
            row: rowNumber,
            field: "sku",
            message:
              `Duplicate SKU "${sku}" in uploaded file`,
          });

          continue;
        }
      }

      // ----------------------------------------
      // Generate unique slug
      // ----------------------------------------

      let slug = slugify(name);

      if (!slug) {
        errors.push({
          row: rowNumber,
          field: "name",
          message:
            "Unable to generate product slug",
        });

        continue;
      }

      const originalSlug = slug;
      let counter = 1;

      while (
        existingSlugs.has(slug) ||
        importedSlugs.has(slug)
      ) {
        slug = `${originalSlug}-${counter}`;
        counter++;
      }

      // ----------------------------------------
      // Images
      // ----------------------------------------

      let images = [];

      if (row.images) {
        images = String(row.images)
          .split(",")
          .map((image) => image.trim())
          .filter(Boolean);
      }

      const image = String(
        row.image ||
        images[0] ||
        ""
      ).trim();

      // ----------------------------------------
      // Product data
      // ----------------------------------------

      const productData = {
        name,
        slug,
        description,
        category: categoryId,
        brand,

        price,
        discount,

        stock,
        reservedStock,
        damagedStock,
        expiredStock,
        lowStockThreshold,

        weight: normalizeNumber(
          row.weight,
          0
        ),

        unit,

        images,
        image,

        badge: String(
          row.badge || ""
        ).trim(),

        rating: normalizeNumber(
          row.rating,
          0
        ),

        totalReviews: normalizeNumber(
          row.totalReviews,
          0
        ),

        status,

        // status ke according isActive
        isActive: status === "active",

        isFeatured: normalizeBoolean(
          row.isFeatured,
          false
        ),

        metaTitle: String(
          row.metaTitle || ""
        ).trim(),

        metaDescription: String(
          row.metaDescription || ""
        ).trim(),
      };

      // SKU only when provided
      if (sku) {
        productData.sku = sku;
      }

      validProducts.push(productData);

      if (normalizedSku) {
        importedSkus.add(normalizedSku);
      }

      importedSlugs.add(slug);
    }

    // ------------------------------------------
    // No valid products
    // ------------------------------------------

    if (!validProducts.length) {
      return res.status(400).json(
        ApiResponse.success(
          {
            totalRows: rows.length,
            validRows: 0,
            insertedRows: 0,
            invalidRows: errors.length,
            errors,
          },
          "No valid products found"
        )
      );
    }

    // ------------------------------------------
    // Insert valid products
    // ------------------------------------------

    const insertedProducts =
      await Product.insertMany(
        validProducts,
        {
          ordered: false,
        }
      );

    // ------------------------------------------
    // Response
    // ------------------------------------------

    return res.status(201).json(
      ApiResponse.success(
        {
          totalRows: rows.length,

          validRows: validProducts.length,

          insertedRows: insertedProducts.length,

          invalidRows: errors.length,

          errors,

          products: insertedProducts,
        },
        "Products imported successfully"
      )
    );
  } catch (error) {
    console.error(
      "BULK PRODUCT IMPORT ERROR:",
      error
    );

    throw error;
  }
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

  bulkImportProducts,
};