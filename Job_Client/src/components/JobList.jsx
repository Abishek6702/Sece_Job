import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import JobDetailModel from "./JobDetailModel";
import Search_icon from "../assets/search.png";
import { ListFilter } from "lucide-react";
import Loader from "../components/Loader"
const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchFilter, setSearchFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [workplaceFilter, setWorkplaceFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");

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
        console.log("my company id", myCompanyIds);
        console.log("all jobs", allJobs);
        const myJobs = allJobs.filter((job) =>
          myCompanyIds.includes(job.companyId._id)
        );

        setJobs(myJobs);
        setFilteredJobs(myJobs);
        console.log("Fetched jobs:", myJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsForEmployer();
  }, []);
  console.log("jobs", jobs);

  const timeAgo = (postedAt) => {
    const postedDate = new Date(postedAt);
    if (isNaN(postedDate)) return "Invalid date";

    const now = new Date();
    const diffInMs = now - postedDate;
    const isFuture = diffInMs < 0;

    const absDiffInSeconds = Math.floor(Math.abs(diffInMs) / 1000);
    const absDiffInMinutes = Math.floor(absDiffInSeconds / 60);
    const absDiffInHours = Math.floor(absDiffInMinutes / 60);
    const absDiffInDays = Math.floor(absDiffInHours / 24);
    const absDiffInMonths = Math.floor(absDiffInDays / 30);
    const absDiffInYears = Math.floor(absDiffInDays / 365);

    let timeStr = "";

    if (absDiffInDays < 1) {
      timeStr = `${absDiffInHours}h`;
    } else if (absDiffInDays < 30) {
      timeStr = `${absDiffInDays}d`;
    } else if (absDiffInDays < 365) {
      timeStr = `${absDiffInMonths}m`;
    } else {
      timeStr = `${absDiffInYears}y`;
    }

    return isFuture ? `in ${timeStr}` : timeStr;
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

      const matchesWorkplace = workplaceFilter
        ? job.workplace?.toLowerCase().includes(workplaceFilter.toLowerCase())
        : true;

      const now = new Date();
      const postedDate = new Date(job.postedAt);
      const diffInDays = (now - postedDate) / (1000 * 60 * 60 * 24);

      let matchesTime = true;
      if (timeFilter === "1d") {
        matchesTime = diffInDays <= 1;
      } else if (timeFilter === "7d") {
        matchesTime = diffInDays <= 7;
      } else if (timeFilter === "30d") {
        matchesTime = diffInDays <= 30;
      }

      return (
        matchesSearch && matchesLocation && matchesWorkplace && matchesTime
      );
    });

    setFilteredJobs(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchFilter, locationFilter, workplaceFilter, timeFilter]);

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };
  return (
    <div className="px-6 py-4 min-h-screen bg-white rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Jobs Posted</h2>

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

        <div className="mb-4 flex justify-center flex-wrap">
          <select
            value={workplaceFilter}
            onChange={(e) => setWorkplaceFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md mr-4 mt-2 text-gray-700"
          >
            <option value="">Select Workplace</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Home">Home</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md mt-2 text-gray-700"
          >
            <option value="">Select Time</option>
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button
            onClick={() => {
              setSearchFilter("");
              setLocationFilter("");
              setWorkplaceFilter("");
              setTimeFilter("");
            }}
            className="ml-4 p-2 px-4 bg-blue-500 text-white rounded-md mt-2 flex items-center justify-center gap-1"
          >
            <ListFilter />
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <> <div className="flex flex-col justify-center items-center text-gray-500 py-20 w-full h-full">
                  <Loader/>
                  <p className="mt-4">Loading...</p>
                </div></>
      ) : filteredJobs.length === 0 ? (
        <p>No jobs found for your companies.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {console.log("mapping job", filteredJobs)}
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
                    <p className="font-medium text-gray-600">{job.location}</p>
                    <p className="font-medium text-gray-600">{job.workplace}</p>
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
      {isModalOpen && (
        <div className="joblist_model_bg fixed top-0 left-0 w-full h-full  z-50 flex items-center justify-center ">
          <div className="bg-white rounded-md p-6 w-full max-w-3xl card-container border border-gray-300 ">
            <JobDetailModel job={selectedJob} handleClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
