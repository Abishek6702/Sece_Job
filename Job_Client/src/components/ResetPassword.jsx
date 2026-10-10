import { useState } from "react";
// import reset from "../assets/resetpassword.png";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.svg";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { resetEmail, setResetEmail } = useAppContext();

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Reset failed");
      }

      setMessage(data.message || "Password reset successfully!");
   
      setNewPassword("");
      setConfirmPassword("");
      setResetEmail("");
      navigate("/")
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F4F5F7] font-sans px-4 py-8">
      <div className="bg-white rounded-[32px] p-10 md:p-14 shadow-xl w-full max-w-[550px] flex flex-col relative">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="w-48" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Reset Password</h2>
        <p className="text-gray-500 text-center mb-8">Create a new, secure password</p>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col relative">
            <label className="font-semibold text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border-2 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:bg-white transition-all border-gray-100 focus:border-blue-600 pr-12"
              />
              <button
                type="button"
                className="absolute right-[18px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col relative">
            <label className="font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full border-2 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:bg-white transition-all border-gray-100 focus:border-blue-600 pr-12"
              />
              <button
                type="button"
                className="absolute right-[18px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {message && <p className="text-green-500 font-medium text-center text-sm">{message}</p>}
          {error && <p className="text-red-500 font-medium text-center text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-[16px] cursor-pointer transition-all shadow-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
