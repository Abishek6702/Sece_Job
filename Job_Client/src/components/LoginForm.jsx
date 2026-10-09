import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/logo.svg";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

function autoRedirectBasedOnToken(navigate) {
  const token = localStorage.getItem("carvion-key");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp > currentTime) {
        const role = decoded.role;
        const onboardingComplete = decoded.onboardingstatus;
        switch (role) {
          case "admin":
            navigate("/admin-dashboard");
            return;
          case "employee":
            if (onboardingComplete) {
              navigate("/employee-dashboard");
            } else {
              navigate("/onbordingform");
            }
            return;
          case "employer":
            navigate("/employer-dashboard");
            return;
          default:
            navigate("/");
            return;
        }
      } else {
        localStorage.removeItem("carvion-key");
        navigate("/");
      }
    } catch (e) {
      localStorage.removeItem("carvion-key");
      navigate("/");
    }
  } else {
    navigate("/");
  }
}

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [visitorCount, setVisitorCount] = useState(null);
  useEffect(() => {
    autoRedirectBasedOnToken(navigate);
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        // Check if it's a pending approval error
        if (data.status === "PENDING_APPROVAL") {
          setError(
            "Your account is pending admin approval. Please wait for approval to login.",
          );
          toast.error("Account pending admin approval");
          return;
        }
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("carvion-key", data.token);

      autoRedirectBasedOnToken(navigate);

      toast.success("Login Sucessfull");
      setSuccess("Login successful!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/first-time-login-count`,
        );
        if (!res.ok) throw new Error("Failed to fetch visitor count");
        const data = await res.json();
        setVisitorCount(data.count); // assuming API returns { count: number }
      } catch (err) {
        console.error(err);
        setVisitorCount(0);
      }
    };

    fetchVisitorCount();
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F4F5F7] font-sans px-4">
      <div className="bg-white rounded-[32px] p-10 md:p-14 shadow-xl w-full max-w-[550px] flex flex-col relative">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="w-48" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Login to your account to continue
        </p>

        <form className="login-form flex flex-col gap-5" onSubmit={handleLogin}>
          <div className="email flex flex-col">
            <label htmlFor="email" className="font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border-2 border-gray-100 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          <div className="password flex flex-col relative">
            <label
              htmlFor="password"
              className="font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border-2 border-gray-100 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all pr-12"
            />
            <div className="absolute bottom-[14px] right-[18px] text-gray-400 hover:text-gray-600 transition-colors">
              {showPassword ? (
                <EyeOff
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link to="/forget-password">
              <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors">
                Forgot Password?
              </span>
            </Link>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-500 text-sm font-medium text-center">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-[16px] cursor-pointer transition-all shadow-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="w-full mt-6 text-center text-[15px] text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup">
              <span className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer transition-colors">
                Sign Up
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
