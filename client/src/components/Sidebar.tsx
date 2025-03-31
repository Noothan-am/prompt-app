import React, { useState } from "react";
import { Link } from "react-router-dom";

// You'll need to install react-icons: npm install react-icons
import { RiDashboardLine } from "react-icons/ri";
import { BsShop } from "react-icons/bs";
import { HiInbox } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { IoChevronDownOutline } from "react-icons/io5";
import { HiMenuAlt2 } from "react-icons/hi";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [isEcommerceOpen, setIsEcommerceOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md hover:bg-gray-100"
      >
        <HiMenuAlt2 className="w-6 h-6" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ top: "64px" }}
      >
        <nav className="flex-1 mt-10 overflow-y-auto">
          <div className="px-4 py-2">
            {/* Dashboard */}
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-2 text-lg"
            >
              <RiDashboardLine className="w-6 h-6 mr-4" />
              <span>Dashboard</span>
            </Link>

            {/* E-Commerce with dropdown */}
            <div>
              <button
                onClick={() => setIsEcommerceOpen(!isEcommerceOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-2 text-lg"
              >
                <div className="flex items-center">
                  <BsShop className="w-6 h-6 mr-4" />
                  <span>E-Commerce</span>
                </div>
                <IoChevronDownOutline
                  className={`w-5 h-5 transition-transform ${
                    isEcommerceOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {/* Dropdown content can be added here */}
            </div>

            {/* Inbox */}
            <Link
              to="/inbox"
              className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-2 text-lg"
            >
              <div className="flex items-center">
                <HiInbox className="w-6 h-6 mr-4" />
                <span>Inbox</span>
              </div>
              <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                14
              </span>
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-2 text-lg"
            >
              <CgProfile className="w-6 h-6 mr-4" />
              <span>Profile</span>
            </Link>

            {/* Settings */}
            <Link
              to="/settings"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-2 text-lg"
            >
              <IoSettingsOutline className="w-6 h-6 mr-4" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        {/* Logout at the bottom */}
        <div className="border-t border-gray-200 p-4">
          <button className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg text-lg">
            <IoLogOutOutline className="w-6 h-6 mr-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
