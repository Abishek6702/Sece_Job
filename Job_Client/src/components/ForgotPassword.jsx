import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import logo from "../assets/logo.svg";

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
    if (!email.trim()) {
      showMessage("error", "Email is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      showMessage("error", "Email is invalid.");
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
    <div className="flex items-center justify-center min-h-screen bg-[#F4F5F7] font-sans px-4 py-8">
      <div className="bg-white rounded-[32px] p-10 md:p-14 shadow-xl w-full max-w-[550px] flex flex-col relative">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="w-48" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Forgot Password</h2>
        <p className="text-gray-500 text-center mb-8">Enter your email to receive an OTP</p>

        <div className="input-fields flex flex-col gap-5">
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:bg-white transition-all border-gray-100 focus:border-blue-600"
              placeholder="Enter your email"
            />
          </div>

          {message.text && (
            <p className={`text-sm font-medium text-center ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
              {message.text}
            </p>
          )}

          <button
            className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-[16px] cursor-pointer transition-all shadow-md"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Get OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
