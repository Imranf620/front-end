"use client";

import React, { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../features/userSlice";
import HomeNav from "../../components/homeNav/HomeNav";
import Footer from "../../components/footer/Footer";

const SignUp = () => {
  const { user, response, loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [num, setNum] = useState("");
  const [socials, setSocials] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (!email || !password || !name || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const data = { email, name, password };
    setIsLoading(true);
    dispatch(signUp(data));
    setIsLoading(false);
  };

  const handleGoogleSignUp = () => {
    toast.info("Google Sign-In clicked!");
  };

  useEffect(() => {
    if (response) {
      response?.success === false
        ? toast.error(response?.message)
        : toast.success(response?.message);
    }
    if (user) navigate("/home");
  }, [response, user]);

  return (
    <>
      <HomeNav />
      <div className="flex py-20 items-center justify-center min-h-screen bg-gray-100">
        <section className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-extrabold text-center text-[#7B1FA2] mb-6">
            Create Account
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Sign up to access your account
          </p>

          <div className="flex flex-col gap-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#9C27B0] outline-none"
                placeholder="Your name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#9C27B0] outline-none"
                placeholder="Your email"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#9C27B0] outline-none"
                placeholder="Your password"
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#9C27B0] outline-none"
                placeholder="Re-enter your password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Social Connection
              </label>

              <select
                name="Select"
                onChange={(e) => setSocials(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#9C27B0] outline-none"
              >
                <option value="Telegram" className="text-blue-500">
                  Telegram
                </option>
                <option value="Discord" className="text-green-500">
                  Discord
                </option>
                <option value="Skype" className="text-purple-500">
                  Skype
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Social Connection
              </label>
              <input
                type="text"
                value={num}
                onChange={(e) => setNum(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#9C27B0] outline-none"
                placeholder="Please enter your social ids"
              />
            </div>

            {/* Sign Up Button */}
            <Button
              variant="contained"
              color="secondary"
              className="w-full py-3 mt-4"
              onClick={handleSignUp}
            >
              {loading ? <CircularProgress /> : "Sign Up"}
            </Button>

            {/* OR Divider */}
            <div className="flex items-center gap-2 my-4">
              <hr className="flex-1 border-gray-300" />
              <span className="text-sm text-gray-500">OR</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            {/* Google Sign-Up */}
            <Button
              variant="outlined"
              color="secondary"
              className="w-full py-3 flex items-center justify-center gap-2"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignUp}
            >
              Sign Up with Google
            </Button>

            {/* Already Have Account */}
            <p className="text-center mt-4 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[#7B1FA2] font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
