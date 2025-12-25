import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaCog,
  FaUpload,
  FaEye,
} from "react-icons/fa";

import PersonalInfo from "./steps/PersonalInfo";
import EducationStep from "./steps/EducationStep";
import ExperienceStep from "./steps/ExperienceStep";
import PreferencesStep from "./steps/PreferencesStep";
import UploadsStep from "./steps/UploadsStep";
import PreviewStep from "./steps/PreviewStep";
import ConfirmModal from "./ConfirmModal";

const steps = [
  "Personal Info",
  "Education",
  "Experience",
  "Preferences",
  "Uploads",
  "Preview",
];

const stepIcons = [
  <FaUser />,
  <FaGraduationCap />,
  <FaBriefcase />,
  <FaCog />,
  <FaUpload />,
  <FaEye />,
];

export default function OnboardingForm() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    education: [
      {
        level: "",
        institution: "",
        university: "",
        branch: "",
        yearFrom: "",
        yearTo: "",
        marks: "",
      },
    ],
    experience: [
      {
        company: "",
        yearFrom: "",
        yearTo: "",
        title: "",
        location: "",
        description: "",
      },
    ],
    preferredRoles: [""],
    salaryExpectation: "",
    profileImage: null,
    skills: [],
    skillsInput: "",
    resume: null,
  });
  const [stepErrors, setStepErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const stepDescriptions = [
    "Fill in your personal details",
    "Add your educational background",
    "Enter your work experience",
    "Set your job preferences",
    "Upload your profile picture and resume",
    "Review and submit your information",
  ];


console.log("formdata",formData);

  // Validation for each step (keep your same logic here)
  const validateStep = () => {
    let errors = {};

    // *** Validation Logic unchanged from your version ***
    if (currentStep === 0) {
      if (!formData.firstName.trim())
        errors.firstName = "First Name is required";
      if (!formData.lastName.trim()) errors.lastName = "Last Name is required";
      if (!formData.location.trim()) errors.location = "Location is required";
    }
    if (currentStep === 1) {
      const edu = formData.education[0];
      const alphaSpace = /^[A-Za-z\s]+$/;

      const checkMin4 = (fieldName, label) => {
        if (!edu[fieldName].trim()) {
          errors[fieldName] = `${label} is required`;
        } else if (edu[fieldName].trim().length < 2) {
          errors[fieldName] = `${label} Enter proper input`;
        } 
        // else if (!alphaSpace.test(edu[fieldName].trim())) {
        //   errors[fieldName] = `${label} should contain only letters and spaces`;
        // }
      };

      checkMin4("level", "Education level");
      checkMin4("institution", "Institution");
      checkMin4("university", "University");
      checkMin4("branch", "Branch");

      if (!edu.yearFrom) errors.yearFrom = "Start year is required";
      if (!edu.yearTo) errors.yearTo = "End year is required";
      if (edu.yearFrom && edu.yearTo) {
        const fromDate = new Date(edu.yearFrom);
        const toDate = new Date(edu.yearTo);

        if (toDate <= fromDate) {
          errors.yearTo = "End date must be after start date";
        } else {
          const diffInDays =
            (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
          if (diffInDays < 365) {
            errors.yearTo =
              "There must be at least 1 year gap between start and end date";
          }
        }
      }

      if (!edu.marks.toString().trim()) errors.marks = "Marks are required";
      else if (isNaN(edu.marks) || edu.marks < 0 || edu.marks > 100)
        errors.marks = "Marks must be between 0 and 100";
    }
    if (currentStep === 2) {
      const exp = formData.experience[0];

      if (!exp.company.trim()) errors.company = "Company name is required";
      if (!exp.title.trim()) errors.title = "Job title is required";
      if (!exp.location.trim()) errors.location = "Location is required";

      if (!exp.yearFrom) errors.yearFrom = "Start date is required";

      if (!exp.present) {
        if (!exp.yearTo) errors.yearTo = "End date is required";
        else {
          const fromDate = new Date(exp.yearFrom);
          const toDate = new Date(exp.yearTo);
          if (toDate <= fromDate) {
            errors.yearTo = "End date must be after start date";
          }
        }
      }
    }
    if (currentStep === 3) {
      if (!formData.preferredRoles[0]?.trim()) {
        errors.preferredRoles = "Enter your current role";
      }
      if (!formData.skills.length) {
        errors.skills = "Please enter at least one skill";
      }
    }
    if (currentStep === 4) {
      if (!formData.profileImage)
        errors.profileImage = "Profile image is required";
      if (!formData.resume) errors.resume = "Resume is required";
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
      const { id: userId } = jwtDecode(token);

      const form = new FormData();
      form.append("userId", userId);
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("location", formData.location);
      form.append("salaryExpectation", formData.salaryExpectation);
      form.append("education", JSON.stringify(formData.education));
      form.append("experience", JSON.stringify(formData.experience));
      form.append("preferredRoles", JSON.stringify(formData.preferredRoles));
      form.append("skills", JSON.stringify(formData.skills));
      form.append("careerGapStart", JSON.stringify(formData.careerGap.yearFrom));
      form.append("careerGapEnd", JSON.stringify(formData.careerGap.yearTo));

      if (formData.profileImage)
        form.append("profileImage", formData.profileImage);
      if (formData.resume) form.append("resume", formData.resume);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/onboarding/onboarding`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Onboarding submitted successfully!");
        navigate("/feeds");
      } else {
        alert("Submission failed: " + data.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
    setSubmitting(false);
  };

  const stepProps = { formData, setFormData, errors: stepErrors };
  let StepComponent;
  switch (currentStep) {
    case 0:
      StepComponent = <PersonalInfo {...stepProps} />;
      break;
    case 1:
      StepComponent = <EducationStep {...stepProps} />;
      break;
    case 2:
      StepComponent = <ExperienceStep {...stepProps} />;
      break;
    case 3:
      StepComponent = <PreferencesStep {...stepProps} />;
      break;
    case 4:
      StepComponent = <UploadsStep {...stepProps} />;
      break;
    case 5:
      StepComponent = <PreviewStep formData={formData} />;
      break;
    default:
      StepComponent = null;
  }
  

  return (
    <>
    {showConfirmModal && (
  <ConfirmModal
    title="Confirm Submission"
    message="Are you sure you want to submit your onboarding information?"
    confirmLabel="Yes, Submit"
    onConfirm={async () => {
      setShowConfirmModal(false);
      await handleSubmit();
    }}
    onCancel={() => setShowConfirmModal(false)}
  />
)}

    <div className="flex flex-col md:flex-row lg:flex-row min-h-screen">
      {/* Mobile/Tablet Top Stepper */}
      <div className="block md:hidden border-b border-gray-200 p-4 overflow-x-auto mt-4">
        <div className="flex items-center min-w-max relative">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center flex-shrink-0">
              {/* Step icon */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200 ${
                    idx <= currentStep
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-gray-300 text-gray-400 bg-white"
                  }`}
                >
                  {stepIcons[idx]}
                </div>
                <span
                  className={`mt-1 text-xs text-center w-16 whitespace-nowrap ${
                    idx <= currentStep ? "text-black" : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>

              {/* Connector line (only if not last step) */}
              {idx < steps.length - 1 && (
                <div
                  className="w-10 h-0.5 mt-[-16px]"
                  style={{
                    backgroundColor: idx < currentStep ? "#2563eb" : "#e5e7eb", // blue-600 or gray-200
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar Stepper */}
      <div className="hidden md:block md:w-[40%] lg:w-[30%] bg-gray-50 p-8 border-r border-gray-200 sticky top-0 overflow-y-auto ">
        <ol className="ml-10">
          {steps.map((step, idx) => (
            <motion.li
              key={step}
              className="mb-15 last:mb-0 flex items-start relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {idx !== steps.length - 1 && (
                <motion.span
                  className={`absolute left-[-1.3rem] top-10 w-0.5 lg:h-16 sm:h-21 ${
                    idx < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.15 }}
                  style={{ transformOrigin: "top" }}
                ></motion.span>
              )}
              <motion.span
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-md absolute left-[-2.5rem] top-0 ${
                  idx <= currentStep
                    ? "border-transparent bg-gradient-to-r from-blue-500 to-blue-400 text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
                animate={
                  idx === currentStep
                    ? {
                        scale: [1, 1.25, 1],
                        boxShadow: "0 0 10px rgba(59,130,246,0.7)",
                      }
                    : {}
                }
                transition={{
                  duration: 1.5,
                  repeat: idx === currentStep ? Infinity : 0,
                }}
              >
                {stepIcons[idx]}
              </motion.span>
              <div className="ml-8 ">
                <div
                  className={`font-semibold  ${
                    idx <= currentStep ? "text-black" : "text-gray-500"
                  }`}
                >
                  {step}
                </div>
                <div className="text-sm text-gray-400">
                  {stepDescriptions[idx]}
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-[70%] h-[95vh] flex  p-4 lg:p-8 overflow-y-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (validateStep()) {
              if (currentStep === steps.length - 1) {
                setShowConfirmModal(true); // <-- show confirmation modal instead
              } else {
                nextStep();
              }
            }
          }}
          
          encType="multipart/form-data"
          className="w-full max-w-3xl  md:mt-14 lg:mt-10"
        >
          {StepComponent}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
    </>
  );
}