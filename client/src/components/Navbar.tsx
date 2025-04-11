import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoSearchOutline,
  IoNotificationsOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { BsChatDots } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import ChatModal from "./ChatModal";
import { useNotificationDemo } from "../hooks/useNotificationDemo";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  toggleSidebar: () => void;
}

// Sample notifications data
const mockNotifications = [
  {
    id: "1",
    type: "info" as const,
    title: "New Feature",
    message: "Check out our new notification system!",
    time: "5 min ago",
    read: false,
    link: "/notifications-demo",
  },
  {
    id: "2",
    type: "success" as const,
    title: "Post Published",
    message: "Your post was successfully published to the community.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "warning" as const,
    title: "Storage Limit",
    message: "You're reaching your storage limit. Consider upgrading.",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "error" as const,
    title: "Upload Failed",
    message: "Your file upload failed. Please try again.",
    time: "Yesterday",
    read: true,
  },
];

function Navbar({ toggleSidebar }: NavbarProps) {
  const [showChatModal, setShowChatModal] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const { showInfo, showSuccess } = useNotificationDemo();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const toggleChatModal = () => {
    setShowChatModal(!showChatModal);
  };

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  // Close dropdowns when clicking outside but maintain separate event handlers
  // for each dropdown to avoid interference with navigation
  useEffect(() => {
    const handleClickOutsideProfile = (event: MouseEvent) => {
      // Don't close if the click originated from a dropdown button
      const target = event.target as HTMLElement;
      if (target.closest('[data-dropdown-toggle="profile"]')) {
        return;
      }

      // Close profile dropdown when clicking outside
      if (showProfileDropdown && !target.closest('[data-dropdown="profile"]')) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutsideProfile);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideProfile);
    };
  }, [showProfileDropdown]);

  // Handle notification dropdown separately
  useEffect(() => {
    const handleClickOutsideNotification = (event: MouseEvent) => {
      // Don't close if the click originated from a notification button
      const target = event.target as HTMLElement;
      if (target.closest('[data-dropdown-toggle="notification"]')) {
        return;
      }

      // Close notification dropdown when clicking outside
      if (
        showNotificationDropdown &&
        !target.closest('[data-dropdown="notification"]')
      ) {
        setShowNotificationDropdown(false);
      }
    };

    if (showNotificationDropdown) {
      document.addEventListener("mousedown", handleClickOutsideNotification);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideNotification);
    };
  }, [showNotificationDropdown]);

  const toggleProfileDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowProfileDropdown(!showProfileDropdown);

    // Close notification dropdown if open
    if (showNotificationDropdown) {
      setShowNotificationDropdown(false);
    }
  };

  // Function to navigate to all notifications page
  const goToAllNotifications = () => {
    setShowNotificationDropdown(false);
    navigate("/notifications");
  };

  // Function to handle notification badge click - shows dropdown on normal click, navigates on long press/right click
  const handleNotificationBadgeClick = (event: React.MouseEvent) => {
    // Right click or long press should navigate to notifications page
    if (event.button === 2 || event.ctrlKey || event.metaKey) {
      event.preventDefault();
      goToAllNotifications();
    } else {
      // Normal click - toggle dropdown
      toggleNotificationDropdown();
    }
  };

  // Function to handle notification click
  const handleNotificationClick = (notification: any) => {
    // Mark the notification as read
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Show a toast notification
    showInfo(notification.title, notification.message, 5000, "top-right");

    // Close the dropdown
    setShowNotificationDropdown(false);
  };

  // Function to mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => ({ ...n, read: true }))
    );

    showSuccess(
      "Notifications",
      "All notifications marked as read",
      3000,
      "top-right"
    );
  };

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-2.5 md:px-6 md:py-3 z-30">
        {/* Left section - Logo and Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden"
            aria-label="Toggle sidebar"
          >
            <IoMenuOutline className="w-6 h-6" />
          </button>
          <Link to="/" className="text-xl font-bold text-gray-800">
            Logo
          </Link>
        </div>

        {/* Search Bar - Full on desktop, simplified on mobile */}
        <div className="flex-1 max-w-xl mx-2 md:mx-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-9 py-2 pl-9 pr-4 text-gray-700 placeholder-gray-500 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleChatModal}
            className="hidden md:flex p-2 text-gray-700 hover:bg-gray-100 rounded-full"
            aria-label="Chat"
          >
            <BsChatDots className="w-5 h-5" />
          </button>
          <div className="hidden md:block relative">
            <button
              onClick={handleNotificationBadgeClick}
              onContextMenu={(e) => {
                e.preventDefault();
                goToAllNotifications();
              }}
              title="Click to show notifications, right-click to see all notifications"
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-full relative"
              aria-label="Notifications"
            >
              <IoNotificationsOutline className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
            <NotificationDropdown
              isOpen={showNotificationDropdown}
              onClose={() => setShowNotificationDropdown(false)}
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllAsRead}
              onNotificationClick={handleNotificationClick}
            />
          </div>
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center text-gray-700 hover:bg-gray-100 rounded-full p-1"
              aria-label="Profile"
              data-dropdown-toggle="profile"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                {user ? (
                  <span className="text-xs font-semibold">
                    {user.displayName?.charAt(0) ||
                      user.email?.charAt(0) ||
                      "U"}
                  </span>
                ) : (
                  <CgProfile className="w-5 h-5" />
                )}
              </div>
            </button>
            <div data-dropdown="profile">
              <ProfileDropdown
                isOpen={showProfileDropdown}
                onClose={() => setShowProfileDropdown(false)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Footer Navigation - Hidden when using Desktop */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around px-4 py-2 z-30">
        <button
          onClick={toggleChatModal}
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
          aria-label="Chat"
        >
          <BsChatDots className="w-5 h-5" />
        </button>
        <div className="relative">
          <button
            onClick={handleNotificationBadgeClick}
            onContextMenu={(e) => {
              e.preventDefault();
              goToAllNotifications();
            }}
            title="Click to show notifications, right-click to see all notifications"
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full relative"
            aria-label="Notifications"
          >
            <IoNotificationsOutline className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>
          <NotificationDropdown
            isOpen={showNotificationDropdown}
            onClose={() => setShowNotificationDropdown(false)}
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllAsRead}
            onNotificationClick={handleNotificationClick}
          />
        </div>
        <div className="relative">
          <button
            onClick={toggleProfileDropdown}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
            aria-label="Profile"
            data-dropdown-toggle="profile"
          >
            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
              {user ? (
                <span className="text-xs font-semibold">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                </span>
              ) : (
                <CgProfile className="w-5 h-5" />
              )}
            </div>
          </button>
          <div
            className="absolute bottom-14 right-0 transform translate-y-2"
            data-dropdown="profile"
          >
            <ProfileDropdown
              isOpen={showProfileDropdown}
              onClose={() => setShowProfileDropdown(false)}
            />
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
      />
    </>
  );
}

export default Navbar;
