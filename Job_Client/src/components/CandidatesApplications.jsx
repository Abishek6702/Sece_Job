import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Search_icon from "../assets/search.png";
import Loader from "./Loader";
const CandidatesApplication = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    const fetchJobsForEmployer = async () => {
      try {
        const token = localStorage.getItem("token");
        let employerId = null;

        if (token) {
          try {
            const decoded = jwtDecode(token);
            employerId = decoded?.userId || decoded?.id;
            console.log("Employer ID:", employerId);
          } catch (err) {
            console.error("JWT decode failed:", err);
          }
        }

        if (!employerId) {
          console.warn("Employer ID missing.");
          return;
        }

        const companyRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/companies`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const allCompanies = await companyRes.json();

        const myCompanies = allCompanies.filter(
          (company) => company.createdBy === employerId
        );

        if (myCompanies.length === 0) {
          console.log("No companies found for this employer.");
          return;
        }

        const jobsRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/jobs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const allJobs = await jobsRes.json();

        const myCompanyIds = myCompanies.map((c) => c._id);
        const myJobs = allJobs.filter((job) =>
          myCompanyIds.includes(job.companyId._id)
        );

        setJobs(myJobs);
        setFilteredJobs(myJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsForEmployer();
  }, []);

  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      const token = localStorage.getItem("token");
      const applicationsRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const allApplications = await applicationsRes.json();
      setApplications(allApplications);
      console.log("Fetched applications:", allApplications);
    };

    fetchJobsAndApplications();
  }, []);

  const timeAgo = (postedAt) => {
    const postedDate = new Date(postedAt);
    const now = new Date();
    const diffInMs = now - postedDate;

    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInDays < 1) {
      return `${Math.floor(diffInHours)}h`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks}w`;
    } else {
      return `${Math.floor(diffInDays / 30)}m`;
    }
  };

  const applyFilters = () => {
    const filtered = jobs.filter((job) => {
      const lowerCaseSearchFilter = searchFilter.toLowerCase();
      const lowerCaseLocationFilter = locationFilter.toLowerCase();

      const matchesSearch =
        job.companyId.company_name
          .toLowerCase()
          .includes(lowerCaseSearchFilter) ||
        job.position.toLowerCase().includes(lowerCaseSearchFilter);

      const matchesLocation = job.location
        .toLowerCase()
        .includes(lowerCaseLocationFilter);

      return matchesSearch && matchesLocation;
    });

    setFilteredJobs(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchFilter, locationFilter]);

  const getApplicationCount = (jobId) => {
    return applications.filter((app) => {
      if (app.jobId && app.jobId._id) {
        const status = app.status?.toLowerCase();
        return (
          app.jobId._id === jobId &&
          (status === "pending" || status === "rejected")
        );
      }
      return false;
    }).length;
  };

  const navigate = useNavigate();
  const openModal = (job) => {
    navigate(`/employer-dashboard/job-application/${job._id}`);
  };

  return (
    <div className="main_container ">
      <div className="card_container  ">
        <div className="px-6 py-4 min-h-screen bg-white">
          <h2 className="text-2xl font-bold mb-4">Jobs Posted</h2>

          <div className="">
            <div className="mb-2 sm:flex items-center justify-center sm:border border-gray-300 rounded-full sm:w-[60%] m-auto">
              <div className=" w-full sm:w-[50%] text-gray-500">
                <input
                  type="text"
                  placeholder="Search by Company Name or Job Title"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="px-3   w-[90%] sm:w-full  border-gray-300 rounded-md mr-4 outline-none border sm:border-none  mb-4 sm:mb-0"
                />
              </div>
              <div className="  hidden md:block line  h-[20px] border border-gray-300"></div>
              <div className=" w-full sm:w-[50%] sm:flex justify-between items-center">
                <div className="location_input text-gray-500">
                  <input
                    type="text"
                    placeholder="Search by Location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="px-2   w-[90%] sm:w-full  border-gray-300 rounded-md mr-4 outline-none border sm:border-none "
                  />
                </div>
                <div className=" search-icon hidden md:block lg:h-12 lg:w-12 ">
                  <img src={Search_icon} className="p-1" />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <>
              {" "}
              <div className="flex flex-col justify-center items-center text-gray-500 py-20 w-full h-full">
                <Loader />
                <p className="mt-4">Loading...</p>
              </div>
            </>
          ) : filteredJobs.length === 0 ? (
            <p>No jobs found for your companies.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4  h-[70vh] overflow-y-auto">
              {filteredJobs.map((job) => (
                <div
                  className="card_container "
                  key={job._id}
                  onClick={() => openModal(job)}
                >
                  <div className="card w-full">
                    <div className="relative card-container border border-gray-300 rounded-md p-4 h-full flex flex-col justify-between">
                      <div className="card-title flex items-center justify-between">
                        <div className="company-name flex gap-2">
                          <img
                            src={`${
                              job.companyId.company_logo
                            }`}
                            alt="Company Logo"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <p className="text-gray-500 font-medium">
                            {job.companyId.company_name}
                          </p>
                        </div>
                      </div>

                      <div className="card-body mt-4">
                        <p className="text-xl md:text-2xl font-semibold truncate max-w-[370px]">
                          {job.position}
                        </p>
                        <p className="font-medium text-gray-600">
                          {job.location}
                        </p>
                        <p className="font-medium text-gray-600">
                          {job.workplace}
                        </p>
                        <p className="font-medium text-black-600 mt-2">
                          Total Active Applicants:{" "}
                          <span className="font-bold text-blue-600">
                            {getApplicationCount(job._id)}
                          </span>
                        </p>
                      </div>

                      <div className="posted-date ml-4 whitespace-nowrap absolute right-8">
                        <p className="text-sm text-black">
                          {timeAgo(job.postedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidatesApplication;
