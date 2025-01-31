"use client";

import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../features/userSlice";
import HomeNav from "../../components/homeNav/HomeNav";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpTimer]);

  const handleEmailSubmit = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const result = await dispatch(forgotPassword({ email }));
      if (result.payload?.success) {
        toast.success(result.payload.message || "OTP sent successfully!");
        setStep(2);
        setOtpTimer(300); // OTP is valid for 5 minutes
      } else {
        toast.error(result.payload?.message || "Error sending OTP.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred.");
    }
    setLoading(false);
  };

  const handleOtpSubmit = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const result = await dispatch(resetPassword({ resetToken: otp }));
      if (result.payload?.success) {
        toast.success(result.payload.message || "OTP verified successfully!");
        setStep(3);
      } else {
        toast.error(result.payload?.message || "Invalid OTP or expired.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred.");
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async () => {
    if (!password) {
      toast.error("Please enter your new password.");
      return;
    }
    setLoading(true);
    try {
      const result = await dispatch(resetPassword({ resetToken: otp, password }));
      if (result.payload?.success) {
        toast.success(result.payload.message || "Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(result.payload?.message || "Error resetting password.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred.");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0) {
      toast.info("OTP already sent, please wait for it to expire.");
      return;
    }
    setLoading(true);
    try {
      const result = await dispatch(forgotPassword({ email }));
      if (result.payload?.success) {
        toast.success(result.payload.message || "OTP resent successfully!");
        setOtpTimer(300); // Reset timer for 5 minutes
      } else {
        toast.error(result.payload?.message || "Error sending OTP.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred.");
    }
    setLoading(false);
  };

  return (
    <>
      <HomeNav />
      <div className="w-screen h-screen flex">
        <section className="w-full h-max md:h-auto flex flex-col justify-center items-center bg-gray-50 p-10">
          <div className="w-3/4 max-w-md flex flex-col gap-6">
            <h2 className="text-3xl font-bold mb-4">Gofilez</h2>
            <h2 className="text-xl font-semibold mb-2">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Enter OTP"}
              {step === 3 && "Reset Password"}
            </h2>
            {step === 1 && (
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
                <Button
                  variant="contained"
                  color="secondary"
                  className="w-full py-3 mt-4"
                  onClick={handleEmailSubmit}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Send OTP"}
                </Button>
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm" htmlFor="otp">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="p-3 border rounded outline-none focus:ring-1 focus:ring-[#9C27B0]"
                  placeholder="Enter the OTP sent to your email"
                />
                {otpTimer > 0 && (
                  <Typography variant="body2" color="textSecondary" className="mt-2">
                    Please wait, OTP can take up to 5 minutes to send.
                    <br />
                    OTP will expire in {Math.floor(otpTimer / 60)}:{otpTimer % 60 < 10 ? "0" : ""}{otpTimer % 60}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="secondary"
                  className="w-full py-3 mt-4"
                  onClick={handleOtpSubmit}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Verify OTP"}
                </Button>
                <Button
                  variant="text"
                  className="mt-2 text-[#9C27B0]"
                  onClick={handleResendOtp}
                  disabled={loading || otpTimer > 0}
                >
                  Resend OTP
                </Button>
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm" htmlFor="password">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 border rounded outline-none focus:ring-1 focus:ring-[#9C27B0]"
                  placeholder="Enter your new password"
                />
                <div className="text-right text-[#7B1FA2] cursor-pointer mt-2">
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Hide" : "Show"} Password
                  </span>
                </div>
                <Button
                  variant="contained"
                  color="secondary"
                  className="w-full py-3 mt-4"
                  onClick={handlePasswordSubmit}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Reset Password"}
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default ForgotPassword;
