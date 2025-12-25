import React, { useState } from "react";
import image from "../assets/forgotpassword.png";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import AutoCarousel from "./AutoCarousel";
import logo from "../assets/logomain.svg"

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { setResetEmail } = useAppContext();
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showMessage("error", "Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/send-reset-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      showMessage("success", "OTP has been sent to your email.");
      setResetEmail(email);
      setEmail(""); 
      navigate("/verify-otp")
    } catch (err) {
      showMessage("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:grid grid-cols-2 bg-gray-50">
      <div className="Left-container   h-[100vh] flex items-center justify-center">
        <div className="content-container w-[90%] p-[8px] mb-[25px] space-y-4">
          <div className="w-40">
          <img src={logo} alt="" />
        </div>
          <h1 className="text-[26px]">Forgot Password</h1>

          <div className="input-fields space-y-5">
            <label htmlFor="email" className="text-[18px]">
              E-mail Id
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="outline-none border border-gray-300 focus:border-[#155dfc] focus:border-2 rounded-[6px] p-2 px-4 w-full text-[16px] mt-1"
              placeholder="Enter your email-Id"
            />

            {message.text && (
              <p
                className={`text-sm ${
                  message.type === "success" ? "text-blue-600" : "text-red-600"
                }`}
              >
                {message.text}
              </p>
            )}

            <button
              className="w-full bg-blue-600 rounded-[6px] text-white p-[8px] text-[20px] font-semibold cursor-pointer"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          </div>
        </div>
      </div>

      <div className="right-container  w-[100%] h-[100vh] hidden  lg:flex items-center justify-center">
        <AutoCarousel />
      </div>
    </div>
  );
};

export default ForgotPassword;
