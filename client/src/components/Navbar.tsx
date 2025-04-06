import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  IoSearchOutline,
  IoNotificationsOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { BsChatDots } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import ChatModal from "./ChatModal";

interface NavbarProps {
  toggleSidebar: () => void;
}

function Navbar({ toggleSidebar }: NavbarProps) {
  const [showChatModal, setShowChatModal] = useState(false);

  const toggleChatModal = () => {
    setShowChatModal(!showChatModal);
  };

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
          <button
            className="hidden md:flex p-2 text-gray-700 hover:bg-gray-100 rounded-full relative"
            aria-label="Notifications"
          >
            <IoNotificationsOutline className="w-5 h-5" />
            <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <Link
            to="/profile"
            className="flex items-center text-gray-700 hover:bg-gray-100 rounded-full p-1"
            aria-label="Profile"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <CgProfile className="w-5 h-5" />
            </div>
          </Link>
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
        <button
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-full relative"
          aria-label="Notifications"
        >
          <IoNotificationsOutline className="w-5 h-5" />
          <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <Link
          to="/profile"
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
          aria-label="Profile"
        >
          <CgProfile className="w-5 h-5" />
        </Link>
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
