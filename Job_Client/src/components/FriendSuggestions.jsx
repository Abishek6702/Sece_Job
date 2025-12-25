import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobSuggestions() {
  const navigate = useNavigate();
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAllJobs(Array.isArray(data) ? data : []))
      .catch(() => setAllJobs([]))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Sort by postedAt (latest first)
  const sortedJobs = React.useMemo(() => {
    return [...allJobs].sort(
      (a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0)
    );
  }, [allJobs]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 mb-4 w-[95%]">
        <div className="font-medium text-gray-700 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-4 w-[95%]  h-[40vh] ">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-gray-800 text-base">
          Latest Job Posts
        </h2>
        <button
          className="text-xs text-blue-600 font-medium hover:underline"
          onClick={() => navigate("/jobs")}
        >
          See All
        </button>
      </div>

      {/* Job List - scrollable */}
      <ul className="space-y-2 h-[85%] overflow-y-auto pr-1  ">
        {sortedJobs.map((job) => {
          const company = job.companyId || {};
          const logo = company.company_logo
            ? `${company.company_logo}`
            : "/default-logo.png";

          return (
            <li
              key={job._id}
              className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition"
              // onClick={() => navigate(`/jobs/${job._id}`)}
              onClick={() => navigate(`/jobs`)}
            >
              {/* Logo */}
              <img
                src={logo}
                alt={company.company_name || "Company"}
                className="w-9 h-9 rounded-full object-cover border border-gray-200"
              />

              {/* Job Info */}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {job.position || "Job Title"}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {company.company_name || "Company"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}