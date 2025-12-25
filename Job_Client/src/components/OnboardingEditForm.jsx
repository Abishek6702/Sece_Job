import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PersonalInfo from "./steps/PersonalInfo";
import EducationStep from "./steps/EducationStep";
import ExperienceStep from "./steps/ExperienceStep";
import PreferencesStep from "./steps/PreferencesStep";
import PreviewStep from "./steps/PreviewStep";
import ProgressBar from "./steps/ProgressBar";

const steps = [
  "Personal Info",
  "Education",
  "Experience",
  "Preferences",
  "Preview",
];

export default function OnboardingEditForm({ initialData, onClose }) {
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
    skills: [],
    skillsInput: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        skillsInput: Array.isArray(initialData.skills)
          ? initialData.skills.join(", ")
          : initialData.skills || "",
      }));
    }
  }, [initialData]);

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleStepClick = (idx) => {
    setCurrentStep(idx);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const form = new FormData();
      form.append("userId", userId);
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("location", formData.location);
      form.append("education", JSON.stringify(formData.education));
      form.append("experience", JSON.stringify(formData.experience));
      form.append("preferredRoles", JSON.stringify(formData.preferredRoles));
      form.append("skills", JSON.stringify(formData.skills));

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
        toast.success("Onboarding updated successfully!");
        window.location.reload();
        if (onClose) onClose();
        else navigate("/login");
      } else {
        alert("Update failed: " + data.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
    setSubmitting(false);
  };

  const stepProps = { formData, setFormData };
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
      StepComponent = <PreviewStep formData={formData} />;
      break;
    default:
      StepComponent = null;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow overflow-auto">
      <ProgressBar
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (currentStep === steps.length - 1) {
            handleSubmit();
          } else {
            nextStep();
          }
        }}
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
  );
}
