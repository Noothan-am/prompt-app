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
import { FiFileText, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const [isEcommerceOpen, setIsEcommerceOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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

      {/* Collapse Button (visible only on desktop) - positioned on the side */}
      <button
        onClick={toggleCollapse}
        className="hidden lg:flex fixed z-30 top-[70px] bg-white border border-gray-200 p-1 shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out"
        style={{
          left: isCollapsed ? "70px" : "272px",
          borderTopRightRadius: "6px",
          borderBottomRightRadius: "6px",
          borderLeft: 0,
        }}
      >
        {isCollapsed ? (
          <FiChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <FiChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-full bg-white border-r border-gray-200 flex-shrink-0 transform transition-all duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-20 ${isCollapsed ? "w-[70px]" : "w-[272px]"}`}
      >
        <nav className="flex flex-col h-full">
          <div className="pt-20 lg:pt-4 px-2 flex-1">
            <div className="space-y-2">
              {/* Dashboard */}
              <Link
                to="/dashboard"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg ${
                  isCollapsed ? "justify-center" : "text-lg"
                }`}
              >
                <RiDashboardLine className="w-6 h-6 flex-shrink-0" />
                {!isCollapsed && <span className="ml-4">Dashboard</span>}
              </Link>

              {/* Prompts Dashboard */}
              <Link
                to="/prompts"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg ${
                  isCollapsed ? "justify-center" : "text-lg"
                }`}
              >
                <FiFileText className="w-6 h-6 flex-shrink-0" />
                {!isCollapsed && <span className="ml-4">Prompts</span>}
              </Link>

              {/* Communities */}
              <Link
                to="/communities"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg ${
                  isCollapsed ? "justify-center" : "text-lg"
                }`}
              >
                <HiUserGroup className="w-6 h-6 flex-shrink-0" />
                {!isCollapsed && <span className="ml-4">Communities</span>}
              </Link>

              {/* E-Commerce with dropdown */}
              <div>
                <button
                  onClick={() =>
                    !isCollapsed && setIsEcommerceOpen(!isEcommerceOpen)
                  }
                  className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg ${
                    isCollapsed ? "justify-center" : "text-lg justify-between"
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      isCollapsed ? "justify-center w-full" : ""
                    }`}
                  >
                    <BsShop className="w-6 h-6 flex-shrink-0" />
                    {!isCollapsed && <span className="ml-4">E-Commerce</span>}
                  </div>
                  {!isCollapsed && (
                    <IoChevronDownOutline
                      className={`w-5 h-5 transition-transform flex-shrink-0 ${
                        isEcommerceOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
                {/* Dropdown content can be added here */}
              </div>

              {/* Inbox */}
              <Link
                to="/inbox"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg ${
                  isCollapsed ? "justify-center" : "text-lg justify-between"
                } relative`}
              >
                <div
                  className={`flex items-center ${
                    isCollapsed ? "justify-center w-full" : ""
                  }`}
                >
                  <HiInbox className="w-6 h-6 flex-shrink-0" />
                  {!isCollapsed && <span className="ml-4">Inbox</span>}
                </div>
                {!isCollapsed && (
                  <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full flex-shrink-0">
                    14
                  </span>
                )}
                {isCollapsed && (
                  <span className="absolute top-0 right-0 bg-gray-100 text-gray-600 text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    14
                  </span>
                )}
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg ${
                  isCollapsed ? "justify-center" : "text-lg"
                }`}
              >
                <CgProfile className="w-6 h-6 flex-shrink-0" />
                {!isCollapsed && <span className="ml-4">Profile</span>}
              </Link>

              {/* Settings */}
              <Link
                to="/settings"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg ${
                  isCollapsed ? "justify-center" : "text-lg"
                }`}
              >
                <IoSettingsOutline className="w-6 h-6 flex-shrink-0" />
                {!isCollapsed && <span className="ml-4">Settings</span>}
              </Link>

              {/* Notification Demo */}
              <Link
                to="/notifications"
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg ${
                  isCollapsed ? "justify-center" : "text-lg"
                }`}
              >
                <IoNotificationsOutline className="w-6 h-6 flex-shrink-0" />
                {!isCollapsed && <span className="ml-4">Notifications</span>}
              </Link>
            </div>
          </div>

          {/* Logout at the bottom */}
          <div className="border-t border-gray-200 p-4 mt-auto">
            <button
              className={`w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg ${
                isCollapsed ? "justify-center" : "text-lg"
              }`}
            >
              <IoLogOutOutline className="w-6 h-6 flex-shrink-0" />
              {!isCollapsed && <span className="ml-4">Log Out</span>}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
