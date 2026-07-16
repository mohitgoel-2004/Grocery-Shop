const Notification = require("../models/Notification");
const User = require("../models/User");


// =====================================================
// ADMIN SEND NOTIFICATION
// =====================================================

exports.sendNotification = async (req, res) => {
    // console.log("SEND NOTIFICATION API HIT");
  try {
    const { userId, title, message, type, data } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    // Send to all users
    if (!userId || userId === "all") {
      const users = await User.find({}, "_id");
//       console.log("TOTAL USERS =", users.length);
// console.log(users);

      const notifications = users.map((user) => ({
        user: user._id,
        title,
        message,
        type: type || "system",
        data: data || {},
      }));
  //  console.log("NOTIFICATIONS TO INSERT =", notifications);
      await Notification.insertMany(notifications);
// console.log("Inserted =", result.length);
      return res.status(201).json({
        success: true,
        message: "Notification sent to all users",
      });
    }

    // Send to single user
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type: type || "system",
      data: data || {},
    });

    res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      notification,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to send notification",
    });
  }
};

// GET ALL NOTIFICATIONS

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};



// MARK AS READ

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    res.json({
      success: true,
      notification,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to update notification",
    });
  }
};




// MARK ALL READ

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user._id,
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
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};




// DELETE ONE

exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to delete notification",
    });
  }
};




// CLEAR ALL

exports.clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.user._id,
    });

    res.json({
      success: true,
      message: "All notifications deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to clear notifications",
    });
  }
};