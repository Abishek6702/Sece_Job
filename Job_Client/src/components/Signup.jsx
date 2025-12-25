import React, { useState } from "react";
import { Eye, EyeOff, UserRound, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AutoCarousel from "./AutoCarousel";
import { toast } from 'react-toastify';
import logo from "../assets/logomain.svg"
import AutoCarousel1 from "./AutoCarousel1";
const SignupForm = () => {
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("candidate");
  const [errors, setErrors] = useState({});
  const [button, setButton] = useState("signup");
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (userType === "candidate") {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    } else {
      if (!formData.companyName.trim())
        newErrors.companyName = "Company name is required";
      if (!formData.companyEmail.trim())
        newErrors.companyEmail = "Company email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.companyEmail))
        newErrors.companyEmail = "Company email is invalid";
      if (!formData.companyPhone.trim())
        newErrors.companyPhone = "Company phone is required";
    }

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validateForm()) return;

    let payload;
    let endpoint;

    if (userType === "candidate") {
      payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };
      endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/auth/register-employee`;
      setVerifyEmail(formData.email);
    } else {
      payload = {
        name: formData.companyName,
        email: formData.companyEmail,
        phone: formData.companyPhone,
        password: formData.password,
      };
      endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/auth/register-employer`;
      setVerifyEmail(formData.companyEmail);
    }
    setLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setApiError("");
        setFormData({
          name: "",
          email: "",
          phone: "",
          companyName: "",
          companyEmail: "",
          companyPhone: "",
          password: "",
          confirmPassword: "",
        });
        setShowOtpField(true);
        setButton("verifyOtp");
      } else {
        const errorMessage =
          result.message || "Registration failed. Please try again.";
        alert(errorMessage);
        setApiError(errorMessage);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Something went wrong. Please try again later.");
      setApiError("Something went wrong.");
    }finally{
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setOtpError("OTP is required.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: verifyEmail, otp: otp }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setOtpError(data.message || "OTP verification failed.");
      } else {
        alert("OTP verified successfully!");
        setVerifyEmail("");
        toast.success("Otp Verified")
        setOtp("");
        setOtpError("");
        setShowOtpField(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-[100%] h-[100vh] flex justify-between bg-gray-50">
    
      <div className="w-full  lg:w-[45%] borde  px-8 rounded-lg m-auto">
        <div className="w-40">
          <img src={logo} alt="" />
        </div>
        {!showOtpField ? (
          <>
            <div className=" bg-gray-100 p-1 rounded-lg flex mb-6 mt-4">
              <button
                type="button"
                className={`flex items-center justify-center py-2 px-4 rounded-md w-1/2 transition-all duration-200 ${
                  userType === "candidate"
                    ? "bg-blue-600 text-white shadow-md"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setUserType("candidate")}
              >
                <UserRound className="h-4 w-4 mr-2" />
                <span className="font-medium">Candidate</span>
              </button>
              <button
                type="button"
                className={`flex items-center justify-center py-2 px-4 rounded-md w-1/2 transition-all duration-200 ${
                  userType === "employer"
                    ? "bg-blue-600 text-white shadow-md"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setUserType("employer")}
              >
                <Building2 className="h-4 w-4 mr-2" />
                <span className="font-medium">Employer</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {userType === "candidate" ? (
                <>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      User Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:border-[#155dfc] focus:border-2 outline-none  ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:border-[#155dfc] focus:border-2 outline-none ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:border-[#155dfc] focus:border-2 outline-none ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:border-[#155dfc] focus:border-2 outline-none  ${
                        errors.companyName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter company name"
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="companyEmail"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Company Email
                    </label>
                    <input
                      type="email"
                      name="companyEmail"
                      id="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:border-[#155dfc] focus:border-2 outline-none  ${
                        errors.companyEmail
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter company email"
                    />
                    {errors.companyEmail && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.companyEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="companyPhone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Company Phone
                    </label>
                    <input
                      type="tel"
                      name="companyPhone"
                      id="companyPhone"
                      value={formData.companyPhone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:border-[#155dfc] focus:border-2 outline-none   ${
                        errors.companyPhone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter company phone number"
                    />
                    {errors.companyPhone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.companyPhone}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md  focus:border-[#155dfc] focus:border-2 outline-none ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md  focus:border-[#155dfc] focus:border-2 outline-none  ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
               {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
              {apiError && (
                <p className="mt-2 text-center text-sm text-red-600">
                  {apiError}
                </p>
              )}
            </form>

            <div className="mb-4 mt-4 hidden">
              <p className="text-center text-gray-500 text-sm mb-2">
                Sign up with
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-2 w-full justify-center bg-white text-gray-700 border border-gray-300 rounded-md"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                    alt="LinkedIn"
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium hidden md:block">
                    LinkedIn
                  </span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-2 w-full justify-center bg-white text-gray-700 border border-gray-300 rounded-md"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium hidden md:block">
                    Google
                  </span>
                </button>
              </div>
            </div>

            <p className="text-center mt-4 text-[18px] text-gray-600">
              Already have an account?{" "}
              <Link to="/login">
                <span className="text-blue-600 cursor-pointer">Sign In</span>
              </Link>
            </p>
          </>
        ) : (
          <div className="h-full flex flex-col justify-center">
            <form onSubmit={handleOtpVerify} className="space-y-4 ">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-xl font-medium text-gray-700 mb-1"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    if (otpError) setOtpError("");
                  }}
                  className={`w-full px-4 py-2 border rounded-md   ${
                    otpError ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter the OTP sent to your email"
                />
                {otpError && (
                  <p className="mt-1 text-xs text-red-500">{otpError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md  transition-colors duration-200"
              >
                Verify OTP
              </button>
            </form>
          </div>
        )}
      </div>
      <div className="right_container w-[45%] h-[100vh] items-center justify-center hidden lg:flex">
        <AutoCarousel />
      </div>
    </div>
  );
};

export default SignupForm;
