import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  IoSearchOutline,
  IoNotificationsOutline,
  IoMenuOutline,
} from "react-icons/io5";
import { BsChatDots } from "react-icons/bs";
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
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8 z-50">
        {/* Left section - Logo and Menu */}
        <div className="flex items-center gap-5">
          <button
            onClick={toggleSidebar}
            className="p-3 text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <IoMenuOutline className="w-8 h-8" />
          </button>
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Logo
          </Link>
        </div>

        {/* Search Bar - Full on desktop, simplified on mobile */}
        <div className="flex-1 max-w-3xl mx-4 lg:mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-12 pl-12 pr-6 text-lg text-gray-700 placeholder-gray-500 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          </div>
        </div>

        {/* Desktop Only - Right section */}
        <div className="hidden lg:flex items-center space-x-6">
          <button
            onClick={toggleChatModal}
            className="p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <BsChatDots className="w-8 h-8" />
          </button>
          <button className="p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <IoNotificationsOutline className="w-8 h-8" />
          </button>
          <button className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </button>
        </div>
      </nav>

      {/* Mobile Footer Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 flex items-center justify-around px-6 z-50">
        <button
          onClick={toggleChatModal}
          className="p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <BsChatDots className="w-8 h-8" />
        </button>
        <button className="p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
          <IoNotificationsOutline className="w-8 h-8" />
        </button>
        <button className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </button>
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
