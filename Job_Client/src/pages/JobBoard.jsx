import React, { useState, useEffect, useRef } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import JobCardList from "../components/JobCardList";
import JobDetails from "../components/JobDetails";
import { jwtDecode } from "jwt-decode";
import nodata from "../assets/cuate.svg";
import { Funnel, Locate, Search } from "lucide-react";
import Loader from "../components/Loader";
import JobBoardHeader from "../components/JobBoardHeader";

export const filterOptions = {
  jobType: ["Full Time", "Freelance", "Internship", "Volunteer"],
  remote: ["On-site", "Remote", "Hybrid"],
  datePosted: ["Anytime", "Last 24 hours", "Last 7 days", "Last 30 days"],
};

const parseMinSalary = (salaryRange) => {
  if (!salaryRange) return 0;
  const parts = salaryRange.replace(/[$,]/g, "").split("-");
  return parseInt(parts[0].trim(), 10) || 0;
};

const getDateFilterRange = (datePostedOption) => {
  const now = new Date();
  switch (datePostedOption) {
    case "Last 24 hours":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case "Last 7 days":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "Last 30 days":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(0);
  }
};

const JobBoard = () => {
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    jobType: [],
    remote: [],
    datePosted: "Anytime",
  });
  const [salaryRange, setSalaryRange] = useState([0, 5000000]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [jobFilter, setJobFilter] = useState("all");
  const [jobsLoading, setJobsLoading] = useState(false);
  const [appliedLoading, setAppliedLoading] = useState(false);
  const [hasInteractedWithSalarySlider, setHasInteractedWithSalarySlider] =
    useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showJobDetailFull, setShowJobDetailFull] = useState(false);

  // === AUTOCOMPLETE states ===
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [filteredTitleSuggestions, setFilteredTitleSuggestions] = useState([]);
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [filteredLocationSuggestions, setFilteredLocationSuggestions] =
    useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // === Refs for debounce/timeouts ===
  const titleFetchTimeout = useRef();
  const locationFetchTimeout = useRef();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Decode user ID token
  useEffect(() => {
    const token = localStorage.getItem("carvion-key");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fetch applied jobs of current user
  useEffect(() => {
    if (!userId) return;
    setAppliedLoading(true);
    const token = localStorage.getItem("carvion-key");
    fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/api/applications/${userId}/applied-jobs`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then((data) => setAppliedJobIds(data.appliedJobs || []))
      .catch((err) => console.error("Error fetching applied jobs:", err))
      .finally(() => setAppliedLoading(false));
  }, [userId]);

  // Fetch all jobs on mount
  useEffect(() => {
    setJobsLoading(true);
    const token = localStorage.getItem("carvion-key");
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setJobs)
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setJobsLoading(false));
  }, []);

  // Extract unique titles and locations from jobs data for autocomplete suggestions
  useEffect(() => {
    if (!jobs || jobs.length === 0) {
      setTitleSuggestions([]);
      setLocationSuggestions([]);
      return;
    }
    const uniqueTitles = [
      ...new Set(jobs.map((job) => job.position).filter(Boolean)),
    ];
    setTitleSuggestions(uniqueTitles);

    const uniqueLocations = [
      ...new Set(jobs.map((job) => job.location).filter(Boolean)),
    ];
    setLocationSuggestions(uniqueLocations);
  }, [jobs]);

  // Filtering jobs based on filters and input values
  useEffect(() => {
    const filterDate = getDateFilterRange(filters.datePosted);

    setFilteredJobs(
      jobs.filter((job) => {
        const matchPosition =
          !position ||
          job.position?.toLowerCase().includes(position.toLowerCase());

        const matchLocation =
          !location ||
          job.location?.toLowerCase().includes(location.toLowerCase());

        const jobTypeFromWorkplace = job.workplace
          ? job.workplace
              .split(",")
              .map((s) => s.trim())
              .find((type) => filterOptions.jobType.includes(type))
          : null;

        const matchJobType =
          filters.jobType.length === 0 ||
          (jobTypeFromWorkplace &&
            filters.jobType.includes(jobTypeFromWorkplace));

        const workplaceType = job.workplace
          ? filterOptions.remote.find((opt) =>
              job.workplace
                .toLowerCase()
                .split(",")
                .some((val) => val.trim() === opt.toLowerCase())
            )
          : null;

        const matchRemote =
          filters.remote.length === 0 ||
          (workplaceType && filters.remote.includes(workplaceType));

        const jobDate = new Date(job.postedAt);
        const matchDatePosted =
          filters.datePosted === "Anytime" || jobDate >= filterDate;

        const jobMinSalary = parseMinSalary(job.salaryRange);
        const matchSalary =
          !hasInteractedWithSalarySlider ||
          (jobMinSalary >= salaryRange[0] && jobMinSalary <= salaryRange[1]);

        return (
          matchPosition &&
          matchLocation &&
          matchJobType &&
          matchRemote &&
          matchDatePosted &&
          matchSalary
        );
      })
    );
  }, [
    jobs,
    position,
    location,
    filters,
    salaryRange,
    appliedJobIds,
    jobFilter,
    hasInteractedWithSalarySlider,
  ]);

  // Autocomplete input handlers for Job Title

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setPosition(value);

    if (!value) {
      setFilteredTitleSuggestions([]);
      setShowTitleDropdown(false);
      return;
    }

    clearTimeout(titleFetchTimeout.current);
    // debounce 150ms
    titleFetchTimeout.current = setTimeout(() => {
      const filtered = titleSuggestions.filter((title) =>
        title.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredTitleSuggestions(filtered);
      setShowTitleDropdown(filtered.length > 0);
    }, 150);
  };

  // Autocomplete input handlers for Location

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);

    if (!value) {
      setFilteredLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    clearTimeout(locationFetchTimeout.current);
    // debounce 150ms
    locationFetchTimeout.current = setTimeout(() => {
      const filtered = locationSuggestions.filter((loc) =>
        loc.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredLocationSuggestions(filtered);
      setShowLocationDropdown(filtered.length > 0);
    }, 150);
  };

  // Handle selecting autocomplete option for Title
  const selectTitleSuggestion = (title) => {
    setPosition(title);
    setShowTitleDropdown(false);
  };

  // Handle selecting autocomplete option for Location
  const selectLocationSuggestion = (loc) => {
    setLocation(loc);
    setShowLocationDropdown(false);
  };

  // Reset filters
  const handleCheckbox = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((v) => v !== value)
        : [...prev[name], value],
    }));
  };

  const handleSelect = (e) => {
    setFilters((prev) => ({ ...prev, datePosted: e.target.value }));
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    if (isMobile) setShowJobDetailFull(true);
  };

  const handleCloseJobDetail = () => {
    setShowJobDetailFull(false);
    setTimeout(() => setSelectedJob(null), 250);
  };

  // UI rendering below...

  return (
    <>
      {/* If a job is selected, show full page details with breadcrumbs */}
      {selectedJob ? (
        <div className="w-full px-4 md:px-8 mx-auto mt-4 h-[88vh] overflow-auto">
           <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 px-4">
              <span className="cursor-pointer hover:text-blue-600 font-medium" onClick={handleCloseJobDetail}>Jobs</span>
              <span>/</span>
              <span className="font-semibold text-gray-900">{selectedJob.position}</span>
           </div>
           <JobDetails
                  job={selectedJob}
                  onClose={handleCloseJobDetail}
                  isExpanded={true}
           />
        </div>
      ) : (
      <>
      {/* Filter button for mobile */}
      {isMobile && !showMobileFilter && (
        <button
          onClick={() => setShowMobileFilter(true)}
          className="flex items-center gap-2 fixed z-10 bottom-6 right-6 p-3 px-4 bg-blue-600 text-white rounded-full shadow-lg"
        >
          <Funnel className="w-5" />
          Filter & Search
        </button>
      )}

      <div className="w-full   mx-auto  h-[88vh] overflow-auto">
        <div className="hidden">
          <JobBoardHeader 
          isMobile={isMobile}
          showMobileFilter={showMobileFilter}
          setShowMobileFilter={setShowMobileFilter}
          position={position}
          handleTitleChange={handleTitleChange}
          location={location}
          handleLocationChange={handleLocationChange}
          showTitleDropdown={showTitleDropdown}
          setShowTitleDropdown={setShowTitleDropdown}
          filteredTitleSuggestions={filteredTitleSuggestions}
          selectTitleSuggestion={selectTitleSuggestion}
          showLocationDropdown={showLocationDropdown}
          setShowLocationDropdown={setShowLocationDropdown}
          filteredLocationSuggestions={filteredLocationSuggestions}
          selectLocationSuggestion={selectLocationSuggestion}
          filters={filters}
          salaryRange={salaryRange}
          setSalaryRange={setSalaryRange}
          setHasInteractedWithSalarySlider={setHasInteractedWithSalarySlider}
          jobFilter={jobFilter}
          setJobFilter={setJobFilter}
          handleCheckbox={handleCheckbox}
          handleSelect={handleSelect}
          clearFilters={() => {
            setFilters({ jobType: [], remote: [], datePosted: "Anytime" });
            setSalaryRange([0, 5000000]);
            setJobFilter("all");
            setHasInteractedWithSalarySlider(false);
            setPosition("");
            setLocation("");
          }}
        />
        </div>

          <div className=" font-semibold text-gray-700 flex justify-between items-center">
            {jobsLoading || appliedLoading ? (
              <div className="flex justify-center w-full mt-20">
                <Loader />
              </div>
            ) : (
              <>
                {/* <p className="text-xl text-gray-800">
                <span className="text-blue-600 font-bold mr-2">
                  {filteredJobs.filter((job) => !appliedJobIds.includes(job._id)).length}
                </span>
                Job results
              </p> */}
              </>
            )}
          </div>

          {/* Job listing area */}
          {!(jobsLoading || appliedLoading) && (
            filteredJobs.length === 0 ? (
              <div className="text-center text-gray-500">
                <img src={nodata} className="w-64 m-auto opacity-75" />
                <p className="text-xl font-semibold mt-4">No Jobs Found</p>
              </div>
            ) : (
              <div className="">
                <JobCardList
                  jobs={filteredJobs}
                  onSelectJob={handleSelectJob}
                  selectedJob={selectedJob}
                />
              </div>
            )
          )}
        </div>
      </>
      )}
    </>
  );
};

export default JobBoard;
