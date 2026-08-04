const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const {
	createOrder,
	listOrders,
	cancelOrder,
} = require("../services/orderService");

// const {
// 	getAllOrders,
//     getOrderById,
//     updateOrderStatus,
//     deleteOrder,
//     getDashboardStats,
// } = require("../services/adminOrderService");

const placeOrder = asyncHandler(async (req, res) => {
    const { paymentMethod, deliveryAddress } = req.body;

    const order = await createOrder({
        user: req.user,
        paymentMethod,
        deliveryAddress,
    });

    // Customer Notification
    await Notification.create({
        user: order.user,
        title: "Order Placed",
        message: `Your order ${
            order.orderNumber ? "#" + order.orderNumber : ""
        } has been placed successfully.`,
        type: "order",
        data: {
            orderId: order._id,
        },
    });

    res
        .status(201)
        .json(ApiResponse.success({ order }, "Order placed successfully"));
});

const fetchOrders = asyncHandler(async (req, res) => {
	const orders = await listOrders(req.user._id);

	res.status(200).json(ApiResponse.success({ orders }, "Orders fetched successfully"));
});

const cancelUserOrder = asyncHandler(async (req, res) => {
	const orderId = req.body.orderId || req.query.orderId;

	if (!orderId) {
		throw new ApiError(400, "orderId is required");
	}

	const order = await cancelOrder(req.user._id, orderId);

	res.status(200).json(ApiResponse.success({ order }, "Order cancelled successfully"));
});

const Order = require("../models/Order");
const getAllOrders = asyncHandler(async (req, res) => {

    const orders = await Order.find()
        .populate("user", "name email phone")
        .populate("items.product")
        .sort({ createdAt: -1 });

    res.status(200).json(
        ApiResponse.success(
            { orders },
            "Orders fetched successfully"
        )
    );
});
const getOrderById = asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id)
        .populate("user", "name email phone")
        .populate("items.product");

    if (!order)
        throw new ApiError(404, "Order not found");

    res.json(
        ApiResponse.success(
            { order },
            "Order fetched successfully"
        )
    );

});
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
       { returnDocument: "after" }
    );

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    await Notification.create({
        user: order.user,
        title: "Order Update",
        message: `Your order status has been updated to ${status}.`,
        type: "order",
        data: {
            orderId: order._id,
            status,
        },
    });

    res.json(
        ApiResponse.success(
            { order },
            "Order status updated successfully"
        )
    );
});
const deleteOrder = asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id);

    if (!order)
        throw new ApiError(404, "Order not found");

    await order.deleteOne();

    res.json(
        ApiResponse.success(
            {},
            "Order deleted successfully"
        )
    );

});
const getOrderStats = asyncHandler(async (req, res) => {

    const totalOrders = await Order.countDocuments();

    const processing = await Order.countDocuments({
        status: "Processing",
    });

    const delivered = await Order.countDocuments({
        status: "Delivered",
    });

    const cancelled = await Order.countDocuments({
        status: "Cancelled",
    });

    const revenue = await Order.aggregate([
        {
            $match: {
                status: {
                    $ne: "Cancelled",
                },
            },
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$total",
                },
            },
        },
    ]);

    res.json(
        ApiResponse.success({
            totalOrders,
            processing,
            delivered,
            cancelled,
            revenue:
                revenue.length > 0
                    ? revenue[0].total
                    : 0,
        })
    );

});
const searchOrders = asyncHandler(async (req, res) => {

    const keyword = req.query.keyword || "";

    const orders = await Order.find()
        .populate("user", "name email phone")
        .populate("items.product");

    const filtered = orders.filter((o) =>

        o.orderNumber.toLowerCase().includes(keyword.toLowerCase())

        ||

        o.user?.name?.toLowerCase().includes(keyword.toLowerCase())

        ||

        o.user?.email?.toLowerCase().includes(keyword.toLowerCase())

    );

    res.json(
        ApiResponse.success({
            orders: filtered,
        })
    );

});
const getOrdersByStatus = asyncHandler(async (req, res) => {

    const orders = await Order.find({
        status: req.params.status,
    })
        .populate("user", "name email phone")
        .populate("items.product");

    res.json(
        ApiResponse.success({
            orders,
        })
    );

});

module.exports = {
	placeOrder,
	fetchOrders,
	cancelUserOrder,

	getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getOrderStats,
    searchOrders,
    getOrdersByStatus,
};
