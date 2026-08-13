import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBell,
  FiCheckCircle,
  FiBellOff,
  FiInbox,
  FiClock,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import NotificationCard from "../components/NotificationCard";
import { useNotification } from "../Context/NotificationContext";

const NotificationPage = () => {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    unreadCount,
    readAll,
  } = useNotification();

  const [activeTab, setActiveTab] = useState("home");

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    switch (tabId) {
      case "home":
        navigate("/home");
        break;
      case "cart":
        navigate("/cart");
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

  return (
    <div className="min-h-screen bg-white px-0 py-0 md:px-4 md:py-4 lg:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col overflow-hidden bg-white md:min-h-[calc(100vh-2rem)] md:rounded-[30px] md:border md:border-emerald-100 lg:max-w-120">

        {/* ============================================
            HEADER
        ============================================ */}
        <div className="shrink-0 bg-gradient-to-b from-emerald-100 via-emerald-50 to-white px-4 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-emerald-100 bg-white shadow-sm transition hover:scale-105 hover:bg-emerald-50"
              aria-label="Back"
            >
              <FiArrowLeft className="text-lg text-emerald-600" />
            </button>

            {/* Title */}
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-600">
                Stay Updated
              </p>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                Notifications
              </h2>
            </div>

            {/* Mark All Read */}
            <button
              onClick={readAll}
              disabled={unreadCount === 0}
              className={`relative grid h-11 w-11 place-items-center rounded-full border shadow-sm transition ${
                unreadCount > 0
                  ? "border-emerald-100 bg-white text-emerald-600 hover:scale-105 hover:bg-emerald-50"
                  : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300"
              }`}
              aria-label="Mark all read"
              title="Mark all notifications as read"
            >
              <FiCheckCircle className="text-lg" />

              {/* Unread Badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-md shadow-red-200/50 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ============================================
            CONTENT
        ============================================ */}
        <div className="flex-1 overflow-y-auto px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4">

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
              <p className="text-[10px] text-gray-500 font-medium">Total</p>
              <p className="text-lg font-bold text-emerald-600">{notifications.length}</p>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-center">
              <p className="text-[10px] text-gray-500 font-medium">Unread</p>
              <p className="text-lg font-bold text-blue-600">{unreadCount}</p>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 text-center">
              <p className="text-[10px] text-gray-500 font-medium">Read</p>
              <p className="text-lg font-bold text-gray-600">{notifications.length - unreadCount}</p>
            </div>
          </div>

          {/* ============================================
              NOTIFICATION LIST
          ============================================ */}
          {loading ? (
            <div className="rounded-2xl border border-emerald-100/80 bg-white p-12 text-center shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Loading notifications...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            /* EMPTY STATE */
            <div className="rounded-2xl border border-emerald-100/80 bg-white p-12 text-center shadow-sm">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                <FiBellOff className="text-emerald-400 text-4xl" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-800">
                No notifications
              </h3>
              <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
                You're all caught up! We'll notify you when something new arrives.
              </p>
              <button
                onClick={() => navigate("/home")}
                className="mt-4 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200/50 transition hover:bg-emerald-700 hover:scale-[1.01]"
              >
                Browse Products
              </button>
            </div>
          ) : (
            /* NOTIFICATION CARDS */
            <div className="space-y-3 pb-4">
              {/* Unread Section Header */}
              {unreadCount > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent"></div>
                  <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                    <FiBell size={12} />
                    New ({unreadCount})
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-emerald-200 to-transparent"></div>
                </div>
              )}

              {notifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                />
              ))}

              {/* Footer */}
              <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-gray-100">
                <FiClock className="text-gray-300 text-xs" />
                <p className="text-[10px] text-gray-400">
                  Showing all notifications
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ============================================
            NAVBAR
        ============================================ */}
        <Navbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  );
};

export default NotificationPage;