import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const HomeNav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation(); // To detect route changes

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Reset scroll state on route change
    setIsScrolled(false);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 w-full text-white  ${
          isScrolled ? "bg-black bg-opacity-80 h-16" : "bg-opacity-100 h-20"
        } shadow-lg transition-all duration-300 z-50 ease-in-out`}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold transition-all duration-300 transform hover:scale-105">
            Storify
          </h1>
          <ul className="flex space-x-6">
            <li className="relative">
              <div className="dropdown">
                <button
                  onMouseEnter={toggleDropdown}
                  onMouseLeave={toggleDropdown}
                  className="bg-transparent border-none cursor-pointer hover:text-gray-400 transition-all ease-in-out"
                >
                  Get App
                </button>
                {isDropdownOpen && (
                  <ul className="absolute top-full left-0 mt-2 bg-black bg-opacity-90 shadow-lg rounded-md w-40">
                    <li>
                      <Link
                        to="/get-app/mobile"
                        className="block px-4 py-2 text-white hover:bg-gray-800 transition-all duration-200"
                      >
                        Mobile App
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/get-app/desktop"
                        className="block px-4 py-2 text-white hover:bg-gray-800 transition-all duration-200"
                      >
                        Desktop App
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li>
              <Link
                to="/home"
                className="hover:text-gray-400 transition-all duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="hover:text-gray-400 transition-all duration-200"
              >
                Login
              </Link>
            </li>

            <li>
              <Link
                to="/signup"
                className="hover:text-gray-400 transition-all duration-200"
              >
                Signup
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="hover:text-gray-400 transition-all duration-200"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/start"
                className="hover:text-gray-400 transition-all duration-200"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default HomeNav;
