import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  sendNotification,
  getAdminNotifications,
  markAdminNotificationAsRead,
} from "../../services/notificationService";

import { fetchCustomers } from "../../services/customerService";

import {
  FiBell,
  FiShoppingBag,
  FiCheckCircle,
  FiUsers,
  FiSend,
  FiEye,
  FiClock,
  FiTag,
  FiMessageSquare,
} from "react-icons/fi";

const AdminNotifications = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "system",
    userId: "all",
  });

  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [customers, setCustomers] = useState([]);

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    loadCustomers();
    loadAdminNotifications();
  }, []);

  // ==========================================
  // LOAD CUSTOMERS
  // ==========================================

  const loadCustomers = async () => {
    try {
      const res = await fetchCustomers();
      setCustomers(res.customers || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customers");
    }
  };

  // ==========================================
  // LOAD ADMIN NOTIFICATIONS
  // ==========================================

  const loadAdminNotifications = async () => {
    try {
      const res = await getAdminNotifications();
      console.log("ADMIN NOTIFICATION RESPONSE =", res.data);

      const notificationData =
        res.data?.data?.notifications ||
        res.data?.notifications ||
        [];

      setNotifications(notificationData);
    } catch (error) {
      console.error("ADMIN NOTIFICATIONS ERROR =", error);
      setNotifications([]);
    }
  };

  // ==========================================
  // HANDLE FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================================
  // MARK ADMIN NOTIFICATION AS READ
  // ==========================================

  const handleNotificationClick = async (notification) => {
    if (notification.isRead) {
      return;
    }

    try {
      await markAdminNotificationAsRead(notification._id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );
    } catch (error) {
      console.error("MARK ADMIN NOTIFICATION READ ERROR:", error);
      toast.error("Unable to mark notification as read");
    }
  };

  // ==========================================
  // SEND CUSTOMER NOTIFICATION
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await sendNotification(form);
      toast.success("Notification sent successfully");

      setForm({
        title: "",
        message: "",
        type: "system",
        userId: "all",
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to send notification"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Two Column Layout - Left: Send Form, Right: Notifications List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* ============================================= */}
        {/* LEFT COLUMN - SEND CUSTOMER NOTIFICATION      */}
        {/* ============================================= */}
        <div className="order-2 lg:order-1">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200/60 p-4 sm:p-6 md:p-7 transition-all h-full">
            <h2 className="flex items-center gap-2.5 text-xl md:text-2xl font-bold text-slate-800 mb-5 md:mb-6">
              <FiSend className="text-emerald-500" />
              Send Customer Notification
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              {/* Send To */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <FiUsers className="inline mr-1.5 text-slate-400" />
                  Send To
                </label>
                <select
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                >
                  <option value="all">📢 All Customers</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.fullName || "No Name"} ({customer.mobile})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <FiTag className="inline mr-1.5 text-slate-400" />
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Notification Title"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <FiMessageSquare className="inline mr-1.5 text-slate-400" />
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Notification Message"
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-y"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <FiTag className="inline mr-1.5 text-slate-400" />
                  Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                >
                  <option value="system">System</option>
                  <option value="offer">Offer</option>
                  <option value="delivery">Delivery</option>
                  <option value="payment">Payment</option>
                </select>
              </div>

              {/* Preview */}
              <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4 md:p-5 transition-all">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FiEye className="text-sm" />
                  Notification Preview
                </p>
                <div className="mt-2 border-t border-slate-200/60 pt-3">
                  <h3 className="text-base md:text-lg font-bold text-slate-800">
                    {form.title || "Notification Title"}
                  </h3>
                  <p className="mt-1.5 text-sm md:text-base text-slate-600">
                    {form.message || "Notification Message"}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <FiClock className="text-xs" />
                      just now
                    </span>
                    <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="capitalize bg-slate-200/60 px-2 py-0.5 rounded-full text-slate-500">
                      {form.type || "system"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all duration-200 px-6 py-4 text-white font-semibold text-base shadow-sm shadow-emerald-200 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <FiSend className="text-lg" />
                {loading ? "Sending..." : "Send Notification"}
              </button>
            </form>
          </div>
        </div>

        {/* ============================================= */}
        {/* RIGHT COLUMN - ADMIN NOTIFICATIONS LIST       */}
        {/* ============================================= */}
        <div className="order-1 lg:order-2">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200/60 p-4 sm:p-6 md:p-7 transition-all h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 md:mb-6">
              <div>
                <h2 className="flex items-center gap-2.5 text-xl md:text-2xl font-bold text-slate-800">
                  <FiBell className="text-emerald-500 text-2xl" />
                  Admin Notifications
                </h2>
                <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Notifications from customer activity
                </p>
              </div>

              {/* Unread Badge */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 md:px-4 py-1.5 text-xs md:text-sm font-semibold transition-all duration-200 flex-shrink-0 ${
                  unreadCount > 0
                    ? "bg-red-50 text-red-700 border border-red-200/50"
                    : "bg-emerald-100 text-emerald-700 border border-emerald-200/50"
                }`}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current"></span>
                {unreadCount} {unreadCount === 1 ? "New" : "New"}
              </span>
            </div>

            {/* Notifications List */}
            <div className="max-h-[500px] lg:max-h-[600px] overflow-y-auto pr-1 -mr-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              {notifications.length === 0 ? (
                <div className="rounded-xl bg-slate-50/80 p-8 md:p-12 text-center border border-dashed border-slate-200">
                  <FiBell size={40} className="mx-auto text-slate-300" />
                  <p className="mt-3 text-slate-500 font-medium">
                    No notifications yet
                  </p>
                  <p className="text-sm text-slate-400">
                    Customer activity will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-3.5">
                  {notifications.map((notification) => (
                    <button
                      type="button"
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full rounded-xl md:rounded-2xl border p-3 md:p-4 lg:p-5 text-left transition-all duration-200 hover:shadow-md active:scale-[0.99] ${
                        notification.isRead
                          ? "bg-white border-slate-200/80 hover:border-slate-300"
                          : "bg-emerald-50/70 border-emerald-200/70 hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex gap-3 md:gap-4">
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base md:text-lg ${
                            notification.isRead
                              ? "bg-slate-100 text-slate-500"
                              : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {notification.isRead ? (
                            <FiCheckCircle />
                          ) : (
                            <FiShoppingBag />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className="font-bold text-slate-800 text-sm md:text-base">
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white"></span>
                                New
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            {notification.message}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <FiClock className="text-xs" />
                              {formatDate(notification.createdAt)}
                            </span>
                            <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="capitalize bg-slate-100/60 px-2 py-0.5 rounded-full text-slate-500">
                              {notification.type || "system"}
                            </span>
                          </div>

                          {!notification.isRead && (
                            <p className="mt-2 text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Click to mark as read
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer note */}
            {notifications.length > 0 && (
              <div className="mt-4 text-xs text-slate-400 flex items-center gap-1.5 border-t border-slate-100 pt-3">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                Click on any unread notification to mark as read
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;