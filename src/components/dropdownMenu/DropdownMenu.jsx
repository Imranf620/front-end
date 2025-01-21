import React, { useState, useRef } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "../../context/ThemeContext";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const DropdownMenu = ({ options }) => {
  const { isDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const iconRef = useRef(null);

  const toggleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      <button ref={iconRef} onClick={toggleMenu}>
        <MoreVertIcon style={{ color: isDarkMode ? "#ffffff" : "#000000" }} />
      </button>

      <Popper open={isMenuOpen} anchorEl={anchorEl} placement="bottom-end">
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            className={`w-40 border shadow-lg rounded-md ${
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
                onClick={() => {
                  option.onClick();
                  handleClose();
                }}
              >
                {option.label}
              </button>
            ))}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default DropdownMenu;
