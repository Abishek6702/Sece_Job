import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bot, KeyRound, FileText, LayoutTemplate } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <Bot className="w-7 h-7 text-blue-500" />,
    title: "ATS Score Check",
    description:
      "Analyze your resume with AI to see how it performs in applicant tracking systems, with detailed suggestions for improvement.",
  },
  {
    icon: <KeyRound className="w-7 h-7 text-purple-500" />,
    title: "Keyword Matching",
    description:
      "Match your resume to job descriptions by identifying missing or weak keywords to boost relevance.",
  },
  {
    icon: <FileText className="w-7 h-7 text-green-500" />,
    title: "Smart Resume Builder",
    description:
      "Create a tailored resume effortlessly using our resume builder designed for job seekers at all levels.",
  },
  {
    icon: <LayoutTemplate className="w-7 h-7 text-pink-500" />,
    title: "Professional Templates",
    description:
      "Choose from modern, recruiter-approved resume templates that highlight your strengths and stand out.",
  },
];

const ResumeScoreChecker = () => {
  const navigate = useNavigate();

  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState(""); // Job role input

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const handleFile = async (file) => {
    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF and DOC/DOCX files are allowed.");
      return;
    }
    if (file.size > maxFileSize) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    if (!jobTitle) {
      alert("Please specify the Job Title/Role before uploading.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobTitle", jobTitle);

    try {
      const response = await fetch("https://resume-score-checker-2x12.onrender.com/check-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();

      // Navigate to result page and pass data
      navigate("/result", {
        state: { analysis: data, fileName: file.name, jobTitle },
      });
    } catch (err) {
      console.error(err);
      alert("Error analyzing resume");
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <div className="bg-white flex flex-col items-center pt-6 px-6">
        {/* AI Powered Tag */}
        <div className="mb-4">
          <button className="rounded-full px-4 py-1 text-sm text-white font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-opacity-30 backdrop-blur-md border border-white/20 shadow-lg">
            + AI Powered
          </button>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl font-bold text-center text-blue-600 leading-tight mb-2">
          Smart Resume Check Fast & Free
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Fix errors, improve keywords, and boost your chances.
        </p>

        {/* Job Title Input */}
        <div className="max-w-md w-full mx-auto mb-4">
          <label htmlFor="roleInput" className="block mb-1 text-gray-700 ">
            Specify Role/Job Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="roleInput"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Software Engineer"
            className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
          />
          
        </div>

        {/* Resume Upload area */}
        <div className="w-full max-w-md mx-auto mb-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-10 bg-blue-50 rounded-xl border border-blue-300">
              <svg
                className="animate-spin h-10 w-10 text-blue-500 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              <p className="text-blue-600 font-semibold">
                Analyzing your resume...
              </p>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${
                dragActive
                  ? "border-blue-700 bg-blue-100"
                  : "border-blue-500 bg-blue-50"
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <p className="text-sm text-gray-700 mb-2">
                Drop your resume here or click to select a file.
                <br />
                PDF & DOC/DOCX only. Max 5MB file size.
              </p>
              <input
                type="file"
                id="fileInput"
                accept=".pdf, .doc, .docx, application/msword, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={onFileChange}
                className="hidden"
              />
              <button className="bg-gradient-to-r cursor-pointer from-blue-500 via-indigo-500 to-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition">
                Upload Your Resume
              </button>
            </div>
          )}
        </div>

        {/* Key Features */}
        <div className="w-full max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-700 flex items-center gap-2">
            Key Features <span className="text-blue-500">+</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md flex flex-col gap-3 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeScoreChecker;
