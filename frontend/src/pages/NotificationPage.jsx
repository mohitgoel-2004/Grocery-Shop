import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiBell,
  FiCheckCircle,
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

  // ============================================
  // NAVBAR TAB CHANGE
  // ============================================
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

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

  console.log("Notifications =", notifications);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f7f4_42%,#e9efe9_100%)] px-0 py-0 md:px-4 md:py-4 lg:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col overflow-hidden bg-white shadow-[0_28px_80px_rgba(15,23,42,0.16)] md:min-h-[calc(100vh-2rem)] md:rounded-[36px] md:border md:border-white/60 lg:max-w-120">

        {/* ============================================
            HEADER
        ============================================ */}
        <div className="shrink-0 border-b border-[#eef0eb] bg-white/95 px-4 pt-4 pb-3 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="grid h-11 w-11 place-items-center rounded-full bg-[#f3f4f6] text-gray-800 shadow-sm transition hover:scale-105 hover:bg-[#eceff1]"
              aria-label="Back"
            >
              <FiArrowLeft className="text-lg" />
            </button>

            {/* Title */}
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">
                Mobile App
              </p>

              <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                Notifications
              </h2>
            </div>

            {/* Mark All Read */}
            <button
              onClick={readAll}
              disabled={unreadCount === 0}
              className={`relative grid h-11 w-11 place-items-center rounded-full shadow-sm transition ${
                unreadCount > 0
                  ? "bg-[#f3f4f6] text-gray-800 hover:scale-105 hover:bg-[#eceff1]"
                  : "cursor-not-allowed bg-gray-100 text-gray-300"
              }`}
              aria-label="Mark all read"
              title="Mark all notifications as read"
            >
              <FiCheckCircle className="text-lg" />

              {/* Unread Badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ============================================
            CONTENT
        ============================================ */}
        <div className="flex-1 overflow-y-auto px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-2">

          {/* Summary */}
          <div className="mb-4 rounded-[28px] bg-linear-to-br from-[#e8f1ef] to-[#f7f8f6] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">

            <div className="inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-sm">

              {notifications.length} notification
              {notifications.length !== 1 ? "s" : ""}

              {unreadCount > 0 && (
                <span className="ml-2 text-xs font-medium text-red-500">
                  ({unreadCount} unread)
                </span>
              )}
            </div>
          </div>

          {/* ============================================
              NOTIFICATION LIST
          ============================================ */}
          {loading ? (
            <div className="py-10 text-center text-gray-500">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            /* EMPTY STATE */
            <div className="rounded-[28px] border border-dashed border-[#d9ded8] bg-[#fafafa] py-12 text-center">

              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white shadow-sm">
                <FiBell className="text-2xl text-gray-400" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                No notifications
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                You're all caught up!
              </p>
            </div>
          ) : (
            /* NOTIFICATION CARDS */
            <div className="space-y-3">

              {notifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                />
              ))}

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