import React, { useState } from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobDetailsModal from "../JobDetailsModal";
import { formatDistanceToNow } from "date-fns";
import nodata from "../../assets/cuate.svg"

const JobsTab = ({
  jobs = [],
  savedJobs = [],
  appliedJobs = [],
  toggleSaveJob,
}) => {
  const navigate = useNavigate();
  const [modalJob, setModalJob] = useState(null);

  return (
    <div>
      <h3 className="font-bold text-xl mb-8 flex items-center gap-3 text-blue-800">
        <Bookmark size={26} /> Saved Jobs
      </h3>

      {!jobs || jobs.length === 0 ? (
        <div className="text-gray-500 text-center py-12  ">
          <img src={nodata} className="w-50 m-auto" />
          No saved jobs yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => {
            const isApplied = appliedJobs.includes(job._id);
            const company = job.companyId;

            return (
              <div
                key={job._id}
                className="relative flex flex-col justify-between gap-4 bg-gradient-to-br from-blue-50 via-white to-white border border-blue-100 rounded-xl shadow hover:shadow-md transition p-6 cursor-pointer"
                onClick={() => setModalJob(job)}
              >
                <div
                  className="absolute top-2 right-5 flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                   <span className="text-gray-400 text-xs ml-4 whitespace-nowrap">
                    {job.postedAt
                      ? `${formatDistanceToNow(new Date(job.postedAt), {
                          addSuffix: true,
                        })}`
                      : ""}
                  </span>
                  <button
                    type="button"
                    aria-label={
                      savedJobs.includes(job._id) ? "Unsave Job" : "Save Job"
                    }
                    onClick={() => toggleSaveJob(job._id)}
                  >
                    <Bookmark
                      size={24}
                      className={
                        savedJobs.includes(job._id)
                          ? "text-blue-600 fill-blue-600"
                          : "text-gray-300"
                      }
                      fill={
                        savedJobs.includes(job._id) ? "currentColor" : "none"
                      }
                    />
                  </button>
                  
                </div>

                <div className="flex items-center gap-3">
                  {company?.company_logo && (
                    <img
                      src={`${company.company_logo.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt="Company Logo"
                      className="w-10 h-10 object-cover rounded-full border border-gray-300"
                    />
                  )}
                  <div className="flex flex-col min-w-0">
                    <p className="text-md text-[#6a52c9] font-bold truncate">
                      {company?.company_name}
                    </p>
                    <h4 className="text-base font-semibold text-gray-800   w-[90%] truncate">
                      {job.position}
                    </h4>

                    <p className="text-gray-400 text-xs truncate">
                      {job.location}
                    </p>
                  </div>
                </div>

                
              </div>
            );
          })}
        </div>
      )}

      <JobDetailsModal
        job={modalJob}
        isOpen={!!modalJob}
        onClose={() => setModalJob(null)}
        isSaved={modalJob ? savedJobs.includes(modalJob._id) : false}
        isApplied={modalJob ? appliedJobs.includes(modalJob._id) : false}
        onSaveToggle={toggleSaveJob}
      />
    </div>
  );
};

export default JobsTab;
