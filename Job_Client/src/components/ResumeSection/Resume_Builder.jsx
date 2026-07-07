import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBigDownDash, ArrowLeft, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

// Import section components
import PersonalInfo from "./sections/PersonalInfo";
import Education from "./sections/Education";
import Certifications from "./sections/Certifications";
import Experience from "./sections/Experience";
import Skills from "./sections/Skills";
import Languages from "./sections/Languages";
import Projects from "./sections/Projects";
import RolesResponsibilities from "./sections/RolesResponsibilities";
import ResumePreview from "./ResumePreview";
import {jwtDecode} from "jwt-decode";

const getUserId = () => {
  try {
    const token = localStorage.getItem("token"); // or whatever you saved it as
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded.id || decoded.userId; // depends on your backend payload
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
};

const steps = [
  { key: "personal", label: "Personal Info", Component: PersonalInfo },
  { key: "education", label: "Education", Component: Education },
  { key: "experience", label: "Experience", Component: Experience },
  { key: "projects", label: "Projects", Component: Projects },
  { key: "certifications", label: "Certifications", Component: Certifications },
  { key: "skills", label: "Skills", Component: Skills },
  { key: "languages", label: "Languages", Component: Languages },
  {
    key: "roles",
    label: "Roles & Responsibilities",
    Component: RolesResponsibilities,
  },
];

const Resume_Builder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("ak", id);
  const [previewTrigger, setPreviewTrigger] = useState(0);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: {
      photo: null,
      name: "",
      phone: "",
      email: "",
      address: "",
      socialLinks: [],
      summary: "",
    },
    education: [],
    certifications: [],
    experience: [],
    skills: [],
    languages: [],
    projects: [],
    roles: [],
  });
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewHTML, setPreviewHTML] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/templates/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch templates");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched templates:", data);
        setTemplates(data);
      })
      .catch((e) => {
        console.error("Error fetching templates:", e);
      });
  }, []);

  useEffect(() => {
    if (!id || !templates.length) return;

    console.log("Decoded param id (templatePath):", id);

    const found = templates.find((t) => t.id === id);
    if (!found) {
      console.warn("Template not found for path:", decodedPath);
      setSelectedTemplate(null);
    } else {
      setSelectedTemplate(found);
      console.log("Selected template:", found);
    }
  }, [id, templates]);
  // --- Update section data
  const updateSectionData = (sectionKey, newData) => {
    setFormData((prev) => ({ ...prev, [sectionKey]: newData }));
  };

  const StepComponent = steps[currentStep].Component;

  // --- Save handler (cumulative)
  const handleCumulativeSave = async (stepIdx) => {
  const userId = getUserId();
  if (!userId || !selectedTemplate) return;

  const dataToSend = {
    userId,
    templateId: selectedTemplate.id,
    templatePath: selectedTemplate.path || "",
  };

  // include all data up to current step
  for (let i = 0; i < stepIdx; i++) {
    const sectionKey = steps[i].key;
    dataToSend[sectionKey] = formData[sectionKey];
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resumes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(dataToSend),
    });
    console.log("server response for going to next step:",res)
    if (!res.ok) throw new Error("Failed to save step data");
    const saved = await res.json();
    setPreviewTrigger(prev => prev + 1); 
    console.log(`✅ Step ${stepIdx + 1} saved:`, saved);
  } catch (err) {
    console.error("Error saving step data:", err);
    toast.error("Error saving step");
  }
};


  // --- Navigation
  const goToStep = (stepIdx) => {
    handleCumulativeSave(stepIdx);
    setCurrentStep(stepIdx);
  };

  const nextStep = () => {
    setCurrentStep((s) => {
      const nextIdx = Math.min(s + 1, steps.length - 1);
      handleCumulativeSave(nextIdx);
      return nextIdx;
    });
  };

  const prevStep = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  // --- Final submit
  const handleSubmit = async (action) => {
  const userId = getUserId();
  if (!userId || !selectedTemplate) return;

  const finalData = {
    userId,
    templateId: selectedTemplate.id,
    templatePath: selectedTemplate.path || "",
    ...formData,
  };

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resumes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(finalData),
    });

    if (!res.ok) throw new Error("Failed to save resume");
    const result = await res.json();

    toast.success(`Resume ${action} Successfully`);
    setPreviewTrigger(prev => prev + 1); 

    console.log("🎉 Resume submitted:", result);

    // navigate("/resumes");
  } catch (err) {
    console.error("Error submitting resume:", err);
    toast.error("Error submitting resume");
  }
};


  return (
    <div className="w-[95%] m-auto mt-4 ">
      {/* Stepper */}
      <div className="w-full overflow-x-auto  mb-6">
        <div className="flex items-center justify-start lg:justify-center w-max lg:w-full">
          {steps.map((step, idx) => {
            const isActive = currentStep === idx;
            const isCompleted = idx < currentStep;

            return (
              <div
                key={step.key}
                className={`relative flex items-center ${
                  idx !== steps.length - 1 ? "mr-2 sm:mr-4" : ""
                }`}
              >
                <button
                  // onClick={() => goToStep(idx)}
                  className={`px-6 py-2 flex items-center text-sm sm:text-base font-semibold transition 
                    ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-600"
                    } 
                    ${
                      idx !== steps.length
                        ? "clip-path-chevron"
                        : "rounded-r-lg"
                    } 
                    rounded-l-lg whitespace-nowrap`}
                >
                  {step.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Component */}
      <div className="flex flex-col lg:flex-row items-start gap-4 h-[80vh] overflow-auto">
        {/* Left form */}
        <div className="lg:w-[60%] w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 rounded-lg">
          <StepComponent
            data={formData[steps[currentStep].key]}
            updateData={(data) =>
              updateSectionData(steps[currentStep].key, data)
            }
            nextStep={nextStep}
            prevStep={prevStep}
            isFirst={currentStep === 0}
            isLast={currentStep === steps.length - 1}
            fullFormData={formData}
            templateId={id}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Right preview (hidden on small screens) */}
        <div className="hidden lg:flex flex-col items-center w-[50%] h-full ">
          {/* Template preview box */}
          <div className="relative border border-gray-200 shadow-md rounded-lg h-full w-full flex items-center justify-center ">
            <ResumePreview previewTrigger={previewTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume_Builder;
