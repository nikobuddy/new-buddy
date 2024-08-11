import React from "react";
import { FaCogs, FaShieldAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

interface DropdownProps {
  onClose: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ onClose }) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg">
      <div className="py-2">
        <Link
          to="/profile"
          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
          onClick={onClose}
        >
          <FaUser className="mr-3" /> Profile
        </Link>
        <Link
          to="/settings"
          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
          onClick={onClose}
        >
          <FaCogs className="mr-3" /> Settings
        </Link>
        <Link
          to="/roles"
          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
          onClick={onClose}
        >
          <FaShieldAlt className="mr-3" /> Roles
        </Link>
        <button
          onClick={onClose}
          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dropdown;
