import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import { jwtDecode } from "jwt-decode";
import { ArrowUpRight, Bookmark, BookmarkCheck, MapPin } from "lucide-react";

const getDaysAgo = (postedAt) => {
  const postDate = new Date(postedAt);
  const now = new Date();
  const diffTime = Math.abs(now - postDate);

  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
};

const pastelColors = [
  "bg-[#e3dbfa]",
  "bg-[#d4f6ed]",
  "bg-[#ffe1cc]/50",
  "bg-[#dffefe]",
  "bg-[#fbe2f4]/50",
  "bg-[#cecff4]"
];

const stringToHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const JobCardList = ({ jobs, onSelectJob, selectedJob }) => {
  const { savedJobs, toggleSaveJob, appliedJobs } = useAppContext();
  const navigate = useNavigate();

  const filteredJobs = jobs.filter(job => !appliedJobs.includes(job._id.toString()));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredJobs.map((job, index) => {
          const jobId = job._id.toString();
          const isApplied = appliedJobs.includes(jobId);
          const isSaved = savedJobs.includes(job._id);
          
          // Use a stable hash of the ID to randomly pick a color from the array
          const colorIndex = stringToHash(jobId) % pastelColors.length;
          const colorClass = pastelColors[colorIndex];

          return (
            <div
              key={job._id}
              onClick={() => onSelectJob(job)}
              className={`bg-white rounded-2xl p-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md border border-gray-100 ${
                selectedJob?._id === job._id ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {/* Top Colored Section */}
              <div className={`${colorClass} rounded-2xl p-6 pb-8 relative`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
                      <img
                        src={`${job.companyId.company_logo}`}
                        alt="Company Logo"
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <span className="bg-white text-green-500 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      {job.workplace ? job.workplace.split(",")[0] : "Full-Time"}
                    </span>
                  </div>
                  
                  {/* Keep bookmark but make it subtle to fit design */}
                  <button
                    className="bg-white cursor-pointer p-2 rounded-full transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveJob(job._id);
                    }}
                  >
                    {isSaved ? (
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
                          fill="#4361ee"
                        />
                      </svg>
                    ) : (
                      <Bookmark className="w-5 h-5 text-[#778984]"/>
                    )}
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700 font-medium text-lg mb-2">
                    {job.companyId.company_name}
                  </p>
                  <h3 className="text-[22px] font-bold text-gray-900 mb-3 leading-tight">
                    {job.position}
                  </h3>
                  <p className="text-gray-600/90 text-sm leading-relaxed line-clamp-2">
                    Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut la..
                  </p>
                </div>
              </div>

              {/* Bottom White Section */}
              <div className="px-5 pt-6 pb-3 flex items-end justify-between mt-auto">
                <div className="flex flex-col gap-2.5">
                  <span className="text-[#778984] text-sm font-semibold">{getDaysAgo(job.postedAt)}</span>
                  <div className="flex items-center gap-2 text-[#778984] text-sm font-semibold">
                    <MapPin className="text-[#4361ee] w-5 h-5"/>
                    {job.location}
                  </div>
                </div>
                
                <button
                  className="btn-grad text-white rounded-full py-3 px-6 font-semibold text-sm flex items-center gap-2 "
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isApplied) {
                      navigate("/jobapplicationform", { state: { job } });
                    }
                  }}
                  disabled={isApplied}
                >
                  {!isApplied && (
                    <ArrowUpRight className="w-5 h-5"/>
                  )}
                  {isApplied ? "Applied" : "Apply Now"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default JobCardList;
