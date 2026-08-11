import React from "react";

import { FiTrash2, FiBell, FiClock } from "react-icons/fi";

import { useNotification } from "../Context/NotificationContext";

const NotificationCard = ({ notification }) => {
  const { readNotification, removeNotification } = useNotification();

  // ============================================
  // CARD CLICK
  // Mark notification as read
  // ============================================
  const handleCardClick = () => {
    if (!notification.isRead) {
      readNotification(notification._id);
    }
  };

  // ============================================
  // DELETE NOTIFICATION
  // ============================================
  const handleDelete = (e) => {
    // Prevent card click
    e.stopPropagation();

    removeNotification(notification._id);
  };

  // ============================================
  // FORMAT DATE
  // ============================================
  const formatTime = (timestamp) => {
    if (!timestamp) {
      return "";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group cursor-pointer rounded-[28px] border bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)] ${
        notification.isRead
          ? "border-[#eef0eb]"
          : "border-l-4 border-l-emerald-500 border-[#eef0eb]"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* ============================================
            NOTIFICATION ICON
        ============================================ */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8f1ef] text-emerald-600">
          <FiBell className="text-xl" />
        </div>

        {/* ============================================
            CONTENT
        ============================================ */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            {/* Text */}
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-semibold leading-tight text-gray-900">
                {notification.title || "Notification"}
              </h3>

              <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                {notification.message || notification.body}
              </p>

              {/* Time */}
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                <FiClock className="text-xs" />

                <span>{formatTime(notification.createdAt)}</span>
              </div>
            </div>

            {/* ================= ACTIONS =================== */}
            <div className="flex shrink-0 items-center gap-2">
              {/* UNREAD DOT */}
              {!notification.isRead ? (
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500"
                  title="Unread"
                />
              ) : (
                /* DELETE BUTTON - ONLY AFTER READ */
                <button
                  type="button"
                  onClick={handleDelete}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100
                 hover:text-red-800"
                  title="Delete notification"
                  aria-label="Delete notification"
                >
                  <FiTrash2 size={17} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
