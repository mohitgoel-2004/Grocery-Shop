import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBell, FiCheckCircle, FiClock } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { useNotification } from "../Context/NotificationContext";

// const dummyNotifications = [
//   {
//     _id: "1",
//     title: "Order Confirmed",
//     message: "Your order #1234 has been confirmed",
//     read: false,
//     createdAt: new Date(),
//   },
//   {
//     _id: "2",
//     title: "Delivery Update",
//     message: "Your order is out for delivery",
//     read: true,
//     createdAt: new Date(),
//   },
// ];

const NotificationPage = () => {
  const navigate = useNavigate();
 const {
  notifications,
  loading,
  readAll,
  readNotification,
} = useNotification();
  const [activeTab, setActiveTab] = useState("home"); // or we can have "notifications" if added

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // navigate based on tab
    switch (tabId) {
      case "home":
        navigate("/home");
        break;
      case "cart":
        navigate("/cart");
        break;
      case "search":
        // navigate("/search");
        break;
      case "products":
        navigate("/products");
        break;
      case "profile":
        navigate("/profile");
        break;
      default:
        navigate("/home");
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  console.log("Notifications =", notifications);

  const formatTime = (timestamp) => {
    // simple relative time or just date
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f7f4_42%,#e9efe9_100%)] px-0 py-0 md:px-4 md:py-4 lg:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col overflow-hidden bg-white shadow-[0_28px_80px_rgba(15,23,42,0.16)] md:min-h-[calc(100vh-2rem)] md:rounded-[36px] md:border md:border-white/60 lg:max-w-120">
        
        {/* Header */}
        <div className="shrink-0 bg-white/95 px-4 pt-4 pb-3 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="grid h-11 w-11 place-items-center rounded-full bg-[#f3f4f6] text-gray-800 shadow-sm transition hover:scale-105 hover:bg-[#eceff1]"
              aria-label="Back"
            >
              <FiArrowLeft className="text-lg" />
            </button>

            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">
                Mobile App
              </p>
              <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                Notifications
              </h2>
            </div>

            <button
              onClick={readAll}
              className="grid h-11 w-11 place-items-center rounded-full bg-[#f3f4f6] text-gray-800 shadow-sm transition hover:scale-105 hover:bg-[#eceff1] relative"
              aria-label="Mark all read"
            >
              <FiCheckCircle className="text-lg" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
          {/* Summary chip */}
          <div className="mb-4 rounded-[28px] bg-linear-to-br from-[#e8f1ef] to-[#f7f8f6] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-sm">
              {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              {unreadCount > 0 && (
                <span className="ml-2 text-xs font-medium text-red-500">
                  ({unreadCount} unread)
                </span>
              )}
            </div>
          </div>

          {/* Notification list */}
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#d9ded8] bg-[#fafafa] py-12 text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white shadow-sm">
                <FiBell className="text-2xl text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`group rounded-[28px] border border-[#eef0eb] bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)] ${
                    !notification.isRead ? "border-l-4 border-l-emerald-500" : ""
                  }`}
                  onClick={() => readNotification && readNotification(notification._id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8f1ef] text-emerald-600">
                      <FiBell className="text-xl" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="text-[15px] font-semibold leading-tight text-gray-900">
                            {notification.title || "Notification"}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {notification.message || notification.body}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                            <FiClock className="text-xs" />
                            <span>{formatTime(notification.createdAt)}</span>
                          </div>
                        </div>
                        {!notification.isRead && (
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navbar */}
        <Navbar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
};

export default NotificationPage;