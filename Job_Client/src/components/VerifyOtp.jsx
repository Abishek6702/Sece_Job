import React, { useState } from "react";
import image from "../assets/verifyotp.png";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import AutoCarousel from "./AutoCarousel";
import logo from "../assets/logomain.svg"

const VerifyOtp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { resetEmail } = useAppContext();

  const handleVerify = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-reset-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: resetEmail, otp }),
        }
      );

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          setError(errorData.message || "Invalid OTP.");
        } else {
          const text = await res.text();
          setError("Something went wrong: " + text);
        }
        setMessage("");
        return;
      }

      const data = await res.json();
      setMessage(data.message || "OTP verified successfully!");
      setError("");
      navigate("/reset-password");
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
      setMessage("");
      console.error(err);
    }
  };

  return (
    <div className="md:grid grid-cols-2">
      <div className="left-container flex items-center justify-center h-[100vh]">
        <div className="content-container w-[90%] mb-[25px] space-y-4">
          <div className="w-40">
          <img src={logo} alt="" />
        </div>
          <h1 className="text-[26px]">Verify Code</h1>
          <div className="space-y-4">
            <label className="text-[18px]">Enter Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter your OTP here"
              className="outline-none border border-gray-700 rounded-[6px] p-2 px-4 w-full text-[16px] mt-1"
            />

            <button
              onClick={handleVerify}
              className="w-full bg-blue-600 rounded-[6px] text-white p-[8px] text-[20px] font-semibold cursor-pointer"
            >
              Verify
            </button>
            {message && <p className="text-green-600 mt-2">{message}</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        </div>
      </div>
      <div className="right-container w-[100%] h-[100vh] hidden  lg:flex items-center justify-center">
        <AutoCarousel />
      </div>
    </div>
  );
};

export default VerifyOtp;
