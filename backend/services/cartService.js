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
    const id = product._id || product.id;

    return id ? String(id) : "";
  }

  return String(product);
};

const sanitizeCartItems = (items = []) =>
  items
    .map((item) => {
      const productValue = item?.product || item?.productId || item?._id || item?.id;
      const productId = getProductId(productValue);

      if (!productId) {
        return null;
      }

      return {
        product: productId,
        name: item.name || item.product?.name || "",
        image: item.image || item.product?.image || "",
        price: Number(item.price ?? item.product?.price ?? 0),
        quantity: Number(item.quantity ?? item.qty ?? 1),
        weight: item.weight || item.product?.weight || "0",
      };
    })
    .filter(Boolean)
    .filter((item) => item.product && item.name && item.price >= 0 && item.quantity >= 1);

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

  const sanitizedItems = sanitizeCartItems(cart.items);

  if (sanitizedItems.length !== cart.items.length) {
    cart.items = sanitizedItems;
    await cart.save();
    cart = await Cart.findById(cart._id).populate(
      "items.product",
      "name slug image price weight"
    );
  }

  return cart;
};

const syncCartTotals = async (cart) => {
  cart.items = sanitizeCartItems(cart.items);

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
   console.log("========== ADD TO CART ==========");
  console.log("UserId:", userId);
  console.log("ProductId:", productId);
  console.log("Quantity:", quantity);
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const cart = await getOrCreateCart(userId);
    console.log("CART BEFORE:", cart);
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

 console.log("CART AFTER:", cart);

  try {
    return await syncCartTotals(cart);
  } catch (err) {
    console.log("SAVE ERROR:", err);
    throw err;
  }
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