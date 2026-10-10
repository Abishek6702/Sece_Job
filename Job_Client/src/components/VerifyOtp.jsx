import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import logo from "../assets/logo.svg";

const VerifyOtp = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { resetEmail } = useAppContext();

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError("OTP is required.");
      setMessage("");
      return;
    }

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
    <div className="flex items-center justify-center min-h-screen bg-[#F4F5F7] font-sans px-4 py-8">
      <div className="bg-white rounded-[32px] p-10 md:p-14 shadow-xl w-full max-w-[550px] flex flex-col relative">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="w-48" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Verify Code</h2>
        <p className="text-gray-500 text-center mb-8">Enter the code sent to your email</p>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">Enter Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter your OTP here"
              className="w-full border-2 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:bg-white transition-all border-gray-100 focus:border-blue-600"
            />
          </div>

          <button
            onClick={handleVerify}
            className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-[16px] cursor-pointer transition-all shadow-md"
          >
            Verify
          </button>
          
          {message && <p className="text-green-500 font-medium text-center mt-2 text-sm">{message}</p>}
          {error && <p className="text-red-500 font-medium text-center mt-2 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
