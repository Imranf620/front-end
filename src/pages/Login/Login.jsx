"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import HomeNav from "../../components/homeNav/HomeNav";
import Footer from "../../components/footer/Footer";

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
   if(user){
     navigate('/')
   }
  }, [user])
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
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
    <HomeNav/>
    <div className="w-auto h-full flex">
      <section className="md:w-1/2 w-full h-max md:h-auto flex flex-col justify-center items-center bg-gray-50 p-10">
        <div className="w-3/4 max-w-md flex flex-col gap-6">
          <h2 className="text-3xl font-bold mb-4">Storify</h2>
          <h2 className="text-xl font-semibold">Welcome back!</h2>
          <p className="opacity-75 mb-4">Please enter your details</p>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border rounded outline-none focus:ring-1 focus:ring-[#9C27B0]"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border rounded outline-none focus:ring-1 focus:ring-[#9C27B0]"
              placeholder="Enter your password"
            />
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-[#7B1FA2] underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            variant="contained"
            color="secondary"
            className="w-full py-3 md:mt-4 text-lg"
            onClick={handleLogin}
          >
            Sign In
          </Button>

          <div className="flex items-center gap-4 md:my-6">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-500">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <Button
            variant="outlined"
            color="secondary"
            className="w-full py-3 flex items-center justify-center gap-2"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </Button>

          <div className="mt-4 text-center">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#7B1FA2] underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="w-1/2 hidden md:block">
        <img
          src="./hand.jpg"
          alt="Sign In"
          className="w-full h-full object-cover"
        />
      </section>
    </div>
    <Footer/>
    </>


  );
};

export default Login;
