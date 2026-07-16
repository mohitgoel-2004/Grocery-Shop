const Cart = require("../models/Cart");
const Product = require("../models/Product");

const calculateCartTotals = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;

  return { subtotal, total };
};
const getProductId = (product) => {
  if (!product) return "";

  if (typeof product === "object") {
    return String(product._id);
  }

  return String(product);
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate(
    "items.product",
    "name slug image price weight"
  );

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate(
      "items.product",
      "name slug image price weight"
    );
  }

  return cart;
};

const syncCartTotals = async (cart) => {
  const { subtotal, total } = calculateCartTotals(cart.items);
  cart.subtotal = subtotal;
  cart.total = total;
  await cart.save();

  return cart.populate("items.product", "name slug image price weight");
};

const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return syncCartTotals(cart);
};

const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const cart = await getOrCreateCart(userId);
const existingItem = cart.items.find(
  (item) => getProductId(item.product) === String(productId)
);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      weight: product.weight,
    });
  }

  return syncCartTotals(cart);
};

const updateCartItem = async (userId, productId, quantity) => {
  const cart = await getOrCreateCart(userId);
 const item = cart.items.find(
  (cartItem) => getProductId(cartItem.product) === String(productId)
);

  if (!item) {
    throw new Error("Cart item not found");
  }

  if (quantity <= 0) {
   cart.items = cart.items.filter(
  (cartItem) => getProductId(cartItem.product) !== String(productId)
);
  } else {
    item.quantity = quantity;
  }

  return syncCartTotals(cart);
};

const removeCartItem = async (userId, productId) => {
  const cart = await getOrCreateCart(userId);
 cart.items = cart.items.filter(
  (cartItem) => getProductId(cartItem.product) !== String(productId)
);

  return syncCartTotals(cart);
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  cart.subtotal = 0;
  cart.total = 0;
  await cart.save();
  return cart;
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};