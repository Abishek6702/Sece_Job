import React, { useEffect, useState } from "react";
import { ArrowRight, Bookmark, Briefcase } from "lucide-react";
import ApplicationModal from "../../components/tabs/ApplicationModal ";
import nodata from "../../assets/cuate.svg";
import { useNavigate } from "react-router-dom";

const getToken = () => localStorage.getItem("token");

const AppliedJobsTab = ({ jobs = [], savedJobs = [], toggleSaveJob }) => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();                                                             
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch(() => {
        setApplications([]);
        setLoading(false);
      });
  }, []);

  const appliedJobIds = applications.map((app) => app.jobId?._id);
  const appliedJobs = jobs.filter((job) => appliedJobIds.includes(job._id));
  const getApplicationForJob = (jobId) =>
    applications.find((app) => app.jobId?._id === jobId);

  const handleCardClick = (job) => {
    setSelectedJob(job);
    setSelectedApp(getApplicationForJob(job._id));
  };

  const handleWithdraw = (applicationId) => {
    const token = getToken();
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/applications/${applicationId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          setApplications((prev) =>
            prev.filter((app) => app._id !== applicationId)
          );
        } else {
          alert("Failed to withdraw application.");
        }
      })
      .catch(() => alert("Failed to withdraw application."));
  };
  const handleMessageClick = (application) => {
    navigate(`/messages/${application.jobId.companyId.createdBy}`);
    console.log("Navigate to messages for application:", application);

  };

  return (
    <>
      <div className="h-[300px] overflow-y-auto">
        <h3 className="font-bold text-xl  flex items-center gap-3 text-blue-800 mb-4">
          <Briefcase size={26} /> Applied Jobs
        </h3>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : appliedJobs.length === 0 ? (
          <div className="text-gray-500 text-center m-auto ">
            <img src={nodata} alt="" className="w-50 h-50 m-auto" />
            <p>No Data Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {appliedJobs.map((job) => {
              const application = getApplicationForJob(job._id);
              console.log(application);
              return (
                <div
                  key={job._id}
                  className="relative flex items-start gap-5 bg-gradient-to-br from-blue-50 via-white to-white border border-blue-100 rounded-xl shadow hover:shadow-md transition p-6 cursor-pointer"
                  onClick={() => handleCardClick(job)}
                >
                  <div className="absolute top-5 right-5 z-10 flex items-center gap-3">
                  <span className="text-gray-400 text-xs ml-4 whitespace-nowrap">
                        {job.postedAt
                          ? new Date(job.postedAt).toLocaleDateString()
                          : ""}
                      </span>
                    <button
                      type="button"
                      aria-label={
                        savedJobs && savedJobs.includes(job._id)
                          ? "Unsave Job"
                          : "Save Job"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveJob(job._id);
                      }}
                      className="focus:outline-none"
                    >
                      <Bookmark
                        size={24}
                        className={
                          savedJobs && savedJobs.includes(job._id)
                            ? "text-blue-600 fill-blue-600"
                            : "text-gray-300"
                        }
                        fill={
                          savedJobs && savedJobs.includes(job._id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                    
                  </div>
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white border border-gray-300 flex items-center justify-center overflow-hidden shadow">
                    {job.companyId?.company_logo ? (
                      <img
                        src={`${job.companyId.company_logo.replace(/\\/g, "/")}`}
                        alt={job.companyId?.company_name || "Company"}
                        className="w-14 h-14 object-contain"
                      />
                    ) : (
                      <span className="text-gray-300 text-3xl font-bold">
                        ?
                      </span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 truncate">
                        {job.position}
                      </h4>
                      <p className="text-blue-600 font-medium">
                        {job.companyName}
                      </p>
                      <p className="text-gray-500 text-sm">{job.location}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 ">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="border border-blue-300 text-blue-600 py-1 px-4 rounded-full text-xs font-semibold bg-blue-50">
                            {application.status}
                          </span>

                          {application?.status === "pending" ||
                          application?.status === "Applied" ? (
                            <button
                              className="ml-2 px-3 py-1 text-xs rounded bg-red-100 text-red-600 font-semibold border border-red-300 hover:bg-red-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                  window.confirm(
                                    "Are you sure you want to withdraw this application?"
                                  )
                                ) {
                                  handleWithdraw(application._id);
                                }
                              }}
                            >
                              Withdraw
                            </button>
                          ) : (
                            <button
                              className="ml-2 px-3 py-1 text-xs rounded bg-gray-100 text-gray-400 font-semibold border border-gray-300 cursor-not-allowed"
                              disabled
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 text-sm text-blue-800 font-semibold hover:bg-blue-500 hover:text-white p-1 rounded-xl px-2 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMessageClick(application);
                        }}
                      >
                        <span>Message to Employeer</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>

                      
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ApplicationModal
        application={selectedApp}
        job={selectedJob}
        onClose={() => {
          setSelectedApp(null);
          setSelectedJob(null);
        }}
      />
    </>
  );
};

export default AppliedJobsTab;
