import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/userSlice";
import HomeNav from "../../components/homeNav/HomeNav";
import Footer from "../../components/footer/Footer";

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    try {
      const result = await dispatch(login({ email, password }));
      if (result.payload?.success) {
        toast.success(result.payload.message || "Logged in successfully!");
      } else {
        toast.error(result.payload?.message || "Login failed.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during login.");
    }
  };

  const handleGoogleSignIn = () => {
    toast.info("Google Sign-In clicked!");
  };

  return (
    <>
      <HomeNav />
      <div
        className={`w-full min-h-screen flex justify-center items-center px-4 ${
          isScrolled ? "bg-gray-100" : "bg-white"
        } transition-colors duration-300`}
      >
        <section className="w-full my-20 max-w-lg p-6 md:p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#7B1FA2]">
            Gofilez
          </h2>
          <h3 className="text-xl font-semibold text-center mb-4 text-gray-700">
            Welcome back!
          </h3>
          <p className="text-gray-500 text-center mb-6">
            Please enter your details to log in
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="font-medium text-sm mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="p-3 border rounded-md outline-none focus:ring-2 focus:ring-[#9C27B0]"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col">
              <label className="font-medium text-sm mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="p-3 border rounded-md outline-none focus:ring-2 focus:ring-[#9C27B0]"
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-[#7B1FA2] text-sm hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              variant="contained"
              color="secondary"
              className="w-full py-3 text-lg capitalize"
              onClick={handleLogin}
              sx={{ backgroundColor: "#7B1FA2", "&:hover": { backgroundColor: "#6A1B9A" } }}
            >
              Sign In
            </Button>

            {/* OR Divider */}
            <div className="flex items-center gap-4 my-4">
              <hr className="flex-1 border-gray-300" />
              <span className="text-gray-500">OR</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            {/* Google Sign-In */}
            <Button
              variant="outlined"
              color="secondary"
              className="w-full py-3 flex items-center justify-center gap-2 capitalize"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              sx={{ color: "#7B1FA2", borderColor: "#9C27B0" }}
            >
              Sign in with Google
            </Button>

            {/* Sign Up Redirect */}
            <div className="mt-4 text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#7B1FA2] hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Login;
