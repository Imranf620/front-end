import React, { Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./pages/Loader/Loader.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "./features/userSlice.js";
import ProtectedRoute from "./layout/ProtectedRoute.jsx";
import AdminRoute from "./layout/AdminRoute.jsx";

const Login = React.lazy(() => import("./pages/Login/Login"));
const NotFound = React.lazy(() => import("./pages/NotFound/NotFound"));
const SignUp = React.lazy(() => import("./pages/SignUp/SignUp"));
const Layout = React.lazy(() => import("./layout/Layout"));
const Dashboard = React.lazy(() => import("./pages/Dashboard/Dashboard"));
const Storage = React.lazy(() => import("./pages/Storage/Storage"));
const Bin = React.lazy(() => import("./pages/Bin/Bin.jsx"));
const Packages = React.lazy(() => import("./pages/Packages/Packages"));
const Profile = React.lazy(() => import("./pages/Profile/Profile.jsx"));
const Shared = React.lazy(() => import("./pages/Shared/Shared.jsx"));
const SingleFile = React.lazy(() => import("./pages/SingleFile/SingleFile.jsx"));
const MyShared = React.lazy(() => import("./pages/MyShared/MyShared.jsx"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard/AdminDashboard.jsx"));
const AllUsers = React.lazy(() => import("./pages/AllUsers/AllUsers.jsx"));


const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword/ForgotPassword.jsx"));


const App = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMyProfile());
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="dashboard/:type" element={<Storage />} />
            <Route path="packages" element={<Packages />} />
            <Route path="dashboard/all/accessible" element={<Shared />} />
            <Route path="dashboard/all/shared" element={<MyShared />} />
            <Route path="dashboard/shared/:id" element={<SingleFile />} />
            <Route path="dashboard/bin/all" element={<Bin />} />

            <Route element={<AdminRoute />}>
          <Route path="/admin/users" element={<AllUsers />} /> 
        </Route>

          </Route>  
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
