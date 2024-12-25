import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from "react-router-dom";

const HomeNav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [visible, setVisible] = useState(false); 
  const location = useLocation(); 

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleScroll = () => {
    if ((location.pathname === "/login" || location.pathname === "/signup")) {
      setIsScrolled(true);
      return;
    }
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
    <div className="">
      <div
        onClick={() => setVisible(!visible)}
        className="z-[99999] fixed top-4 right-2 md:hidden cursor-pointer"
      >
        {visible ? (
          <CloseIcon  fontSize="large" className={` ${isScrolled?"text-black":"text-white"}   p-2 rounded-full`}/>
        ) : (
          <MenuIcon fontSize="large"  className={` ${isScrolled?"text-black":"text-white"}   p-2 rounded-full`} />
        )}
      </div>
      
      {/* Navigation Bar */}
      <nav
        className={`fixed ${visible ? "top-0" : "top-[-100vh]"} duration-300 left-0 h-full md:top-0 md:left-0 w-full text-white bg-black bg-opacity-80 ${
          isScrolled ? " md:h-16" : " md:h-20"
        } shadow-lg transition-all duration-300 z-50 ease-in-out`}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold transition-all duration-300 transform hover:scale-105">
            Storify
          </h1>

          {/* Navigation Links */}
          <ul
            className={`${
              visible ? "flex flex-col" : "hidden"
            } md:flex md:flex-row md:space-x-6 space-y-4 md:space-y-0 absolute md:static top-16 left-0 w-full md:w-auto bg-black bg-opacity-90 md:bg-transparent p-6 md:p-0`}
          >
            {/* <li className="relative">
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
            </li> */}
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
          
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default HomeNav;
