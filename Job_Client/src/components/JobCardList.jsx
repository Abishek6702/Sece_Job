import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import { jwtDecode } from "jwt-decode";

const getDaysAgo = (postedAt) => {
  const postDate = new Date(postedAt);
  const now = new Date();
  const diffTime = Math.abs(now - postDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays}d`;
};

const JobCardList = ({ jobs, onSelectJob, selectedJob }) => {
  const { savedJobs, toggleSaveJob, appliedJobs } = useAppContext();
  const navigate = useNavigate();

const filteredJobs = jobs.filter(job => !appliedJobs.includes(job._id.toString()));

  return (
    <>
      <div className="main-container  col-span-12 md:col-span-4  px-4 md:flex flex-wrap gap-4 items-center justify-center">
        {filteredJobs.map((job, index) => {
          const jobId = job._id.toString();
          const isApplied = appliedJobs.includes(jobId);

         
          console.log("Job ID:", jobId);
          console.log("Applied Jobs:", appliedJobs);
          console.log("Is Applied:", isApplied);

          return (
            
              <div
              key={job._id}
                onClick={() => onSelectJob(job)}
                className={`card-container border md:w-[48%]  border-gray-300 rounded-md  p-4 cursor-pointer   mb-5  ${
                  selectedJob?._id === job._id ? "border-black bg-gray-100" : ""
                }`}
              >
                <div className="card-title flex items-center justify-between">
                  <div className="company-name flex gap-2 ">
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
                  <div className="not-saved flex items-center gap-4">
                    <div className="posted-date ">
                    <p className="text-sm text-black">
                      {getDaysAgo(job.postedAt)}
                    </p>
                  </div>
                    {savedJobs.includes(job._id) ? (
                      <svg
                        width="14"
                        height="18"
                        viewBox="0 0 14 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job._id);
                        }}
                      >
                        <path
                          d="M11 0H3C1 0 0 1 0 3V18L7 14L14 18V3C14 1 13 0 11 0ZM9.5 7.75H4.5C4.086 7.75 3.75 7.414 3.75 7C3.75 6.586 4.086 6.25 4.5 6.25H9.5C9.914 6.25 10.25 6.586 10.25 7C10.25 7.414 9.914 7.75 9.5 7.75Z"
                          fill="blue"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="20"
                        viewBox="0 0 16 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job._id);
                        }}
                      >
                        <path
                          d="M12 0.25H4C1.582 0.25 0.25 1.582 0.25 4V19C0.25 19.268 0.393023 19.5149 0.624023 19.6479C0.740023 19.716 0.87 19.75 1 19.75C1.128 19.75 1.25707 19.717 1.37207 19.651L8 15.863L14.6279 19.65C14.8599 19.783 15.146 19.782 15.376 19.647C15.607 19.513 15.75 19.266 15.75 18.999V3.99902C15.75 1.58202 14.418 0.25 12 0.25ZM14.25 17.707L8.37207 14.349C8.14207 14.217 7.85793 14.217 7.62793 14.349L1.75 17.708V4C1.75 2.423 2.423 1.75 4 1.75H12C13.577 1.75 14.25 2.423 14.25 4V17.707ZM11.75 6C11.75 6.414 11.414 6.75 11 6.75H5C4.586 6.75 4.25 6.414 4.25 6C4.25 5.586 4.586 5.25 5 5.25H11C11.414 5.25 11.75 5.586 11.75 6Z"
                          fill="black"
                        />
                      </svg>
                    )}
                    
                  </div>
                </div>

                <div className="card-body mt-4 ">
                  <p className="text-xl md:text-2xl font-semibold truncate">
                    {job.position}
                  </p>
                  <p className="font-medium text-gray-600">
                    {job.location}
                  </p>
                 <div className=" flex justify-between items-center">
                   <p className="font-medium text-gray-600">
                  {job.workplace}{" "}
                  </p>
                  <p className="text-gray-600">Total applicants : <span className="text-blue-600 font-semibold">{job.totalApplications}</span></p>
                 </div>
                </div>

                <div className="card-button  items-center justify-between mt-4 border hidden ">
                  <div className="button flex  flex-col md:flex-row gap-2 md:gap-4 w-full ">
                    <button
                      className="border-2 border-blue-700 bg-white rounded-full py-2 px-4 text-blue-700 font-bold cursor-pointer w-full md:w-auto"
                      onClick={() => {
                        if (!isApplied) {
                          navigate("/jobapplicationform", {
                            state: {
                              job,
                            },
                          });
                        }
                      }}
                      disabled={isApplied}
                    >
                      {isApplied ? "Applied" : "Easy Apply"}
                    </button>
                  </div>

                  
                </div>
              </div>
          );
        })}
      </div>
    </>
  );
};

export default JobCardList;
