import React from "react";
import resume_icon from "../assets/resume_icon.png";
import { Pencil } from "lucide-react";

const ApplicationDetailsModal = ({ application, onClose, onEditStatus }) => {
  if (!application) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 tint flex justify-center items-start overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl m-2 shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
          <div className="flex gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Application Details
            </h2>
            <span
              className={`inline-block px-3 py-1 rounded-md font-medium cursor-pointer ${
                application.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : application.status === "rejected"
                  ? "bg-pink-100 text-pink-700"
                  : "bg-green-100 text-green-700"
              } hover:shadow-md transition`}
              title="Click to edit status"
            >
              {application.status}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-black transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="flex justify-end">
            <button
              className="text-lg text-white mb-4 bg-[#44CF7DCC] p-1 px-4 rounded-lg flex items-center gap-2"
              onClick={() => onEditStatus(application)}
            >
              <Pencil className="w-5 h-5" />
              Change Status
            </button>
          </div>

          <section className="rounded-lg shadow-sm p-5 mt-[-14px]">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Full Name" value={application.name} />
              <Info label="Email Address" value={application.email} />
              <Info label="City, State" value={application.location} />
              <Info label="Phone Number" value={application.phone} />
              <Info
                label="Total Years of Experience"
                value={`${application.experience || "N/A"} years`}
              />
            </div>
          </section>

          <section className="rounded-lg shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resume</h3>
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-md">
              <img src={resume_icon} alt="Resume" className="w-10 h-10" />
              <div className="flex-1">
                <p className="text-gray-800 font-medium">
                  {application.resume
                    ? application.resume
                        .split("/")
                        .pop()
                        .split("_")
                        .slice(1)
                        .join("_")
                    : "No resume uploaded"}
                </p>
                {application.resume && (
                  <div className="flex space-x-4 mt-1">
                    <a
                      href={`${application.resume}`}
                      download
                      className="text-green-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-lg shadow-sm p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Education
            </h3>
            {application.education && application.education.length > 0 ? (
              application.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 rounded"
                >
                  <Info label="Institution" value={edu.institution || "N/A"} />
                  <Info label="University" value={edu.university || "N/A"} />
                  <Info label="Branch" value={edu.branch || "N/A"} />
                  <Info label="Level" value={edu.level || "N/A"} />
                  <Info label="Marks" value={edu.marks || "N/A"} />
                  <Info
                    label="Years"
                    value={
                      edu.yearFrom && edu.yearTo
                        ? `${formatDate(edu.yearFrom)} - ${formatDate(
                            edu.yearTo
                          )}`
                        : "N/A"
                    }
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-600">No education details provided.</p>
            )}
          </section>

          <section className="rounded-lg shadow-sm p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Detailed Experience
            </h3>
            {application.experienceDetails &&
            application.experienceDetails.length > 0 ? (
              application.experienceDetails.map((exp, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 rounded"
                >
                  <Info label="Company" value={exp.company || "N/A"} />
                  <Info label="Title" value={exp.title || "N/A"} />
                  <Info label="Location" value={exp.location || "N/A"} />
                  <Info label="Description" value={exp.description || "N/A"} />
                  <Info
                    label="Years"
                    value={
                      exp.yearFrom && exp.yearTo
                        ? `${formatDate(exp.yearFrom)} - ${formatDate(exp.yearTo)}`
                        : "N/A"
                    }
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-600">No detailed experience provided.</p>
            )}
          </section>

          <section className="rounded-lg shadow-sm p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Questions &amp; Answers
            </h3>
            {application.questionsAndAnswers &&
            application.questionsAndAnswers.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {application.questionsAndAnswers.map((qa, idx) => (
                  <li key={idx}>
                    <span className="font-medium text-gray-900">
                      {qa.question}:
                    </span>{" "}
                    <span className="text-gray-700">{qa.answer}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No questions answered.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <label className="block text-sm font-semibold text-black">{label}</label>
    <p className="mt-1 text-gray-700">{value}</p>
  </div>
);

export default ApplicationDetailsModal;
