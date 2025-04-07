import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FiLogIn, FiLogOut, FiUser, FiUsers } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, isAuthenticated, logout, loginAsCommunityManager } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle click events on the dropdown to prevent them from bubbling up
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle login action
  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation();
    onClose();

    // Navigate programmatically to ensure proper handling
    setTimeout(() => {
      navigate("/login");
    }, 100);
  };

  // Handle logout action
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default button behavior
    e.stopPropagation();
    onClose();

    logout();
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  // Handle profile navigation
  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation();
    onClose();

    setTimeout(() => {
      navigate("/profile");
    }, 100);
  };

  // Handle community manager login
  const handleCommunityManagerLogin = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation();
    onClose();

    loginAsCommunityManager();
    setTimeout(() => {
      navigate("/community-manager");
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      onClick={handleDropdownClick}
      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200 transition-all duration-150 ease-in-out"
      style={{
        top: "100%",
        maxWidth: "calc(100vw - 32px)", // Prevent overflow on small devices
      }}
    >
      {isAuthenticated ? (
        <>
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 mb-1">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
          <a
            href="/profile"
            onClick={handleProfileClick}
            className="flex w-full items-center px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FiUser className="mr-3 h-5 w-5 text-gray-500" />
            <span>My Profile</span>
          </a>
          <a
            href="/community-manager"
            onClick={handleCommunityManagerLogin}
            className="flex w-full items-center px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FiUsers className="mr-3 h-5 w-5 text-gray-500" />
            <span>Login as Community Manager</span>
          </a>
          <div className="border-t border-gray-100 my-1.5"></div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-5 py-3.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="mr-3 h-5 w-5 text-red-500" />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <a
          href="/login"
          onClick={handleLogin}
          className="flex w-full items-center px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <FiLogIn className="mr-3 h-5 w-5 text-gray-500" />
          <span>Login</span>
        </a>
      )}
    </div>
  );
};

export default ProfileDropdown;
