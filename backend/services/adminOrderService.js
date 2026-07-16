const Order = require("../models/Order");

const getAllOrders = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
}) => {

    const query = {};

    if (status && status !== "all") {
        query.status = status;
    }

    let orders = await Order.find(query)
        .populate("user", "name email phone")
        .populate("items.product")
        .sort({ createdAt: -1 });

    if (search) {

        const keyword = search.toLowerCase();

        orders = orders.filter(order =>

            order.orderNumber.toLowerCase().includes(keyword)

            ||

            order.user?.name?.toLowerCase().includes(keyword)

            ||

            order.user?.email?.toLowerCase().includes(keyword)

        );

    }

    const total = orders.length;

    const start = (page - 1) * limit;

    const paginatedOrders = orders.slice(
        start,
        start + Number(limit)
    );

    return {

        orders: paginatedOrders,

        total,

        page: Number(page),

        pages: Math.ceil(total / limit),

    };

};

const getOrderById = async (id) => {

    return Order.findById(id)

        .populate("user", "name email phone")

        .populate("items.product");

};

const updateOrderStatus = async (id, status) => {

    const order = await Order.findById(id);

    if (!order) {

        throw new Error("Order not found");

    }

    order.status = status;

    await order.save();

    return order.populate("user", "name email phone");

};

const deleteOrder = async (id) => {

    const order = await Order.findById(id);

    if (!order) {

        throw new Error("Order not found");

    }

    await order.deleteOne();

};

const getDashboardStats = async () => {

    const totalOrders = await Order.countDocuments();

    const processing = await Order.countDocuments({
        status: "Processing",
    });

    const packed = await Order.countDocuments({
        status: "Packed",
    });

    const shipped = await Order.countDocuments({
        status: "Shipped",
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
                totalRevenue: {
                    $sum: "$total",
                },
            },
        },

    ]);

    return {

        totalOrders,

        processing,

        packed,

        shipped,

        delivered,

        cancelled,

        revenue:

            revenue.length > 0

                ? revenue[0].totalRevenue

                : 0,

    };

};

module.exports = {

    getAllOrders,

    getOrderById,

    updateOrderStatus,

    deleteOrder,

    getDashboardStats,

};