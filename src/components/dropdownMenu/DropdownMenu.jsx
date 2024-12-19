import React, { useState, useEffect, useRef } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "../../context/ThemeContext";

const DropdownMenu = ({ options }) => {
  const { isDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !iconRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-[200]">
    
      <button ref={iconRef} onClick={toggleMenu}>
        <MoreVertIcon
          style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
        />
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div
          ref={dropdownRef}
          className={`absolute right-0 mt-2 w-40 border shadow-lg rounded-md ${
            isDarkMode
              ? "bg-[#303030] border-gray-700 text-white"
              : "bg-white border-gray-200 text-gray-600"
          }`}
        >
          {options.map((option, index) => (
            <button
              key={index}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-opacity-80 ${
                isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
              }`}
              onClick={option.onClick}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
