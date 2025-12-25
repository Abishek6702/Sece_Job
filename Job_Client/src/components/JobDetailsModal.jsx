import React, { useEffect, useRef, useState } from "react";
import { X, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobDetailsModal = ({
  onClose,
  job,
  isOpen,
  isSaved,
  isApplied,
  onSaveToggle,
}) => {
  const navigate = useNavigate();
  const descriptionRef = useRef(null);
  const requirementRef = useRef(null);
  const benefitRef = useRef(null);
  const overviewRef = useRef(null);

  const [activeSection, setActiveSection] = useState("description");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setActiveSection("description");
    const sections = [
      { ref: descriptionRef, id: "description" },
      { ref: requirementRef, id: "requirement" },
      { ref: benefitRef, id: "benefit" },
      { ref: overviewRef, id: "overview" },
    ].filter((item) => item.ref.current);
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.dataset.section);
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    return () => observer.disconnect();
  }, [isOpen, job]);

  if (!isOpen || !job) return null;

  const scrollTo = (ref) => {
    ref?.current?.scrollIntoView({ behavior: "smooth" });
  };

  function onOverlay(e) {
    if (e.target === e.currentTarget) onClose();
  }

  const company = job.companyId || {};

  return (
    <div
      className="fixed inset-0 z-50 tint flex items-center justify-center"
      onClick={onOverlay}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] relative bg-white mt-17 rounded-xl flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-8 pt-8 pb-3 ">
          <div className="flex gap-4 items-center ">
            {company.company_logo && (
              <img
                src={`${company.company_logo.replace(
                  /\\/g,
                  "/"
                )}`}
                alt="Company Logo"
                className="w-16 border border-gray-300 h-16 rounded-full object-cover "
              />
            )}
            <div>
              <div className="text-[#6532C1] font-semibold text-xl">
                {company.company_name}
              </div>
              <div className="font-bold text-2xl mt-1 text-gray-900">
                {job.position}
              </div>
              <div className="text-gray-500 mt-1 text-base">
                {job.location} ({job.workplace})
              </div>
              {!!job.interviewProcess && (
                <div className="text-sm mt-3 md:mt-0 text-gray-600 max-w-[350px]">
                  <span className="font-semibold text-gray-800">
                    The Interview Process:
                  </span>{" "}
                  {job.interviewProcess}
                </div>
              )}
            </div>
          </div>
          <div className="main-container ">
            <div className="flex items-center justify-end gap-2 ">
              <button
                onClick={() => onSaveToggle(job._id)}
                className="p-2 rounded-full hover:bg-blue-100 transition"
                title={isSaved ? "Unsave Job" : "Save Job"}
                type="button"
              >
                <svg
                  width="18"
                  height="20"
                  viewBox="0 0 16 20"
                  fill={isSaved ? "#2986CE" : "none"}
                  stroke={isSaved ? "#2986CE" : "#98A2B3"}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 0.25H4C1.582 0.25 0.25 1.582 0.25 4V19C0.25 19.268 0.393 19.515 0.624 19.648 0.74 19.716 0.87 19.75 1 19.75 1.128 19.25 1.257 19.717 1.372 19.651L8 15.863 14.6279 19.65C14.8599 19.783 15.146 19.782 15.376 19.647 15.607 19.513 15.75 19.266 15.75 18.999V4C15.75 1.582 14.418 0.25 12 0.25Z"
                    fill={isSaved ? "#2986CE" : "none"}
                  />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
                title="Close"
                type="button"
              >
                <X size={22} />
              </button>
            </div>
            <div className="container-2   mt-2">
              <button
                className={`py-2 px-6 rounded-full text-white font-bold flex items-center gap-2 transition-all
              ${
                isApplied
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#2986CE] hover:bg-[#2173b7]"
              }`}
                onClick={() => {
                  if (!isApplied) {
                    navigate("/jobapplicationform", { state: { job } });
                  }
                }}
                disabled={isApplied}
                type="button"
              >
                {!isApplied && <Zap size={18} />}
                {isApplied ? "Already Applied" : "Easy Apply"}
              </button>
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-20 bg-white border-b flex justify-around gap-8 text-base font-medium border-gray-100 pl-8 pt-2">
          <div className=" flex gap-8 ">
            <button
              onClick={() => scrollTo(descriptionRef)}
              className={`py-3 outline-none bg-none border-b-2 transition
              ${
                activeSection === "description"
                  ? "text-[#2986CE] border-[#2986CE] font-semibold"
                  : "text-gray-400 border-transparent hover:text-[#2986CE]"
              }`}
              type="button"
            >
              Job Description
            </button>
            <button
              onClick={() => scrollTo(requirementRef)}
              className={`py-3 outline-none bg-none border-b-2 transition
              ${
                activeSection === "requirement"
                  ? "text-[#2986CE] border-[#2986CE] font-semibold"
                  : "text-gray-400 border-transparent hover:text-[#2986CE]"
              }`}
              type="button"
            >
              Requirement
            </button>
            <button
              onClick={() => scrollTo(benefitRef)}
              className={`py-3 outline-none bg-none border-b-2 transition
              ${
                activeSection === "benefit"
                  ? "text-[#2986CE] border-[#2986CE] font-semibold"
                  : "text-gray-400 border-transparent hover:text-[#2986CE]"
              }`}
              type="button"
            >
              Benefit
            </button>
            <button
              onClick={() => scrollTo(overviewRef)}
              className={`py-3 outline-none bg-none border-b-2 transition
              ${
                activeSection === "overview"
                  ? "text-[#2986CE] border-[#2986CE] font-semibold"
                  : "text-gray-400 border-transparent hover:text-[#2986CE]"
              }`}
              type="button"
            >
              Overview
            </button>
          </div>
          <div className="flex items-center ">
            
            <p className="text-gray-400 text-sm font-bold ml-4 whitespace-nowrap">
              Deadline to Apply:{" "}
              <span className="text-black">
                {" "}
                {job.deadlineToApply
                  ? new Date(job.deadlineToApply).toLocaleDateString()
                  : ""}
              </span>
            </p>
          </div>
        </div>

        <div className="px-8 py-8 space-y-8 text-gray-900 overflow-y-auto">
          <section
            ref={descriptionRef}
            data-section="description"
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-700 mb-1">
              Job Description
            </h2>
            {Array.isArray(job.jobDescription) ? (
              job.jobDescription.map((section, idx) => (
                <div key={idx}>
                  <p className="font-semibold text-gray-900 mb-1">
                    {section.title}
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700 text-base">
                    {section.content.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-base text-gray-600">{job.jobDescription}</p>
            )}
          </section>
          <div className="border-b border-gray-200" />

          <section
            ref={requirementRef}
            data-section="requirement"
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-700 mb-1">
              Requirements
            </h2>
            {Array.isArray(job.requirements) ? (
              job.requirements.map((req, idx) => (
                <div key={idx}>
                  <p className="font-semibold text-gray-900 mt-3 mb-1">
                    {req.title}
                  </p>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700 text-base">
                    {req.content.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-base text-gray-600">{job.requirements}</p>
            )}
          </section>
          <div className="border-b border-gray-200" />

          <section
            ref={benefitRef}
            data-section="benefit"
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-700 mb-1">Benefit</h2>
            {job.salaryRange && (
              <p className="font-semibold text-gray-900">
                Base Pay Range{" "}
                <span className="text-[#2986CE] font-medium ml-2">
                  {job.salaryRange} Per/H
                </span>
              </p>
            )}
            <p className="font-semibold mt-4 text-gray-900">
              What’s in it for you?
            </p>
            <ul className="list-disc ml-6 space-y-1 text-gray-700 text-base">
              {(job.additionalBenefits || []).map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
          </section>
          <div className="border-b border-gray-200" />

          <section
            ref={overviewRef}
            data-section="overview"
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-700 mb-1">Overview</h2>
            <div className="grid grid-cols-2 gap-4 text-base text-gray-700 mb-4">
              <div>
                <strong>Size:</strong> {company.employee_count || "N/A"}
              </div>
              <div>
                <strong>Founded:</strong> {company.founded || "N/A"}
              </div>
              <div>
                <strong>Type:</strong> {company.company_type || "N/A"}
              </div>
              <div>
                <strong>Revenue:</strong> {company.revenue || "N/A"}
              </div>
            </div>
            {Array.isArray(company.images) && company.images.length > 0 && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mt-5">
                <div className="col-span-1 sm:col-span-2 lg:col-span-6 p-2">
                  <div className="w-full h-[200px] lg:h-full">
                    <img
                      src={`${company.images[0]}`}
                      alt="Company"
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </div>
                </div>
                <div className="col-span-1 sm:col-span-2 lg:col-span-6 grid grid-cols-2 gap-4 p-2">
                  {company.images.slice(1, 5).map((img, index) => (
                    <div key={index} className="h-[140px]">
                      <img
                        src={`${img}`}
                        alt={`Company ${index + 1}`}
                        className="w-full h-full rounded-lg object-cover"
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

export default JobDetailsModal;
