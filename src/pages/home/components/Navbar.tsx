import React, { useRef, useState } from "react";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import Dropdown from "./Dropdown";
import { useOnClickOutside } from "./useOnClickOutside";

const Navbar: React.FC = () => {
  const { user, userName, userType, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleUserIconClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Optionally redirect or show a message on successful logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white py-2 px-4 shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/src/assets/tplogo.png"
            alt="Logo"
            className="h-16 w-auto"
          />
          <span className="text-2xl font-semibold">SupplyChain</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-grow max-w-xl relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full p-2 pl-10 rounded-full border-none bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* User Info and Navigation */}
        <div className="flex items-center space-x-6">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleUserIconClick}
                className="flex items-center space-x-2 text-white hover:text-orange-500"
              >
                <FaUserCircle className="w-6 h-6" />
                <div className="hidden lg:inline text-sm font-medium">
                  <span>Hey, {userName || "Username"}</span>
                  <span className="block text-xs text-gray-300">
                    {userType || "Role"}
                  </span>
                </div>
                <FaChevronDown
                  className={`transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <Dropdown onClose={() => setIsDropdownOpen(false)} />
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-white hover:text-orange-300 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white hover:text-orange-300 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          <Link
            to="/orders"
            className="text-white hover:text-orange-300 transition-colors"
          >
            Order
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center text-white hover:text-orange-300 transition-colors"
          >
            <span className="w-6 h-6">🛒</span>
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>

          {user && (
            <button
              onClick={handleLogout}
              className="text-white hover:text-orange-300 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
