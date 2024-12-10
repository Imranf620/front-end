import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);

  console.log(user)

  if (user?.user?.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return <Outlet />; 
};

export default AdminRoute;
