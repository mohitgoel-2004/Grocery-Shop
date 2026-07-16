const Category = require("../models/Category");
const Product = require("../models/Product");

const getProducts = async (filters = {}) => {
  const query = { isActive: true };

  if (filters.category) {
    const category = await Category.findOne({
      $or: [{ slug: filters.category }, { name: filters.category }],
    });

    if (category) {
      query.category = category._id;
    }
  }

  return Product.find(query).populate("category", "name slug icon image sortOrder");
};

const getProductById = async (id) => {
  return Product.findById(id).populate("category", "name slug icon image sortOrder");
};

const getCategories = async () => {
  return Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};

module.exports = {
  getProducts,
  getProductById,
  getCategories,
};