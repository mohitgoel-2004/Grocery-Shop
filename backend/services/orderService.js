const Order = require("../models/Order");
const Cart = require("../models/Cart");

const calculateDeliveryCharge = (subtotal) => (subtotal >= 500 || subtotal === 0 ? 0 : 40);
const calculateTax = (subtotal) => Math.round(subtotal * 0.05);

const createOrder = async ({ user, paymentMethod = "cod", deliveryAddress }) => {
  const cart = await Cart.findOne({ user: user._id });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryCharge = calculateDeliveryCharge(subtotal);
  const tax = calculateTax(subtotal);
  const total = subtotal + deliveryCharge + tax;
  const orderNumber = `#${Math.floor(100000 + Math.random() * 900000)}`;

  const order = await Order.create({
    user: user._id,
    items: cart.items.map((item) => ({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      weight: item.weight,
    })),
    deliveryAddress: deliveryAddress || user.address,
    paymentMethod,
    subtotal,
    deliveryCharge,
    tax,
    total,
    orderNumber,
  });

  cart.items = [];
  cart.subtotal = 0;
  cart.total = 0;
  await cart.save();

  return order.populate("items.product", "name slug image price weight");
};

const listOrders = async (userId) => {
  return Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("items.product", "name slug image price weight");
};

const cancelOrder = async (userId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (
    [
      "Delivered",
      "Cancelled",
      "Returned",
      "Refunded",
    ].includes(order.status)
  ) {
    throw new Error("Order cannot be cancelled");
  }

  order.status = "Cancelled";
  order.cancelledAt = new Date();

  await order.save();

  return order.populate(
    "items.product",
    "name slug image price weight"
  );
};

module.exports = {
  createOrder,
  listOrders,
  cancelOrder,
};