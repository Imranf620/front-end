import React, { useState, useEffect, useRef, Suspense } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Loader from "../pages/Loader/Loader";

const Navbar = React.lazy(() => import("../components/navbar/Navbar"));
const SideBar = React.lazy(() => import("../components/sidebar/SideBar"));

const Layout = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [show, setShow] = useState(false);
  const sidebarRef = useRef(null); 
  const navbarRef = useRef(null);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  const handleToggle = () => setShow(!show);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !navbarRef.current.contains(event.target)) {
        setShow(false); // Close the sidebar
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="flex flex-col">
        <div ref={navbarRef}>
          <Suspense fallback={<Loader/>}>
            <Navbar
              handleToggle={handleToggle}
              toggleDarkMode={toggleDarkMode}
              isDarkMode={isDarkMode}
            />
          </Suspense>
        </div>
        <div className="flex h-[91.4vh] overflow-y-hidden">
          <div
            ref={sidebarRef} 
            className={`z-50 lg:w-64 duration-300 fixed lg:static top-0 left-0 w-0 ${
              show
                ? "translate-x-0 lg:w-64"
                : "w-0 -translate-x-64 lg:translate-x-0"
            }`}
          >
            <Suspense fallback={<Loader/>}>
              <SideBar handleToggle={handleToggle} />
            </Suspense>
          </div>
          <div className={`flex-1 p-4 h-full overflow-y-auto ${isDarkMode ? "bg-black" : "bg-gray-200"}`}>
            <Outlet />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
