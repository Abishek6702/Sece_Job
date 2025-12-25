import React, { useEffect, useState } from "react";
import login_img from "../assets/login.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AutoCarousel from "./AutoCarousel";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import logo from "../assets/logomain.svg";
import bgimg from "../assets/bgimg.jpg";
import AutoCarousel1 from "./AutoCarousel1";
function autoRedirectBasedOnToken(navigate) {
  const token = localStorage.getItem("token");
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
              navigate("/feeds");
            } else {
              navigate("/onbordingform");
            }
            return;
          case "employer":
            navigate("/employer-dashboard");
            return;
          case "instructor":
            navigate("/instructor-dashboard");
            return;
          default:
            navigate("/login");
            return;
        }
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (e) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  } else {
    navigate("/login");
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
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);

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
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/first-time-login-count`
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
    <div className="main-container flex items-center justify-between gap-8 bg-gray-50 ">
      <div className="left-container w-[100%]  lg:w-[45%] h-[100vh] flex items-center justify-center   m-auto ">
        <div className="content-container w-[90%] m-auto ">
          <div className=" w-40 ">
            <img src={logo} className="" />
          </div>
          <p className="text-[32px] font-medium">Login to your account</p>

          <form className="login-form mt-[25px]" onSubmit={handleLogin}>
            <div className="email mb-2">
              <label htmlFor="email" className=" font-medium text-gray-700">
                E-mail Id
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email-Id"
                className="w-full border border-gray-300  py-2 px-4 text-[16px] rounded-md outline-none focus:border-[#155dfc] focus:border-2"
              />
            </div>
 
            <div className="password relative mb-2">
              <label htmlFor="password" className=" font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 py-2 px-4 rounded-md outline-none text-[16px] focus:border-[#155dfc] focus:border-2"
              />

              <div className="icon absolute bottom-[11px] right-[20px] text-gray-500 hover:text-gray-700">
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
                {" "}
                <p className="forgot-password mt-[14px] mb-[20px] text-blue-600 cursor-pointer">
                  Forgot Password?
                </p>
              </Link>
            </div>

            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm mb-2">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-[8px] bg-blue-600 text-white rounded-md font-medium text-[20px] cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="w-full mt-[20px] text-center text-[18px] text-gray-600 ">
              Don't have an account?{" "}
              <Link to="/signup">
                {" "}
                <span className="text-blue-600 cursor-pointer">Sign Up</span>
              </Link>
            </p>
          </form>
          <p className="absolute bottom-6 text-gray-600 ">
            © 2025 QuantumPulse Technologies Pvt. Ltd. All Rights Reserved
          </p>
        </div>
      </div>

      <div className="right-container w-[60%]   h-[100vh] hidden  lg:flex items-center justify-center">
        <AutoCarousel />
      </div>
    </div>
  );
};

export default LoginForm;
