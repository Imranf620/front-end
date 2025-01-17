import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { fetchMyProfile } from "../features/userSlice";
import Loader from "../pages/Loader/Loader";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await dispatch(fetchMyProfile());
        if (result.payload?.data?.user) {
       
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    getUser();
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }
  return user ? <Outlet /> : <Navigate to="/home" />;
};

export default ProtectedRoute;
