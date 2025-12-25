import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppProvider";
import { X, Zap } from "lucide-react";

const JobDetails = ({ onClose, job, isExpanded }) => {
  console.log("company", job);
  const navigate = useNavigate();
  const descriptionRef = useRef(null);
  const requirementRef = useRef(null);
  const benefitRef = useRef(null);
  const overviewRef = useRef(null);
  const { savedJobs, toggleSaveJob, appliedJobs } = useAppContext();
  const [activeSection, setActiveSection] = useState("description");

  const scrollTo = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  useEffect(() => {
    const sections = [
      { ref: descriptionRef, id: "description" },
      { ref: requirementRef, id: "requirement" },
      { ref: benefitRef, id: "benefit" },
      { ref: overviewRef, id: "overview" },
    ].filter((item) => item.ref.current);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.dataset.section);
          }
        });
      },
      { threshold: 0.8 }
    );

    sections.forEach(({ ref, id }) => {
      if (ref.current) {
        ref.current.dataset.section = id;
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  if (!job) {
    return (
      <div className="col-span-8 p-8">
        <p className="text-gray-500">Select a job to view details</p>
      </div>
    );
  }

  const isJobSaved = savedJobs.includes(job._id);
  const jobId = job._id.toString();
  const isApplied = appliedJobs.includes(jobId);

  return (
    <div
      className={`main-container transition-all duration-300 col-span-12  ${
        isExpanded
          ? "md:col-span-12 fixed top-0 left-0 w-full h-full bg-white overflow-y-scroll z-50"
          : "md:col-span-8 p-4"
      }`}
    >
      <div className="content-container h-[95vh] overflow-auto sticky top-2 bg-gray-50 rounded-sm p-12 ">

        <div className="company-content">
          <div className="company-name">
            <div className="company flex items-center justify-between">
              <div className="company-icon flex items-center gap-2">
                <img
                  src={`${job.companyId.company_logo}`}
                  alt="Company Logo"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <p className="text-[#6532C1] font-semibold">
                  {job.companyId.company_name}
                </p>
              </div>
              <div className=" flex items-center gap-2 z-50">
                <div
                  className="cursor-pointer p-2 rounded-full hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveJob(job._id);
                  }}
                >
                  {isJobSaved ? (
                    <svg
                      width="14"
                      height="18"
                      viewBox="0 0 14 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
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
                    >
                      <path
                        d="M12 0.25H4C1.582 0.25 0.25 1.582 0.25 4V19C0.25 19.268 0.393023 19.5149 0.624023 19.6479C0.740023 19.716 0.87 19.75 1 19.75C1.128 19.25 1.25707 19.717 1.37207 19.651L8 15.863L14.6279 19.65C14.8599 19.783 15.146 19.782 15.376 19.647C15.607 19.513 15.75 19.266 15.75 18.999V3.99902C15.75 1.58202 14.418 0.25 12 0.25ZM14.25 17.707L8.37207 14.349C8.14207 14.217 7.85793 14.217 7.62793 14.349L1.75 17.708V4C1.75 2.423 2.423 1.75 4 1.75H12C13.577 1.75 14.25 2.423 14.25 4V17.707ZM11.75 6C11.75 6.414 11.414 6.75 11 6.75H5C4.586 6.75 4.25 6.414 4.25 6C4.25 5.586 4.586 5.25 5 5.25H11C11.414 5.25 11.75 5.586 11.75 6Z"
                        fill="black"
                      />
                    </svg>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-gray-200"
                  title="Close"
                >
                  <X />
                </button>
              </div>
            </div>
          </div>
          <div className="job-role mt-2 flex flex-wrap items-center justify-between">
            <div className="role">
              <p className="font-bold text-2xl mb-2">{job.position}</p>
              <p>
                {job.location} ({job.workplace})
              </p>
            </div>
            <div className="apply-btn pt-5 lg:pt-0">
              <button
                className="border border-white rounded-full py-2 px-4 bg-[#2986CE] text-white font-bold cursor-pointer flex gap-2 items-center"
                onClick={() => {
                  if (!isApplied) {
                    navigate("/jobapplicationform", {
                      state: { job },
                    });
                  }
                }}
                disabled={isApplied}
              >
                {!isApplied && <Zap />}
                {isApplied ? "Already Applied" : "Easy Apply"}
              </button>
            </div>
          </div>
        </div>

        <div className="interview-process mt-4">
          <div className=" text-sm">
            
            <p>
              <span className="font-semibold">The Interview Process:</span>{" "}
              {job.interviewProcess}
            </p>
            
          </div>
        </div>

        <div className="mt-2 space-y-4">
          <div className=" flex-wrap gap-x-10 border-b text-gray-400 font-semibold text-lg sticky top-[-50px] py-4 z-10 bg-gray-50 hidden md:flex">
            <button
              onClick={() => scrollTo(descriptionRef)}
              className={`hover:text-black focus:text-black cursor-pointer focus:border-b-2 ${
                activeSection === "description" ? "text-black border-b-2" : ""
              }`}
            >
              Job Description
            </button>
            <button
              onClick={() => scrollTo(requirementRef)}
              className={`hover:text-black focus:text-black cursor-pointer focus:border-b-2 ${
                activeSection === "requirement" ? "text-black border-b-2" : ""
              }`}
            >
              Requirement
            </button>
            <button
              onClick={() => scrollTo(benefitRef)}
              className={`hover:text-black focus:text-black cursor-pointer focus:border-b-2 ${
                activeSection === "benefit" ? "text-black border-b-2" : ""
              }`}
            >
              Benefit
            </button>
            <button
              onClick={() => scrollTo(overviewRef)}
              className={`hover:text-black focus:text-black cursor-pointer focus:border-b-2 ${
                activeSection === "overview" ? "text-black border-b-2" : ""
              }`}
            >
              Overview
            </button>
          </div>

          <section
            ref={descriptionRef}
            data-section="description"
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-600">Job Description</h2>
            {job.jobDescription?.map((section, index) => (
              <div key={index}>
                <p className="font-semibold text-gray-900">{section.title}</p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  {section.content.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <div className="line border border-gray-300"></div>

          <section
            ref={requirementRef}
            data-section="requirement"
            className="space-y-4"
          >
            <h2 className="极速体验，即刻享受！" />
            <h2 className="text-xl font-bold text-gray-600">Requirements</h2>
            {job.requirements?.map((req, index) => (
              <div key={index}>
                <p className="font-semibold text-gray-900 mt-4">{req.title}</p>
                <ul className="list-disc ml-6 space-y-1 text-gray-700">
                  {req.content.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <div className="line border border-gray-300"></div>

          <section
            ref={benefitRef}
            data-section="benefit"
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-600">Benefit</h2>
            <p className="font-semibold text-gray-900">Base Pay Range</p>
            <p className="text-gray-600">{job.salaryRange}Per/H</p>
            <p className="font-semib极速体验，即刻享受！" />
            <p className="font-semibold mt-4 text-gray-900">
              What’s in it for you?
            </p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700">
              {job.additionalBenefits?.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </section>

          <div className="line border border-gray-300"></div>

          <section
            ref={overviewRef}
            data-section="overview"
            className="space极速体验，即刻享受！"
          >
            <h2 className="text-xl font-bold text-gray-600">Overview</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <strong>Size:</strong> {job.companyId?.employee_count || "N/A"}
              </div>
              <div>
                <strong>Founded:</strong>{" "}
                {job.companyId.founded || "N/A"}
              </div>
              <div>
                <strong>Type:</strong>{" "}
                {job.companyId?.company_type || "N/A"}
              </div>
              
              <div>
                <strong>Revenue:</strong>{" "}
                {job.companyId?.revenue || "N/A"}
              </div>
            </div>
            {job.companyId?.images?.length > 0 && (
              <div className="image-container w-full mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
                <div className="col-span-1 sm:col-span-2 lg:col-span-6 p-2">
                  <div className="w-full h-[200px] lg:h-full">
                    <img
                      src={`${job.companyId.images[0]}`}
                      alt="Company"
                      className="w-full h-full rounded-sm object-cover"
                    />
                  </div>
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-6 grid grid-cols-2 gap-4 p-2">
                  {job.companyId.images
                    .slice(1, 5)
                    .map((img, index) => (    
                      <div key={index} className="h-[150px]">
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}/${img}`}
                          alt={`Company ${index + 1}`}
                          className="w-full h-full rounded-sm object-cover"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
