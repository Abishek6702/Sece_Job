import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import edit_icon from "../assets/edit.svg";
import delete_icon from "../assets/delete.svg";
import DeleteConfirmation from "./DeleteConfirmation";
import { useState } from "react";
import axios from "axios";
import JobUpdateForm from "./JobUpdateForm";
import { X } from "lucide-react";

const JobDetailModel = ({ job, handleClose }) => {
  const jobId = job._id;
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const descriptionRef = useRef(null);
  const requirementRef = useRef(null);
  const benefitRef = useRef(null);
  const overviewRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  if (!job) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Select a job to view details</p>
      </div>
    );
  }
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowDeleteModal(false);
      console.log("Job deleted!");

      navigate("/employer-dashboard");
      window.location.reload();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="bg-gray-50 p-6  rounded-md shadow-md max-h-[90vh] overflow-y-scroll scrollbar-hide ">
      <div className="flex items-center justify-end gap-6">
        <div className="flex gap-4">
          <button
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-xl cursor-pointer flex gap-2 items-center"
            onClick={() => setIsEditing(true)}
          >
            <img src={edit_icon} className="w-4 h-4" />
                     <p className="hidden md:block">Edit</p>

          </button>
          {isEditing && (
            <JobUpdateForm job={job} onClose={() => setIsEditing(false)} />
          )}
          <button
            onClick={handleDeleteClick}
            className="bg-[#F94144] text-white font-bold py-2 px-4 rounded-xl cursor-pointer flex gap-2 items-center"
          >
            <img src={delete_icon} className="w-6 h-6" />
            <p className="hidden md:block">Delete</p>
          </button>

          {showDeleteModal && (
            <DeleteConfirmation
              onConfirm={handleConfirmDelete}
              onCancel={handleCancelDelete}
            />
          )}
          <button
            className="text-gray-800 cursor-pointer"
            onClick={handleClose}
          >
            <X />
            
          </button>
        </div>
      </div>

      <div className="space-y-4 ">
        <div className="company-content">
          <div className="company-name">
            <div className="company flex items-center justify-between">
              <div className="company-icon flex items-center gap-2">
                <img
                  src={`${job.companyId.company_logo}`}
                  alt="Company Logo"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="text-[#6532C1] font-semibold">
                  {job.companyId.company_name}
                </p>
              </div>
            </div>
          </div>

          <div className="job-role mt-6 flex flex-wrap items-center justify-between">
            <div className="role">
              <p className="font-bold text-2xl mb-2">{job.position}</p>
              <p>
                {job.location} ({job.workplace})
              </p>
            </div>
          </div>
        </div>

        <div className="interview-process mt-6">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">The Interview Process:</span>
              {job.interviewProcess}
            </p>
          </div>
        </div>

        <div className=" border-b text-gray-400 font-semibold text-lg sticky top-[-24px] bg-gray-50 hidden md:block ">
          <div className="flex flex-wrap gap-x-10 pb-2">
            <button
              onClick={() => scrollTo(descriptionRef)}
              className="hover:text-black focus:text-black cursor-pointer focus:border-b-2"
            >
              Job Description
            </button>
            <button
              onClick={() => scrollTo(requirementRef)}
              className="hover:text-black focus:text-black cursor-pointer focus:border-b-2"
            >
              Requirements
            </button>
            <button
              onClick={() => scrollTo(benefitRef)}
              className="hover:text-black focus:text-black cursor-pointer focus:border-b-2"
            >
              Benefits
            </button>
            <button
              onClick={() => scrollTo(overviewRef)}
              className="hover:text-black focus:text-black cursor-pointer focus:border-b-2"
            >
              Overview
            </button>
          </div>
        </div>

        <section ref={descriptionRef} className="mt-6 space-y-4">
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

        <section ref={requirementRef} className="mt-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-600">Requirements</h2>
          {job.requirements?.map((req, index) => (
            <div key={index}>
              <p className="font-semibold text-gray-900">{req.title}</p>
              <ul className="list-disc ml-6 space-y-1 text-gray-700">
                {req.content.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section ref={benefitRef} className="mt-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-600">Benefits</h2>
          <p className="font-semibold text-gray-900">Base Pay Range</p>
          <p className="text-gray-600">{job.salaryRange} Per/H</p>
          <p className="font-semibold mt-4 text-gray-900">
            What’s in it for you?
          </p>
          <ul className="list-disc ml-6 space-y-1 text-gray-700">
            {job.additionalBenefits?.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </section>

        <section ref={overviewRef} className="mt-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-600">Overview</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Size:</strong> {job.companyId.employee_count}
            </div>
            <div>
              <strong>Founded:</strong> {job.companyId.founded}
            </div>
            <div>
              <strong>Type:</strong> Company - {job.companyId.company_type}
            </div>

            <div>
              <strong>Revenue:</strong> {job.companyId.revenue}
            </div>
          </div>

          {job.companyId.images.length > 0 && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
              <div className="col-span-1 sm:col-span-2 lg:col-span-6">
                <div className="w-full h-48 sm:h-64 lg:h-full">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/${job.companyId.images[0]}`}
                    alt="Company"
                    className="w-full h-full rounded-md object-cover"
                  />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 lg:col-span-6 grid grid-cols-2 gap-4">
                {job.companyId.images.slice(1, 5).map((img, index) => (
                  <div key={index} className="h-32 sm:h-40">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/${img}`}
                      alt={`Company ${index + 1}`}
                      className="w-full h-full rounded-md object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default JobDetailModel;
