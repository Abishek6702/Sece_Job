import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowUp, MoveLeft } from "lucide-react";

const DEFAULT_LOCATIONS = [
  "Coimbatore",
  "Madurai",
  "Chennai",
  "Pollachi",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Karur",
  "Nagapattinam",
  "Los Angeles",
  "Salem",
  "Thanjavur",
  "Bangalore",
  "Tiruppur",
];

const JobApplicationForm = () => {
  const { state } = useLocation();
  const job = state?.job;
  const companyId = job.companyId?._id || job.companyId;
  const jobId = job?._id;
  const navigate = useNavigate();

  const steps = ["Resume", "Additional Questions", "Preview"];
  const [step, setStep] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profile, setProfile] = useState({});
  const [jobDetails, setJobDetails] = useState({});
  const [formData, setFormData] = useState({
    resume: null,
    additionalAnswers: {},
    experience: "",
    location: "",
  });
  const [showUpload, setShowUpload] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null);

  // ✅ State for location dropdown
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(DEFAULT_LOCATIONS);

  // Load Profile Data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      return;
    }
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setFormData((prev) => ({
          ...prev,
          resume: data.onboarding?.resume || null,
        }));
        const dob = data.onboarding?.dob;
        if (dob) {
          const birthDate = new Date(dob);
          const today = new Date();
          let userAge = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            userAge--;
          }
          setAge(userAge);
        }
      });
  }, []);

  // File Change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, resume: file }));
    setShowUpload(false);
    if (file && file.type === "application/pdf") {
      const fileReader = new FileReader();
      fileReader.onload = (event) => setPreviewUrl(event.target.result);
      fileReader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
    if (errors.resume) setErrors((prev) => ({ ...prev, resume: "" }));
  };

  // Dynamic Additional Answers
  const handleAdditionalAnswer = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      additionalAnswers: { ...prev.additionalAnswers, [key]: value },
    }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // Experience
const handleExperienceChange = (e) => {
  const value = e.target.value;
  setFormData((prev) => ({ ...prev, experience: value }));
  
  if (errors.experience) {
    setErrors((prev) => ({ ...prev, experience: "" }));
  }
};


  // ✅ Location with suggestions
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, location: value }));

    if (value.trim()) {
      setFilteredLocations(
        DEFAULT_LOCATIONS.filter((loc) =>
          loc.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredLocations(DEFAULT_LOCATIONS);
    }

    if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));
  };

  const handleLocationFocus = () => {
    setShowSuggestions(true);
    setFilteredLocations(DEFAULT_LOCATIONS);
  };

  const handleSuggestionClick = (loc) => {
    setFormData((prev) => ({ ...prev, location: loc }));
    setShowSuggestions(false);
  };

  const handleLocationBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150); // allow click
  };

  // Validation
  const validateStep = () => {
    let newErrors = {};

    if (step === 0) {
      if (!formData.resume) {
        newErrors.resume = "Resume is required";
      }
    }

    if (step === 1) {
      job?.additionalInfo?.forEach((q, idx) => {
        if (!formData.additionalAnswers[idx]?.trim()) {
          newErrors[idx] = "This field is required";
        }
      });

      if (!formData.experience || formData.experience <= 0) {
        newErrors.experience = "Please enter valid years of experience";
      } else if (formData.experience > 50) {
        // ✅ Maximum check
        newErrors.experience = "Experience cannot be more than 50 years";
      }

      if (!formData.location?.trim()) {
        newErrors.location = "Please enter your location";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Steps Navigation
  const nextStep = () => {
    if (validateStep()) setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  // Submission
  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true); // 🔹 Start loading

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
      setIsSubmitting(false); // Stop loading if error
      return;
    }

    const questionsAndAnswers =
      job?.additionalInfo?.map((q, idx) => ({
        question: q,
        answer: formData.additionalAnswers[idx] || "Not specified",
      })) || [];

    const data = new FormData();
    data.append("jobId", job?._id);
    data.append("companyId", job?.companyId?._id || job.companyId);
    data.append(
      "name",
      profile.onboarding?.firstName
        ? `${profile.onboarding.firstName} ${profile.onboarding.lastName || ""}`
        : profile.name
    );
    data.append("email", profile.email);
    data.append("phone", profile.phone);
    data.append("experience", formData.experience);
    data.append("location", formData.location);
    data.append("questionsAndAnswers", JSON.stringify(questionsAndAnswers));

    if (formData.resume) {
      if (typeof formData.resume === "string") {
        data.append("resumePath", formData.resume);
      } else {
        data.append("resume", formData.resume);
      }
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/applications`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Submission failed");
      }

      alert("Application submitted!");
      navigate("/submitsucess");
    } catch (error) {
      alert("Error: " + error.message);
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false); // 🔹 Always stop loading
    }
  };

  // Helpers
  const getResumeName = () => {
    if (formData.resume) {
      if (typeof formData.resume === "string") {
        return formData.resume.split("/").pop();
      }
      return formData.resume.name;
    }
    return profile.onboarding?.resume?.split("/").pop() || "Not uploaded";
  };

  const getResumeUrl = () => {
    if (previewUrl) return previewUrl;
    if (formData.resume && typeof formData.resume === "string") {
      return `${formData.resume.replace(
        /\\/g,
        "/"
      )}`;
    }
    if (profile.onboarding?.resume) {
      return `${
        import.meta.env.VITE_API_BASE_URL
      }/${profile.onboarding.resume.replace(/\\/g, "/")}`;
    }
    return null;
  };

  return (
    <div className="flex justify-center items-center w-full px-2 md:px-4 mt-4 mb-16">
      <div className="w-full max-w-full sm:max-w-2xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-white p-0 md:p-4 rounded md:shadow-lg">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <button
              className="text-xl font-semibold"
              onClick={() => navigate(-1)}
            >
              <MoveLeft />
            </button>
            {job?.companyId?.company_logo && (
              <img
                src={`${
                  job.companyId.company_logo
                }`}
                className="w-10 h-10 border rounded-full border-gray-400"
                alt="Company Logo"
              />
            )}
            <h1 className="text-gray-600 font-medium text-xl">
              {job?.companyId?.company_name || jobDetails.companyName}
            </h1>
          </div>
          <h1 className="font-medium text-2xl mt-2 md:mt-[1%] md:text-3xl">
            {job?.position || jobDetails.position}
          </h1>
          <h1 className="text-gray-400 mt-1 md:mt-[1%] font-medium text-lg">
            {job?.location || jobDetails.location}
          </h1>
        </div>
        <hr className="border-t border-gray-400 mt-4 mb-2" />

        {/* Progress */}
        <p className="text-xl md:text-2xl font-bold mb-6 text-left">
          {steps[step]}
        </p>
        <div className="w-full md:w-[75%] bg-gray-200 h-2 rounded-full m-auto mb-6 mt-8">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step 0: Resume */}
        {step === 0 && (
          <div className="flex flex-col space-y-4 w-full md:w-[80%] m-auto">
            {getResumeUrl() && (
              <div
                className="w-full min-h-[220px] rounded border mb-4 overflow-auto"
                style={{ maxHeight: "60vh" }}
              >
                <iframe
                  src={getResumeUrl()}
                  title="Resume Preview"
                  className="w-full h-48 sm:h-80 md:h-[60vh] rounded"
                />
              </div>
            )}
            <label className="inline-block text-center font-semibold text-lg text-gray-600 bg-gray-200 px-4 py-2 rounded mt-3 cursor-pointer">
             <p className="flex items-center justify-center gap-2"> Update Resume <ArrowUp/></p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {errors.resume && (
              <p className="text-red-500 text-sm">{errors.resume}</p>
            )}
          </div>
        )}

        {/* Step 1: Additional Questions */}
        {step === 1 && (
          <div className="flex flex-col md:flex-row md:flex-wrap gap-4 w-full md:w-[80%] m-auto mb-4">
            {job?.additionalInfo?.map((question, idx) => (
              <div key={idx} className="w-full md:w-[48%]">
                <label className="block text-base md:text-lg font-semibold mb-1">
                  {question}
                </label>
                <input
                  type="text"
                  className={`border ${
                    errors[idx] ? "border-red-500" : "border-gray-300"
                  } rounded-lg outline-none p-2 w-full`}
                  value={formData.additionalAnswers?.[idx] || ""}
                  onChange={(e) => handleAdditionalAnswer(idx, e.target.value)}
                  placeholder="Type your answer..."
                />
                {errors[idx] && (
                  <p className="text-red-500 text-sm">{errors[idx]}</p>
                )}
              </div>
            ))}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="w-full md:w-[48%]">
                <label className="block text-base md:text-lg font-semibold mb-1">
                  Total Year of Experience
                </label>
                <input
                  type="number"
                  max={50}
                  className={`border ${
                    errors.experience ? "border-red-500" : "border-gray-300"
                  } rounded-lg outline-none p-2 w-full`}
                  value={formData.experience}
                  onChange={handleExperienceChange}
                  placeholder="Year of Experience"
                />
                {errors.experience && (
                  <p className="text-red-500 text-sm">{errors.experience}</p>
                )}
              </div>
              <div className="w-full md:w-[48%] relative">
                <label className="block text-base md:text-lg font-semibold mb-1">
                  Current Location
                </label>
                <input
                  type="text"
                  className={`border ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  } rounded-lg outline-none p-2 w-full`}
                  value={formData.location}
                  onChange={handleLocationChange}
                  onFocus={handleLocationFocus}
                  onBlur={handleLocationBlur}
                  placeholder="Enter Your Location"
                  autoComplete="off"
                />
                {showSuggestions && (
                  <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg max-h-50 overflow-auto mt-1">
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((loc) => (
                        <li
                          key={loc}
                          onMouseDown={() => handleSuggestionClick(loc)}
                          className="p-2 hover:bg-blue-100 cursor-pointer"
                        >
                          {loc}
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-400">
                        No matching locations
                      </li>
                    )}
                  </ul>
                )}
                {errors.location && (
                  <p className="text-red-500 text-sm">{errors.location}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 2 && (
          <div className="flex flex-col space-y-4 w-full md:w-[80%] m-auto">
            <h2 className="text-lg md:text-xl font-semibold mb-2">
              Preview Your Details
            </h2>
            <div className="bg-gray-100 p-4 rounded">
              <p>
                <span className="font-semibold">Name: </span>
                {profile.onboarding?.firstName
                  ? `${profile.onboarding.firstName} ${
                      profile.onboarding.lastName || ""
                    }`
                  : profile.name}
              </p>
              <p>
                <span className="font-semibold">Email: </span>
                {profile.email}
              </p>
              <p>
                <span className="font-semibold">Phone: </span>
                {profile.phone}
              </p>
              {job?.additionalInfo?.map((q, idx) => (
                <p key={idx}>
                  <span className="font-semibold">{q}: </span>
                  {formData.additionalAnswers[idx] || "Not specified"}
                </p>
              ))}
              <p>
                <span className="font-semibold">
                  Total Year of Experience:{" "}
                </span>
                {formData.experience || "Not specified"}
              </p>
              <p>
                <span className="font-semibold">Current Location: </span>
                {formData.location || "Not specified"}
              </p>
              <p>
                <span className="font-semibold">Resume: </span>
                {getResumeName()}
              </p>
              {getResumeUrl() && (
                <div
                  className="w-full min-h-[180px] rounded border overflow-auto my-2"
                  style={{ maxHeight: "50vh" }}
                >
                  <iframe
                    src={getResumeUrl()}
                    title="Resume Preview"
                    className="w-full h-44 sm:h-60 md:h-[45vh] rounded"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col-reverse xs:flex-row md:flex-row mt-8 gap-4 w-full items-stretch md:items-center justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={prevStep}
            disabled={step === 0}
          >
            Previous
          </button>
          {step === steps.length - 1 ? (
            <button
              className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline 
              ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
              onClick={handleSubmit}
              disabled={isSubmitting} // 🔹 Prevent clicks when submitting
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={nextStep}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;
