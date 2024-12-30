import React, { Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./pages/Loader/Loader.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile } from "./features/userSlice.js";
import ProtectedRoute from "./layout/ProtectedRoute.jsx";
import AdminRoute from "./layout/AdminRoute.jsx";

const Login = React.lazy(() => import("./pages/Login/Login.jsx"));
const NotFound = React.lazy(() => import("./pages/NotFound/NotFound.jsx"));
const SignUp = React.lazy(() => import("./pages/SignUp/SignUp.jsx"));
const Layout = React.lazy(() => import("./layout/Layout.jsx"));
const Dashboard = React.lazy(() => import("./pages/Dashboard/Dashboard.jsx"));
const Storage = React.lazy(() => import("./pages/Storage/Storage.jsx"));
const Bin = React.lazy(() => import("./pages/Bin/Bin.jsx"));
const Packages = React.lazy(() => import("./pages/Packages/Packages.jsx"));
const Profile = React.lazy(() => import("./pages/Profile/Profile.jsx"));
const Shared = React.lazy(() => import("./pages/Shared/Shared.jsx"));
const SingleFile = React.lazy(() => import("./pages/SingleFile/SingleFile.jsx"));
const MyShared = React.lazy(() => import("./pages/MyShared/MyShared.jsx"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard/AdminDashboard.jsx"));
const AllUsers = React.lazy(() => import("./pages/AllUsers/AllUsers.jsx"));
const UserFiles = React.lazy(() => import("./pages/UserFiles/UserFiles.jsx"));
const UserProfile = React.lazy(() => import("./pages/UserProfile/UserProfile.jsx"));
const HomePage = React.lazy(() => import("./pages/HomePage/HomePage.jsx"));
const Pricing = React.lazy(() => import("./pages/Pricing/Pricing.jsx"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword/ForgotPassword.jsx"));
const Folders = React.lazy(() => import("./pages/Folders/Folders.jsx"));
const SingleFolder = React.lazy(() => import("./pages/SingleFolder/SingleFolder.jsx"));


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home/:fileId" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        
        {/* <Route path="/pricing" element={<Pricing />} /> */}

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="dashboard/:type" element={<Storage />} />
            {/* <Route path="packages" element={<Packages />} /> */}
            <Route path="dashboard/all/accessible" element={<Shared />} />
            <Route path="dashboard/all/shared" element={<MyShared />} />
            <Route path="dashboard/shared/:id" element={<SingleFile />} />
            <Route path="dashboard/bin/all" element={<Bin />} />
            <Route path="dashboard/folders/all" element={<Folders />} />
            <Route path="dashboard/folders/all/:id" element={<SingleFolder />} />


            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={<AllUsers />} />
              <Route path="/admin/files" element={<UserFiles />} />
              <Route path="/admin/user/:userId" element={<UserProfile />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
