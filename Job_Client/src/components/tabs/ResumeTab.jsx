import React, { useRef } from "react";
import axios from "axios";
import { FileText, Download, Upload } from "lucide-react";

const ResumeTab = ({ onboarding }) => {
  const resumeInputRef = useRef(null);
  const token = localStorage.getItem("token");

  const handleResumeButtonClick = () => {
    resumeInputRef.current.click();
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/onboarding/resume`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload();
    } catch (error) {
      alert("Failed to upload resume.");
    }
  };

  return (
    <div className=" rounded-2xl  p-8">
      <h3 className="font-bold text-xl mb-8 flex items-center gap-3 text-blue-800">
        <FileText size={28} /> Resume
      </h3>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center gap-4 bg-white rounded-xl shadow-md p-6 flex-1">
          <FileText size={40} className="text-blue-600" />
          <div>
            {onboarding?.resume ? (
              <>
                <div className="font-semibold text-gray-800">
  {onboarding.resume
    .split("/")
    .pop()                 // 1766586529055_Abishek_Resume.pdf
    .replace(".pdf", "")   // 1766586529055_Abishek_Resume
    .replace(/^\d+_/, "")  // Abishek_Resume
    .replace(/_/g, " ")}   // Abishek Resume
</div>

                <div className="flex items-center justify-center gap-4 mt-2">
                  <a
                    href={`${onboarding.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium transition"
                  >
                    <Download size={16} /> Download
                  </a>

                  <button
                    className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded font-medium text-sm transition"
                    onClick={handleResumeButtonClick}
                  >
                    <Upload size={18} />
                    {onboarding?.resume ? "Replace Resume" : "Upload Resume"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-gray-500">No resume uploaded yet.</div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={resumeInputRef}
            style={{ display: "none" }}
            onChange={handleResumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeTab;
