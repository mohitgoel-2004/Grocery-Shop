const User = require("../models/User");
const Order = require("../models/Order");

/* ==========================================================
   GET ALL CUSTOMERS
   GET /api/admin/customers
========================================================== */

// console.log("REQ QUERY =", req.query);
// console.log("MONGO QUERY =", query);

exports.getAllCustomers = async (req, res) => {
  try {
    // console.log("REQ QUERY =", req.query);
    const {
      search = "",
      status,
      premium,
      deleted,
      page = 1,
      limit = 10,
    } = req.query;

   const query = {};
  // console.log("MONGO QUERY BEFORE =", query);
    // Search
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Status
    if (status) {
      query.status = status;
    }

    // Premium
    if (premium !== undefined) {
      query.isPremium = premium === "true";
    }

    // Deleted
   if (deleted !== undefined) {
  query.deleted = deleted === "true";
} else {
  query.deleted = false;
}

    const skip = (Number(page) - 1) * Number(limit);
    //  console.log("FINAL QUERY =", query);

const users = await User.find(query)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(Number(limit));

//   console.log("USERS FOUND =", users.length);
// console.log(users);

    const customers = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ user: user._id });

        const totalOrders = orders.length;

        const totalSpent = orders.reduce(
          (sum, order) => sum + order.total,
          0
        );

        return {
          _id: user._id,
          fullName: user.fullName,
          mobile: user.mobile,
          email: user.email,
          address: user.address,
          city: user.city,
          pincode: user.pincode,

          status: user.status,
          isPremium: user.isPremium,
          deleted: user.deleted,

          totalOrders,
          totalSpent,

          createdAt: user.createdAt,
        };
      })
    );

   const totalCustomers = await User.countDocuments(query);
    res.status(200).json({
      success: true,

      customers,

      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalCustomers / Number(limit)),
        totalCustomers,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};

/* ==========================================================
   GET CUSTOMER DETAILS
   GET /api/admin/customers/:id
========================================================== */

exports.getCustomerById = async (req, res) => {
  try {
    // console.log("ID =", req.params.id);

    const customer = await User.findById(req.params.id);

    // console.log("CUSTOMER =", customer);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const orders = await Order.find({ user: customer._id });

    const totalOrders = orders.length;

    const totalSpent = orders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );

    res.json({
      success: true,
      customer,
      orders,
      stats: {
        totalOrders,
        totalSpent,
      },
    });
  } catch (err) {
    console.error("GET CUSTOMER ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ==========================================================
   CUSTOMER STATS
   GET /api/admin/customers/stats
========================================================== */

exports.getCustomerStats = async (req, res) => {
  try {
     const allUsers = await User.find({});

    // console.log("ALL USERS =", allUsers.length);
    // console.log(allUsers);
 const totalCustomers = await User.countDocuments({
    deleted: false,
});

const activeCustomers = await User.countDocuments({
  status: "active",
  deleted: false,
});

const blockedCustomers = await User.countDocuments({
  status: "blocked",
  deleted: false,
});

const premiumCustomers = await User.countDocuments({
  isPremium: true,
  deleted: false,
});

const deletedCustomers = await User.countDocuments({
  deleted: true,
});
// console.log("DELETED =", deletedCustomers);
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$total",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,

      stats: {
        totalCustomers,
        activeCustomers,
        blockedCustomers,
        premiumCustomers,
        deletedCustomers,

        totalRevenue:
          revenue.length > 0
            ? revenue[0].totalRevenue
            : 0,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};

/* ==========================================================
   CREATE CUSTOMER
   POST /api/admin/customers
========================================================== */

exports.createCustomer = async (req, res) => {
  try {
    //    console.log("BODY =>", req.body);
    // console.log("MOBILE =>", req.body.mobile);
    const {
      fullName,
      mobile,
      email,
      address,
      city,
      pincode,
      status,
      isPremium
    } = req.body;

    const user = await User.create({
      fullName,
      mobile,
      email,
      address,
      city,
      pincode,
      status,
      isPremium
    });

    res.status(201).json({
      success: true,
      customer: user,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to create customer",
    });
  }
};

/* ==========================================================
   UPDATE CUSTOMER
   PUT /api/admin/customers/:id
========================================================== */

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const {
      fullName,
      email,
      address,
      city,
      pincode,
    } = req.body;

    customer.fullName = fullName ?? customer.fullName;
    customer.email = email ?? customer.email;
    customer.address = address ?? customer.address;
    customer.city = city ?? customer.city;
    customer.pincode = pincode ?? customer.pincode;

    await customer.save();

    res.json({
      success: true,
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update customer",
    });
  }
};

/* ==========================================================
   BLOCK CUSTOMER
   PATCH /api/admin/customers/:id/block
========================================================== */

exports.blockCustomer = async (req, res) => {
  try {
    const customer = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "blocked",
      },
      {
        new: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer blocked successfully",
      customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to block customer",
    });
  }
};

/* ==========================================================
   UNBLOCK CUSTOMER
   PATCH /api/admin/customers/:id/unblock
========================================================== */

exports.unblockCustomer = async (req, res) => {
  try {
    const customer = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: "active",
      },
      {
        new: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer unblocked successfully",
      customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to unblock customer",
    });
  }
};

/* ==========================================================
   MAKE PREMIUM
   PATCH /api/admin/customers/:id/premium
========================================================== */

exports.makePremium = async (req, res) => {
  try {
    const customer = await User.findByIdAndUpdate(
      req.params.id,
      {
        isPremium: true,
      },
      {
        new: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer upgraded to Premium",
      customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update premium status",
    });
  }
};

/* ==========================================================
   SOFT DELETE CUSTOMER
   DELETE /api/admin/customers/:id
========================================================== */

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findByIdAndUpdate(
      req.params.id,
      {
        deleted: true,
      },
      {
        new: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete customer",
    });
  }
};

/* ==========================================================
   RESTORE CUSTOMER
   PATCH /api/admin/customers/:id/restore
========================================================== */

exports.restoreCustomer = async (req, res) => {
  try {
    const customer = await User.findByIdAndUpdate(
      req.params.id,
      {
        deleted: false,
      },
      {
        new: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer restored successfully",
      customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to restore customer",
    });
  }
};

/* ==========================================================
   PERMANENT DELETE
   DELETE /api/admin/customers/:id/permanent
========================================================== */

exports.permanentDeleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await Order.deleteMany({
      user: customer._id,
    });

    await User.findByIdAndDelete(customer._id);

    res.json({
      success: true,
      message: "Customer permanently deleted",
    });
  } catch (error) {
  console.error("ERROR =>", error);

  res.status(500).json({
    success: false,
    message: error.message,
    error,
  });
}
};