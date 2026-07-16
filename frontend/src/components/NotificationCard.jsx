import React from "react";
import { FiCheck, FiTrash2 } from "react-icons/fi";
import { useNotification } from "../Context/NotificationContext";

const NotificationCard = ({ notification }) => {
  const { readNotification, removeNotification } = useNotification();

  return (
    <div
      className={`flex items-start justify-between p-4 border rounded-lg shadow-sm mb-3 transition
      ${notification.isRead ? "bg-gray-50" : "bg-white border-blue-300"}`}
    >
      <div>
        <h3 className="font-semibold text-gray-800">
          {notification.title}
        </h3>
        <p className="text-sm text-gray-600">
          {notification.message}
        </p>
        <span className="text-xs text-gray-400">
          {new Date(notification.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="flex gap-3">
        {!notification.isRead && (
          <button
            onClick={() => readNotification(notification._id)}
            className="text-green-600 hover:text-green-800"
          >
            <FiCheck size={18} />
          </button>
        )}

        <button
          onClick={() => removeNotification(notification._id)}
          className="text-red-600 hover:text-red-800"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;