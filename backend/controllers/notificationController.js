const Notification = require("../models/Notification");
const User = require("../models/User");

// =====================================================
// ADMIN SEND NOTIFICATION TO CUSTOMER
// =====================================================

exports.sendNotification = async (req, res) => {
  try {
    const { userId, title, message, type, data } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    // ===============================
    // SEND TO ALL CUSTOMERS
    // ===============================

    if (!userId || userId === "all") {
      const users = await User.find({}, "_id");

      const notifications = users.map((user) => ({
        user: user._id,
        recipientType: "customer",
        title,
        message,
        type: type || "system",
        data: data || {},
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }

      return res.status(201).json({
        success: true,
        message: "Notification sent to all users",
      });
    }

    // ===============================
    // SEND TO SINGLE CUSTOMER
    // ===============================

    const notification = await Notification.create({
      user: userId,
      recipientType: "customer",
      title,
      message,
      type: type || "system",
      data: data || {},
    });

    return res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      notification,
    });
  } catch (err) {
    console.error("SEND NOTIFICATION ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to send notification",
    });
  }
};

// =====================================================
// CUSTOMER GET NOTIFICATIONS
// =====================================================

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
      recipientType: "customer",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// =====================================================
// ADMIN GET NOTIFICATIONS
// =====================================================

exports.getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientType: "admin",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (err) {
    console.error("ADMIN NOTIFICATION ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch admin notifications",
    });
  }
};

// =====================================================
// CUSTOMER MARK AS READ
// =====================================================

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
        recipientType: "customer",
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      notification,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to update notification",
    });
  }
};

// =====================================================
// ADMIN MARK AS READ
// =====================================================

exports.markAdminAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipientType: "admin",
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Admin notification not found",
      });
    }

    res.json({
      success: true,
      notification,
    });
  } catch (err) {
    console.error("ADMIN MARK READ ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Unable to update admin notification",
    });
  }
};

// =====================================================
// CUSTOMER MARK ALL READ
// =====================================================

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user._id,
        recipientType: "customer",
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// =====================================================
// CUSTOMER DELETE
// =====================================================

exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
      recipientType: "customer",
    });

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to delete notification",
    });
  }
};

// =====================================================
// CUSTOMER CLEAR ALL
// =====================================================

exports.clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.user._id,
      recipientType: "customer",
    });

    res.json({
      success: true,
      message: "All notifications deleted",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to clear notifications",
    });
  }
};