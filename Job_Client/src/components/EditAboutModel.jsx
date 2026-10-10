import React, { useState } from "react";
import axios from "axios";

const steps = [
  { id: 1, title: "Primary Information", progress: 20 },
  { id: 2, title: "Location Details", progress: 40 },
  { id: 3, title: "Salary Preferences", progress: 60 },
  { id: 4, title: "Job Preferences", progress: 80 },
  { id: 5, title: "Review & Submit", progress: 100 },
];

const EditAboutModal = ({ initialData, token, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    location: initialData.location || "",
    postalcode: initialData.postalcode || "",
    salary: initialData.salary || "",
    salaryperiod: initialData.salaryperiod || "",
    jobtitle: initialData.jobtitle || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/onboarding/onboarding/fields`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      if (onSuccess) onSuccess();
      alert("Data Updated Successfully");
      window.location.reload();
    } catch (err) {
      setLoading(false);
      setError("Failed to update profile. Please try again.");
      console.error(err);
    }
  };

  // Render fields by step
  const renderStepFields = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </>
        );
      case 2:
        return (
          <>
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <Input
              label="Postal Code"
              name="postalcode"
              value={formData.postalcode}
              onChange={handleChange}
            />
          </>
        );
      case 3:
        return (
          <>
            <Input
              label="Salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              required
            />
            <Input
              label="Salary Period"
              name="salaryperiod"
              value={formData.salaryperiod}
              onChange={handleChange}
              required
            />
          </>
        );
      case 4:
        return (
          <>
            <Input
              label="Job Title"
              name="jobtitle"
              value={formData.jobtitle}
              onChange={handleChange}
              required
            />
          </>
        );
        case 5:
            return (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Review Your Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize text-sm text-gray-500">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {value || "-"}
                      </span>
                    </div>
                  ))}
                </div>
                
              </div>
            );
          
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 tint flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Progress bar and title */}
        <h2 className="text-3xl font-semibold mb-4">
          {steps[currentStep - 1].title}
        </h2>
        <div className="h-2 w-full bg-gray-200 rounded-full mb-8">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${steps[currentStep - 1].progress}%` }}
          />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === steps.length) {
              handleSubmit();
            } else {
              handleNext();
            }
          }}
          className="space-y-6"
        >
          {renderStepFields()}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className={`px-6 py-3 rounded-lg border ${
                currentStep === 1 || loading
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-gray-500 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading
                ? "Saving..."
                : currentStep === steps.length
                ? "Submit"
                : "Next"}
            </button>
          </div>

          {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
}) => (
  <div>
    <label
      htmlFor={name}
      className="block mb-2 text-gray-700 font-semibold text-md"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
    />
  </div>
);

export default EditAboutModal;