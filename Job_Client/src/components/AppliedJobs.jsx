import { EllipsisVertical } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import resume_icon from "../assets/resume_icon.png";

const AppliedJobs = ({ jobs, userId }) => {
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null); 
  const dropdownRefs = useRef({}); 

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/applications`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Error fetching applications: ${response.statusText}`
          );
        }

        const applications = await response.json();

        const filtered = applications.filter(
          (app) => app.userId._id === userId
        );
        setFilteredApplications(filtered);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchApplications();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdownId &&
        dropdownRefs.current[openDropdownId] &&
        !dropdownRefs.current[openDropdownId].contains(event.target)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  const toggleDropdown = (jobId) => {
    setOpenDropdownId((prev) => (prev === jobId ? null : jobId));
  };

  const openModal = (jobId) => {
    const application = filteredApplications.find(
      (app) => app.jobId && app.jobId._id === jobId
    );
    if (application) {
      setSelectedApplication(application);
      setIsModalOpen(true);
      setOpenDropdownId(null);
    } else {
      console.warn("No application found for jobId:", jobId);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const withdrawApplication = async (jobId) => {
    const application = filteredApplications.find(
      (app) => app.jobId && app.jobId._id === jobId
    );

    if (!application) {
      alert("Application not found for this job.");
      setOpenDropdownId(null);
      return;
    }

    const confirmWithdraw = window.confirm(
      "Are you sure you want to withdraw your application?"
    );

    if (!confirmWithdraw) {
      setOpenDropdownId(null);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to withdraw an application.");
        setOpenDropdownId(null);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/applications/${application._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to withdraw application: ${response.statusText}`
        );
      }

      alert("Application withdrawn successfully.");
      window.location.reload();

      setFilteredApplications((prev) =>
        prev.filter((app) => app._id !== application._id)
      );

      setOpenDropdownId(null);
    } catch (error) {
      console.error(error);
      alert("An error occurred while withdrawing the application.");
      setOpenDropdownId(null);
    }
  };

  if (!jobs || jobs.length === 0) {
    return <p className="text-gray-500">No applied jobs yet.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m">
        {jobs.map((job, index) => {
          const application = filteredApplications.find(
            (app) => app.jobId && app.jobId._id === job._id
          );

          return (
            <div
              key={job._id}
              className="border border-gray-300 rounded-xl p-4 flex gap-4 items-start relative mb-12"
            >
              <img
                src={
                  job.companyLogo
                    ? `${import.meta.env.VITE_API_BASE_URL}/${job.companyLogo.replace(
                        /\\/g,
                        "/"
                      )}`
                    : ""
                }
                alt={job.companyName}
                className="w-16 h-16 object-contain rounded-full border"
              />
              <div className="flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {job.position}
                  </h3>
                  <p className="text-gray-600">{job.companyName}</p>
                  <p className="text-gray-500 text-sm">{job.location}</p>
                  {application && (
                   <span
                   className={`inline-block px-3 py-1 rounded-md text-xs font-semibold mt-2
                     ${
                       application.status === "selected" || application.status === "in progress"
                         ? "bg-green-100 text-green-700"
                         : application.status === "rejected" || application.status === "not selected"
                         ? "bg-red-100 text-red-700"
                         : "bg-yellow-100 text-yellow-500"
                     }
                   `}
                 >
                   {application.status}
                 </span>
                 
                  )}
                </div>
              </div>

              <div
                className="relative"
                ref={(el) => (dropdownRefs.current[job._id] = el)}
              >
                <button
                  onClick={() => toggleDropdown(job._id)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={openDropdownId === job._id}
                  aria-label="Open options menu"
                >
                  <EllipsisVertical size={20} />
                </button>

                {openDropdownId === job._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button
                      onClick={() => openModal(job._id)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      View Application
                    </button>
                    <button
                      onClick={() => withdrawApplication(job._id)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Withdraw Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 tint flex justify-center items-start overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl m-4 shadow-xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
              <div className="flex gap-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  Application Details
                </h2>
                <span
                  className={`inline-block px-3 py-1 rounded-md font-medium ${
                    selectedApplication.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : selectedApplication.status === "rejected"
                      ? "bg-pink-100 text-pink-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {selectedApplication.status}
                </span>
              </div>
              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="text-black"
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
              <section className="rounded-lg shadow-sm p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Full Name" value={selectedApplication.name} />
                  <Info
                    label="Email Address"
                    value={selectedApplication.email}
                  />
                  <Info
                    label="City, State"
                    value={selectedApplication.location}
                  />
                  <Info
                    label="Phone Number"
                    value={selectedApplication.phone || "N/A"}
                  />
                </div>
              </section>

              <section className="rounded-lg shadow-sm p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Relevant Experience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info
                    label="Experience"
                    value={`${selectedApplication.experience || "N/A"} years`}
                  />
                  <Info
                    label="Willing to Relocate"
                    value={
                      selectedApplication.relocation === true
                        ? "Yes"
                        : selectedApplication.relocation === false
                        ? "No"
                        : "N/A"
                    }
                  />
                </div>
              </section>

              <section className="rounded-lg shadow-sm p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Dates Available
                </h3>
                {selectedApplication.datesAvailable &&
                selectedApplication.datesAvailable.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700">
                    {selectedApplication.datesAvailable.map(
                      (dateStr, index) => (
                        <li key={index}>
                          {new Date(dateStr).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-600">No available dates provided.</p>
                )}
              </section>

              <section className="rounded-lg shadow-sm p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Previous Work Experience
                </h3>
                {selectedApplication.pastWorkExperience &&
                selectedApplication.pastWorkExperience.length > 0 ? (
                  selectedApplication.pastWorkExperience.map((exp, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 rounded"
                    >
                      <Info
                        label="Company Name"
                        value={exp.companyName || exp.company || "N/A"}
                      />
                      <Info
                        label="Role"
                        value={exp.role || exp.position || "N/A"}
                      />
                      <Info label="Location" value={exp.location || "N/A"} />
                      <Info label="Duration" value={exp.duration || "N/A"} />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">
                    No previous work experience provided.
                  </p>
                )}
              </section>

              <section className="rounded-lg shadow-sm p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Resume
                </h3>
                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-md">
                  <img src={resume_icon} alt="Resume" className="w-10 h-10" />
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">
                      {selectedApplication.resume
                        ? selectedApplication.resume
                            .split(/[\\/]/)
                            .pop()
                            .split("_")
                            .slice(1)
                            .join("_")
                        : "No resume uploaded"}
                    </p>
                    {selectedApplication.resume && (
                      <div className="flex space-x-4 mt-1">
                        <a
                          href={`${import.meta.env.VITE_API_BASE_URL}/${selectedApplication.resume.replace(
                            /\\/g,
                            "/"
                          )}`}
                          download
                          className="text-green-600 hover:underline"
                        >
                          Download
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
const Info = ({ label, value }) => (
  <div>
    <label className="block text-sm font-semibold text-black">{label}</label>
    <p className="mt-1 text-gray-700">{value}</p>
  </div>
);

export default AppliedJobs;
