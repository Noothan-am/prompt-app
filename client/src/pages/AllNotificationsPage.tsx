import React, { useState } from "react";
import {
  IoCheckmarkCircle,
  IoWarning,
  IoInformationCircle,
  IoAlertCircle,
  IoTrashOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";
import { useNotificationDemo } from "../hooks/useNotificationDemo";

// Sample notification data (in a real app, you'd fetch this from your backend)
const initialNotifications = [
  {
    id: "1",
    type: "info" as const,
    title: "New Feature",
    message:
      "Check out our new notification system! This system allows you to receive important updates about your account, posts, and other activities.",
    time: "5 min ago",
    read: false,
    link: "/notifications-demo",
    date: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "2",
    type: "success" as const,
    title: "Post Published",
    message:
      "Your post was successfully published to the community. You can expect to start receiving engagement soon.",
    time: "1 hour ago",
    read: false,
    date: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: "3",
    type: "warning" as const,
    title: "Storage Limit",
    message:
      "You're reaching your storage limit. Consider upgrading your plan to avoid any interruptions in service.",
    time: "2 hours ago",
    read: true,
    date: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
  },
  {
    id: "4",
    type: "error" as const,
    title: "Upload Failed",
    message:
      "Your file upload failed. Please try again or contact support if the issue persists.",
    time: "Yesterday",
    read: true,
    date: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
  },
  {
    id: "5",
    type: "success" as const,
    title: "Account Verified",
    message:
      "Your account has been successfully verified. You now have access to all features of the platform.",
    time: "3 days ago",
    read: true,
    date: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
  },
  {
    id: "6",
    type: "info" as const,
    title: "Maintenance Scheduled",
    message:
      "We will be performing scheduled maintenance this weekend. The service might be temporarily unavailable during this time.",
    time: "5 days ago",
    read: true,
    date: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(),
  },
];

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
  date: string;
}

const AllNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const { showSuccess, showInfo } = useNotificationDemo();

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <IoCheckmarkCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <IoAlertCircle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <IoWarning className="w-6 h-6 text-yellow-500" />;
      case "info":
      default:
        return <IoInformationCircle className="w-6 h-6 text-blue-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    showInfo("Notification marked as read", "", 2000);
  };

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, read: true }))
    );
    showSuccess("All notifications marked as read", "", 2000);
  };

  const deleteNotification = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
    showInfo("Notification deleted", "", 2000);
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  // Group notifications by date
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);

  const groupedNotifications = {
    today: filteredNotifications.filter(
      (n) => new Date(n.date).setHours(0, 0, 0, 0) === today
    ),
    yesterday: filteredNotifications.filter(
      (n) => new Date(n.date).setHours(0, 0, 0, 0) === yesterday
    ),
    older: filteredNotifications.filter(
      (n) => new Date(n.date).setHours(0, 0, 0, 0) < yesterday
    ),
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Notifications</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === "all"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === "unread"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-3 py-1 text-sm rounded-md ${
              filter === "read"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No notifications to display</p>
        </div>
      ) : (
        <div className="space-y-6">
          {notifications.some((n) => !n.read) && (
            <div className="flex justify-end">
              <button
                onClick={markAllAsRead}
                className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
              >
                <IoCheckmarkDoneOutline className="mr-1" />
                Mark all as read
              </button>
            </div>
          )}

          {/* Today's notifications */}
          {groupedNotifications.today.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Today</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {groupedNotifications.today.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-b border-gray-100 last:border-0 ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-end space-x-2 mt-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <IoCheckmarkCircle className="mr-1" />
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="text-xs text-red-600 hover:text-red-800 flex items-center"
                            >
                              <IoTrashOutline className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Yesterday's notifications */}
          {groupedNotifications.yesterday.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">
                Yesterday
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {groupedNotifications.yesterday.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-b border-gray-100 last:border-0 ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-end space-x-2 mt-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <IoCheckmarkCircle className="mr-1" />
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="text-xs text-red-600 hover:text-red-800 flex items-center"
                            >
                              <IoTrashOutline className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Older notifications */}
          {groupedNotifications.older.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-2">Older</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {groupedNotifications.older.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-b border-gray-100 last:border-0 ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-end space-x-2 mt-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <IoCheckmarkCircle className="mr-1" />
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="text-xs text-red-600 hover:text-red-800 flex items-center"
                            >
                              <IoTrashOutline className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllNotificationsPage;
