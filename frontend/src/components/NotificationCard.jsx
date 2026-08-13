import React from "react";
import { FiTrash2, FiBell, FiClock, FiCheckCircle, FiAlertCircle, FiInfo, FiGift } from "react-icons/fi";
import { useNotification } from "../Context/NotificationContext";

const NotificationCard = ({ notification }) => {
  const { readNotification, removeNotification } = useNotification();

  // ============================================
  // CARD CLICK - Mark notification as read
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
    e.stopPropagation();
    removeNotification(notification._id);
  };

  // ============================================
  // FORMAT DATE
  // ============================================
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================
  // GET ICON BASED ON TYPE
  // ============================================
  const getIcon = (type) => {
    switch (type) {
      case "order":
        return <FiBell className="text-emerald-600" size={18} />;
      case "promotion":
        return <FiGift className="text-purple-600" size={18} />;
      case "alert":
        return <FiAlertCircle className="text-red-600" size={18} />;
      case "info":
        return <FiInfo className="text-blue-600" size={18} />;
      default:
        return <FiBell className="text-emerald-600" size={18} />;
    }
  };

  // ============================================
  // GET BACKGROUND COLOR BASED ON TYPE
  // ============================================
  const getBgColor = (type) => {
    switch (type) {
      case "order":
        return "bg-emerald-50";
      case "promotion":
        return "bg-purple-50";
      case "alert":
        return "bg-red-50";
      case "info":
        return "bg-blue-50";
      default:
        return "bg-emerald-50";
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-2xl border transition-all duration-300 p-4 shadow-sm hover:shadow-md ${
        notification.isRead
          ? "bg-white border-emerald-100/60 hover:border-emerald-200"
          : "bg-gradient-to-r from-emerald-50/80 to-white border-emerald-200/80 hover:border-emerald-300"
      } ${!notification.isRead ? "cursor-pointer" : "cursor-default"}`}
    >
      {/* Left Accent Border for Unread */}
      {!notification.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-l-2xl"></div>
      )}

      <div className="flex items-start gap-3 pl-1">
        {/* ============================================
            NOTIFICATION ICON
        ============================================ */}
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getBgColor(notification.type)}`}>
          {getIcon(notification.type)}
        </div>

        {/* ============================================
            CONTENT
        ============================================ */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            {/* Text */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-bold leading-tight ${
                  notification.isRead ? "text-gray-700" : "text-gray-900"
                }`}>
                  {notification.title || "Notification"}
                </h3>
                {!notification.isRead && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-bold text-emerald-700 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    New
                  </span>
                )}
              </div>

              <p className={`mt-1 text-sm leading-relaxed ${
                notification.isRead ? "text-gray-500" : "text-gray-700"
              }`}>
                {notification.message || notification.body}
              </p>

              {/* Time */}
              <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                <FiClock size={12} />
                <span>{formatTime(notification.createdAt)}</span>
              </div>
            </div>

            {/* ================= ACTIONS =================== */}
            <div className="flex shrink-0 items-center gap-1.5">
              {/* Unread Indicator */}
              {!notification.isRead ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Unread" />
                  <span className="text-[8px] text-emerald-500 font-medium">NEW</span>
                </div>
              ) : (
                /* Checkmark for Read */
                <div className="flex flex-col items-center gap-1">
                  <FiCheckCircle className="text-gray-300" size={14} />
                  <span className="text-[8px] text-gray-300 font-medium">READ</span>
                </div>
              )}

              {/* Delete Button - Always Visible on Hover or Read */}
              <button
                type="button"
                onClick={handleDelete}
                className={`grid h-8 w-8 place-items-center rounded-lg transition-all duration-200 ${
                  notification.isRead
                    ? "opacity-100 hover:bg-red-50 text-gray-400 hover:text-red-600"
                    : "opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-400 hover:text-red-600"
                }`}
                title="Delete notification"
                aria-label="Delete notification"
              >
                <FiTrash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Read/Unread Status Bar */}
      <div className={`mt-3 pt-2 border-t ${
        notification.isRead ? "border-gray-100" : "border-emerald-100/50"
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-medium ${
            notification.isRead ? "text-gray-400" : "text-emerald-600"
          }`}>
            {notification.isRead ? "✓ Read" : "● Unread"}
          </span>
          {notification.type && (
            <span className="text-[10px] font-medium text-gray-400 capitalize">
              {notification.type}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;