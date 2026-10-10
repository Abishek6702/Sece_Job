import { useState } from "react";
import { Eye, EyeOff, UserRound, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import logo from "../assets/logo.svg"

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
      else if (!/^\d{10}$/.test(formData.phone.replace(/[-+\s()]/g, '')))
        newErrors.phone = "Phone number must be 10 digits";
    } else {
      if (!formData.companyName.trim())
        newErrors.companyName = "Company name is required";
      if (!formData.companyEmail.trim())
        newErrors.companyEmail = "Company email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.companyEmail))
        newErrors.companyEmail = "Company email is invalid";
      if (!formData.companyPhone.trim())
        newErrors.companyPhone = "Company phone is required";
      else if (!/^\d{10}$/.test(formData.companyPhone.replace(/[-+\s()]/g, '')))
        newErrors.companyPhone = "Company phone must be 10 digits";
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
        navigate("/");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F5F7] font-sans px-4 py-8">
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl w-full max-w-[600px] flex flex-col relative">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="w-48" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Create an Account</h2>
        <p className="text-gray-500 text-center mb-8">Join us to continue</p>

        {!showOtpField ? (
          <>
            <div className="bg-[#F9FAFC] p-1.5 rounded-2xl flex mb-6">
              <button
                type="button"
                className={`flex items-center justify-center py-2.5 px-4 rounded-xl w-1/2 transition-all duration-200 font-bold ${
                  userType === "candidate"
                    ? "bg-white text-gray-800 shadow-sm border border-gray-100"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setUserType("candidate")}
              >
                <UserRound className="h-5 w-5 mr-2" />
                <span>Candidate</span>
              </button>
              <button
                type="button"
                className={`flex items-center justify-center py-2.5 px-4 rounded-xl w-1/2 transition-all duration-200 font-bold ${
                  userType === "employer"
                    ? "bg-white text-gray-800 shadow-sm border border-gray-100"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
                onClick={() => setUserType("employer")}
              >
                <Building2 className="h-5 w-5 mr-2" />
                <span>Employer</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {userType === "candidate" ? (
                <>
                  <div className="flex flex-col">
                    <label htmlFor="name" className="font-semibold text-gray-700 mb-2">User Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full border-2 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:bg-white transition-all ${
                        errors.name ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-blue-600"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="email" className="font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full border-2 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:bg-white transition-all ${
                        errors.email ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-blue-600"
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="phone" className="font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full border-2 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:bg-white transition-all ${
                        errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-blue-600"
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone}</p>}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col">
                    <label htmlFor="companyName" className="font-semibold text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className={`w-full border-2 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:bg-white transition-all ${
                        errors.companyName ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-blue-600"
                      }`}
                      placeholder="Enter company name"
                    />
                    {errors.companyName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.companyName}</p>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="companyEmail" className="font-semibold text-gray-700 mb-2">Company Email</label>
                    <input
                      type="email"
                      name="companyEmail"
                      id="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      className={`w-full border-2 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:bg-white transition-all ${
                        errors.companyEmail ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-blue-600"
                      }`}
                      placeholder="Enter company email"
                    />
                    {errors.companyEmail && <p className="mt-1 text-xs text-red-500 font-medium">{errors.companyEmail}</p>}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="companyPhone" className="font-semibold text-gray-700 mb-2">Company Phone</label>
                    <input
                      type="tel"
                      name="companyPhone"
                      id="companyPhone"
                      value={formData.companyPhone}
                      onChange={handleChange}
                      className={`w-full border-2 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:bg-white transition-all ${
                        errors.companyPhone ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-blue-600"
                      }`}
                      placeholder="Enter company phone number"
                    />
                    {errors.companyPhone && <p className="mt-1 text-xs text-red-500 font-medium">{errors.companyPhone}</p>}
                  </div>
                </>
              )}

              <div className="flex flex-col relative">
                <label htmlFor="password" className="font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full border-2 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:bg-white transition-all pr-12 ${
                      errors.password ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-blue-600"
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[18px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
              </div>

              <div className="flex flex-col relative">
                <label htmlFor="confirmPassword" className="font-semibold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full border-2 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:bg-white transition-all pr-12 ${
                      errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-blue-600"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-[18px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 font-medium">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-[16px] cursor-pointer transition-all shadow-md"
              >
               {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
              {apiError && <p className="mt-2 text-center text-sm text-red-500 font-medium">{apiError}</p>}
            </form>

            <p className="w-full mt-6 text-center text-[15px] text-gray-500">
              Already have an account?{" "}
              <Link to="/">
                <span className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer transition-colors">Sign In</span>
              </Link>
            </p>
          </>
        ) : (
          <div className="h-full flex flex-col justify-center">
            <form onSubmit={handleOtpVerify} className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label htmlFor="otp" className="font-semibold text-gray-700 mb-2">
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
                  className={`w-full border-2 bg-[#F9FAFC] py-3 px-5 text-[16px] rounded-2xl outline-none focus:bg-white transition-all ${
                    otpError ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-blue-600"
                  }`}
                  placeholder="Enter the OTP sent to your email"
                />
                {otpError && <p className="mt-1 text-xs text-red-500 font-medium">{otpError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-[16px] cursor-pointer transition-all shadow-md"
              >
                Verify OTP
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupForm;
