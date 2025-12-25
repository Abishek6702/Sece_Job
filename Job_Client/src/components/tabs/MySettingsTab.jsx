import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  KeyRound,
  MailCheck,
  Key,
  Unlock,
  CheckCircle2,
  LogOut,
  XCircle,
  EyeOff,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function MySettingsTab() {
  const token = localStorage.getItem("token");
  let email = "";
  try {
    email = jwtDecode(token)?.email || "";
  } catch {
  }

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function sendOtp(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/send-change-password-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      toast.success("OTP sent to your email address.");
      setStep(2);
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-change-password-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid or expired OTP");
      toast.success("OTP verified. Enter your current password.");
      setStep(3);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, newPassword }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      toast.success("Password changed!");
      setStep(1);
      setOtp("");
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
      setShowLogoutModal(true); 
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  

  return (
    <div className=" mx-auto min-h-[350px]">
      <h2 className="font-bold text-xl  flex items-center gap-3 text-blue-800 mb-4">
        <KeyRound className="text-blue-800" /> Change Passowrd
      </h2>
      <div className=" mb-6" />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          {step === 1 && (
            <form onSubmit={sendOtp} className=" mx-auto   rounded-lg">
              <p className="text-sm text-gray-500 mb-4">
                Enter the email address you used to register with.
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50 mb-2">
                <MailCheck className="text-gray-400" />
                <input
                  value={email}
                  readOnly
                  className="ml-2 w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                  tabIndex={-1}
                />
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold disabled:opacity-70"
                >
                  {loading ? "Sending OTP..." : "Send Instructions"}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form
              onSubmit={verifyOtp}
              className="max-w-md  rounded-lg  space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  Verify OTP
                </h2>
                <p className="text-sm text-gray-500">
                  Enter the 6-digit OTP sent to your email address.
                </p>
              </div>

              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  One-Time Password
                </label>
                <input
                  id="otp"
                  value={otp}
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest text-lg font-mono"
                  placeholder="••••••"
                  required
                />
              </div>

              <div className="flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold disabled:opacity-70"
                >
                  Resend OTP
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold disabled:opacity-70"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                
              </div>
            </form>
          )}

          {step === 3 && (
            <form
              onSubmit={changePassword}
              className="max-w-md rounded-lg space-y-4"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  Set a new password
                </h2>
                <p className="text-sm text-gray-500">
                  Your new password must be at least 8 characters long.
                </p>
              </div>

              <div className="relative">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  type={showConfirm ? "text" : "password"}
                  minLength={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="Re-enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-9 text-gray-500"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold shadow flex justify-center items-center disabled:opacity-70"
              >
                <Unlock size={18} className="mr-2" />
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          )}

          {showLogoutModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm border border-gray-200 text-center flex flex-col items-center">
                <XCircle className="text-orange-500 mb-2" size={48} />
                <h3 className="text-lg font-bold mb-2">
                  You've changed your password
                </h3>
                <p className="text-gray-600 mb-6">
                  For your safety, you should logout and login again.
                </p>
                <div className="flex gap-4 items-center justify-center">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold flex gap-2 items-center"
                    onClick={() => {
                      localStorage.removeItem("token");
                      setShowLogoutModal(false);
                      navigate("/"); 
                    }}
                  >
                    <LogOut size={20} /> Logout
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg border font-semibold text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowLogoutModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
