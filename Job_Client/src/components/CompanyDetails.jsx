import React, { useState } from "react";
import { Link, Element, scroller } from "react-scroll";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import { jwtDecode } from "jwt-decode";
import nodata from "../assets/cuate.svg"

const CompanyDetails = ({ companyDetails, setFullScreeen, fullScreen }) => {
  const { state } = useLocation();
  const [showMore, setshowMore] = useState(false);
  const navigate = useNavigate();

  const { savedJobs, toggleSaveJob } = useAppContext();

  const {
    company_logo,
    company_name,
    company_type,
    location,
    followers_count,
    employee_count,
    site_url,
    about = {},
    jobs = [],
    people = [],
    images = [],
  } = companyDetails;

  const tabs = [
    { name: "About", to: "about-section" },
    { name: "Jobs", to: "jobs-section" },
    { name: "People", to: "people-section" },
    { name: "Life", to: "life-section" },
  ];
  const [visibleCount, setVisibleCount] = useState(2);

  const showMoreJobs = () => {
    setVisibleCount((prev) => prev + 2);
  };

  const visibleJobs = jobs.slice(0, visibleCount);
  if (!companyDetails || Object.keys(companyDetails).length === 0) {
    return (
      <div className=" hidden main_conatiner md:grid col-span-8 absolute mt-10 items-center justify-center  ">
        <img src={nodata} className="w-80" />
        <p className="text-center text-xl font-semibold text-gray-500 mt-4">No Results Found</p>
      </div>
    );
  }
  {
    console.log("job id for job : ", visibleJobs);
  }
  const getAppliedJobsFromToken = () => {
    const token = localStorage.getItem("token"); 
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("token decoded", decodedToken);
      return decodedToken.appliedjobs || []; 
    }
    return [];
  };

  const appliedJobs = getAppliedJobsFromToken();

  return (
    <div
      className={` p-4 md:p-8 rounded-lg mt-4 border border-gray-300 h-[100vh] overflow-auto sticky top-0 bg-white  ${
        fullScreen
          ? `grid col-span-12 p-8 rounded-lg mt-4 border border-gray-300 bg-white`
          : `col-span-8`
      }`}
    >
      <div className="flex justify-between items-start relative h-fit ">
        <div className="w-full">
          <div className="flex items-center gap-3">
            <img
              src={`${company_logo}`}
              alt="Company Logo"
              className="w-22 h-22 rounded-full object-cover border border-gray-300"
            />
          </div>
          <div className="w-full flex items-center justify-between">
            <span className="text-2xl font-semibold">{company_name}</span>
            <a
              href={site_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border rounded-full font-semibold"
            >
              Visit Website
            </a>
          </div>
          <p className="mt-2 text-lg text-gray-600">
            {company_type?.toLowerCase()}
          </p>
          <div className="text-md text-gray-500 flex gap-2 mt-4">
            <p>{location} .</p>
            <p>{followers_count} followers .</p>
            <p>{employee_count}+ employees</p>
          </div>
        </div>
      </div>

      <div className="sticky top-[-35px] bg-white z-10 p-2 border-b-1 border-gray-400 mt-8 flex gap-6">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            to={tab.to}
            smooth={true}
            duration={500}
            offset={-80}
            className="cursor-pointer text-gray-600 hover:text-black font-medium"
            activeClass="border-b-2 border-blue-500 text-black"
            spy={true}
          >
            {tab.name}
          </Link>
        ))}
      </div>

      <Element name="about-section" className="pt-8">
        <h2 className="text-lg font-semibold mb-2 ">About</h2>
        <p
          className={`text-gray-700 mb-4 ${
            showMore ? "h-auto" : "h-[50px] overflow-hidden"
          }`}
        >
          {about.content}
        </p>
        <div className="flex justify-end mt-[-15px]">
          <button
            onClick={() => {
              setshowMore(!showMore);
            }}
            className="font-bold"
          >
            {!showMore ? "See more" : "See less"}
          </button>
        </div>
        <div className="mt-4 mb-4">
          <div className="border p-4 border-gray-400 rounded-md">
            <p className="text-gray-500 text-sm mb-1">Contact Info</p>
            <p className="text-sm">{about.contact_info}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="text-medium font-large text-purple-600 hover:underline inline-flex items-center">
            <p className="font-bold cursor-pointer">Show More </p>
            <span className="ml-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 1.25C6.072 1.25 1.25 6.072 1.25 12C1.25 17.928 6.072 22.75 12 22.75C17.928 22.75 22.75 17.928 22.75 12C22.75 6.072 17.928 1.25 12 1.25ZM12 21.25C6.899 21.25 2.75 17.101 2.75 12C2.75 6.899 6.899 2.75 12 2.75C17.101 2.75 21.25 6.899 21.25 12C21.25 17.101 17.101 21.25 12 21.25ZM16.6919 12.2871C16.6539 12.3791 16.599 12.462 16.53 12.531L13.53 15.531C13.384 15.677 13.192 15.751 13 15.751C12.808 15.751 12.616 15.678 12.47 15.531C12.177 15.238 12.177 14.763 12.47 14.47L14.1899 12.75H8C7.586 12.75 7.25 12.414 7.25 12C7.25 11.586 7.586 11.25 8 11.25H14.189L12.469 9.53003C12.176 9.23703 12.176 8.76199 12.469 8.46899C12.762 8.17599 13.237 8.17599 13.53 8.46899L16.53 11.469C16.599 11.538 16.6539 11.6209 16.6919 11.7129C16.7679 11.8969 16.7679 12.1031 16.6919 12.2871Z"
                  fill="#6532C1"
                />
              </svg>
            </span>
          </button>
        </div>
      </Element>

      <Element
        name="jobs-section"
        className="mt-4 pt-4 border-t border-gray-300"
      >
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Jobs</h2>

        {jobs.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleJobs.map((job, index) => {
              const jobId = job._id.toString(); 
              const isApplied = appliedJobs.includes(jobId);
              const isJobSaved = savedJobs.includes(job._id); 
              return (
                <div
                  key={index}
                  className="border border-gray-300 rounded-xl p-4 relative bg-white "
                >
                  <svg
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-5 top-5 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveJob(job._id); 
                    }}
                  >
                    {isJobSaved ? (
                      <path
                        d="M11 0H3C1 0 0 1 0 3V18L7 14L14 18V3C14 1 13 0 11 0ZM9.5 7.75H4.5C4.086 7.75 3.75 7.414 3.75 7C3.75 6.586 4.086 6.25 4.5 6.25H9.5C9.914 6.25 10.25 6.586 10.25 7C10.25 7.414 9.914 7.75 9.5 7.75Z"
                        fill="blue" 
                      />
                    ) : (
                      <path
                        d="M12 0.25H4C1.582 0.25 0.25 1.582 0.25 4V19C0.25 19.268 0.393023 19.5149 0.624023 19.6479C0.740023 19.716 0.87 19.75 1 19.75C1.128 19.75 1.25707 19.717 1.37207 19.651L8 15.863L14.6279 19.65C14.8599 19.783 15.146 19.782 15.376 19.647C15.607 19.513 15.75 19.266 15.75 18.999V3.99902C15.75 1.58202 14.418 0.25 12 0.25ZM14.25 17.707L8.37207 14.349C8.14207 14.217 7.85793 14.217 7.62793 14.349L1.75 17.708V4C1.75 2.423 2.423 1.75 4 1.75H12C13.577 1.75 14.25 2.423 14.25 4V17.707ZM11.75 6C11.75 6.414 11.414 6.75 11 6.75H5C4.586 6.75 4.25 6.414 4.25 6C4.25 5.586 4.586 5.25 5 5.25H11C11.414 5.25 11.75 5.586 11.75 6Z"
                        fill="black" 
                      />
                    )}
                  </svg>

                  <div className="flex items-center gap-2">
                    <img
                      src={`${company_logo}`}
                      alt="Company Logo"
                      className="w-10 h-10 border rounded-full object-cover border-gray-400"
                    />
                    <p className="font-bold text-gray-400">{company_name}</p>
                  </div>

                  <p className="font-semibold mt-2">{job.position}</p>
                  <p className="text-sm text-gray-600 mt-1">{job.location}</p>

                  <div className="mt-4 flex justify-between items-center">
                    <button
                      className="border px-4 py-1 cursor-pointer border-blue-600 rounded-full text-blue-600 font-semibold text-sm"
                      onClick={() => {
                        navigate("/jobapplicationform", {
                          state: {
                            job,
                          },
                        });
                      }}
                      disabled={isApplied}
                    >
                      {isApplied ? "Already Applied" : "Easy Apply"}
                    </button>

                    <p className="text-sm text-gray-500">{job.createdAt}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No current job openings</p>
        )}

        {jobs.length > 2 && (
          <div className="flex justify-end mt-4">
            <button
              onClick={() =>
                setVisibleCount((prev) => (prev === 2 ? jobs.length : 2))
              }
              className="text-purple-600 flex  items-center text-md font-semibold"
            >
              {visibleCount === 2 ? (
                <>
                  <p className="cursor-pointer"> Show More Jobs</p>
                  <svg
                    className="ml-2"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 1.25C6.072 1.25 1.25 6.072 1.25 12C1.25 17.928 6.072 22.75 12 22.75C17.928 22.75 22.75 17.928 22.75 12C22.75 6.072 17.928 1.25 12 1.25ZM12 21.25C6.899 21.25 2.75 17.101 2.75 12C2.75 6.899 6.899 2.75 12 2.75C17.101 2.75 21.25 6.899 21.25 12C21.25 17.101 17.101 21.25 12 21.25ZM16.6919 12.2871C16.6539 12.3791 16.599 12.462 16.53 12.531L13.53 15.531C13.384 15.677 13.192 15.751 13 15.751C12.808 15.751 12.616 15.678 12.47 15.531C12.177 15.238 12.177 14.763 12.47 14.47L14.1899 12.75H8C7.586 12.75 7.25 12.414 7.25 12C7.25 11.586 7.586 11.25 8 11.25H14.189L12.469 9.53003C12.176 9.23703 12.176 8.76199 12.469 8.46899C12.762 8.17599 13.237 8.17599 13.53 8.46899L16.53 11.469C16.599 11.538 16.6539 11.6209 16.6919 11.7129C16.7679 11.8969 16.7679 12.1031 16.6919 12.2871Z"
                      fill="#6532C1"
                    />
                  </svg>
                </>
              ) : (
                <>
                  <p className="cursor-pointer">Show Less</p>
                  <svg
                    className="ml-2 rotate-180"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 1.25C6.072 1.25 1.25 6.072 1.25 12C1.25 17.928 6.072 22.75 12 22.75C17.928 22.75 22.75 17.928 22.75 12C22.75 6.072 17.928 1.25 12 1.25ZM12 21.25C6.899 21.25 2.75 17.101 2.75 12C2.75 6.899 6.899 2.75 12 2.75C17.101 2.75 21.25 6.899 21.25 12C21.25 17.101 17.101 21.25 12 21.25ZM16.6919 12.2871C16.6539 12.3791 16.599 12.462 16.53 12.531L13.53 15.531C13.384 15.677 13.192 15.751 13 15.751C12.808 15.751 12.616 15.678 12.47 15.531C12.177 15.238 12.177 14.763 12.47 14.47L14.1899 12.75H8C7.586 12.75 7.25 12.414 7.25 12C7.25 11.586 7.586 11.25 8 11.25H14.189L12.469 9.53003C12.176 9.23703 12.176 8.76199 12.469 8.46899C12.762 8.17599 13.237 8.17599 13.53 8.46899L16.53 11.469C16.599 11.538 16.6539 11.6209 16.6919 11.7129C16.7679 11.8969 16.7679 12.1031 16.6919 12.2871Z"
                      fill="#6532C1"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </Element>

      <Element
        name="people-section"
        className=" mt-4 pt-4 border-t-1 border-gray-300"
      >
        <h2 className="text-lg font-semibold mb-4">People</h2>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">
              580 employees who studied industrial design and Product design
            </p>
            <div className="flex items-center space-x-[-10px]">
              {[...Array(5)].map((_, index) => (
                <img
                  key={index}
                  src={`https://i.pravatar.cc/150?img=${index + 5}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-2 border-white shadow"
                />
              ))}
              <div className="w-8 h-8 flex items-center justify-center text-xs font-semibold bg-gray-200 text-gray-600 rounded-full border-2 border-white shadow">
                99+
              </div>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium mb-2">
              26 employees work in {company_name}
            </p>
            <div className="flex items-center space-x-[-10px]">
              {[...Array(4)].map((_, index) => (
                <img
                  key={index}
                  src={`https://i.pravatar.cc/150?img=${index + 10}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border-2 border-white shadow"
                />
              ))}
              <div className="w-8 h-8 flex items-center justify-center text-xs font-semibold bg-gray-200 text-gray-600 rounded-full border-2 border-white shadow">
                21+
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button className="text-medium font-large text-purple-600 hover:underline inline-flex items-center">
            <p className="font-bold cursor-pointer">Show More People </p>
            <span className="ml-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 1.25C6.072 1.25 1.25 6.072 1.25 12C1.25 17.928 6.072 22.75 12 22.75C17.928 22.75 22.75 17.928 22.75 12C22.75 6.072 17.928 1.25 12 1.25ZM12 21.25C6.899 21.25 2.75 17.101 2.75 12C2.75 6.899 6.899 2.75 12 2.75C17.101 2.75 21.25 6.899 21.25 12C21.25 17.101 17.101 21.25 12 21.25ZM16.6919 12.2871C16.6539 12.3791 16.599 12.462 16.53 12.531L13.53 15.531C13.384 15.677 13.192 15.751 13 15.751C12.808 15.751 12.616 15.678 12.47 15.531C12.177 15.238 12.177 14.763 12.47 14.47L14.1899 12.75H8C7.586 12.75 7.25 12.414 7.25 12C7.25 11.586 7.586 11.25 8 11.25H14.189L12.469 9.53003C12.176 9.23703 12.176 8.76199 12.469 8.46899C12.762 8.17599 13.237 8.17599 13.53 8.46899L16.53 11.469C16.599 11.538 16.6539 11.6209 16.6919 11.7129C16.7679 11.8969 16.7679 12.1031 16.6919 12.2871Z"
                  fill="#6532C1"
                />
              </svg>
            </span>
          </button>
        </div>
      </Element>

      <Element
        name="life-section"
        className=" mt-4 pt-4 border-t-1 border-gray-300"
      >
        <h2 className="text-lg font-semibold mb-2">Life at {company_name}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((img, index) => (
            <img
              key={index}
              src={`${img}`}
              alt={`Company life ${index + 1}`}
              onError={(e) => (e.target.style.display = "none")}
              className="rounded-md object-cover h-32 w-full"
            />
          ))}
        </div>
      </Element>
    </div>
  );
};

export default CompanyDetails;
