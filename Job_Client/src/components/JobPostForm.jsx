import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import close from "../assets/close.svg";
import { jwtDecode } from "jwt-decode";
import ExitConfirmation from "./ExitConfirmation";
import { ArrowLeft, X } from "lucide-react";

export default function JobPostForm() {
  const [companyOptions, setCompanyOptions] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  const navigate = useNavigate();
  const steps = [
    "Job Info",
    "Job Info",
    "Requirements",
    "Benefits",
    "Additional Info",
    "Submit",
  ];
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    companyId: "",
    position: "",
    location: "",
    workplace: "",

    interviewProcess: "",
    salaryRange: "",
    additionalBenefits: [],
    jobDescription: [{ title: "", content: [""] }],
    requirements: [{ title: "", content: [""] }],

    deadlineToApply: "",

    additionalInfo: [],
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateDynamicField = (type, index, key, value) => {
    const list = [...formData[type]];
    if (key === "content") {
      list[index][key] = value.split("\n");
    } else {
      list[index][key] = value;
    }
    setFormData({ ...formData, [type]: list });
  };

  const addDynamicItem = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], { title: "", content: [""] }],
    }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      const safeJSON = (value) => JSON.stringify(value ?? "");

      form.append("companyId", formData.companyId);
      form.append("position", formData.position);
      form.append("location", formData.location);
      form.append("workplace", formData.workplace);
      form.append("interviewProcess", formData.interviewProcess);
      form.append("salaryRange", formData.salaryRange);
      form.append("deadlineToApply", formData.deadlineToApply);

      form.append("additionalBenefits", safeJSON(formData.additionalBenefits));
      form.append("jobDescription", safeJSON(formData.jobDescription));
      form.append("requirements", safeJSON(formData.requirements));
      form.append("additionalInfo", safeJSON(formData.additionalInfo));

     
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/jobs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      navigate("/job-sucess");
    } catch (err) {
      console.error("Submit error:", err.message);
    }
  };

  const handleClose = () => {
    setShowModal(true);
  };

  const handleConfirmExit = () => {
    navigate(-1);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let userId = null;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id || decoded.userId || decoded._id;
    } catch (err) {
      console.error("Failed to decode token", err);
      return;
    }
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/companies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((company) => {
          return company.createdBy && company.createdBy.toString() === userId;
        });
        setCompanyOptions(filtered);
      })
      .catch((err) => {
        setCompanyOptions([]);
        console.error("Error fetching companies:", err);
      })
      .finally(() => setLoadingCompanies(false));
  }, []);

  useEffect(() => {
    if (companyOptions.length > 0 && !formData.companyId) {
      handleChange("companyId", companyOptions[0]._id);
    }
  }, [companyOptions]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md mt-10">
      <div className="back-icon flex items-center justify-between">
        <div className="icon w-full flex items-center justify-between ">
          <ArrowLeft
            onClick={prevStep}
            disabled={step === 0}
            className="cursor-pointer"
          />

          <X onClick={handleClose} className="cursor-pointer" />
          {showModal && (
            <ExitConfirmation
              onConfirm={handleConfirmExit}
              onCancel={() => setShowModal(false)}
            />
          )}
        </div>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full mb-6 mt-8">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
      <p className="text-2xl font-bold mb-6 text-center">{steps[step]}</p>

      {step === 0 && (
        <div className="flex flex-col space-y-4 w-[80%] m-auto">
          <div className="hidden">
            <label className="block text-lg font-semibold mb-1">
              Company ID
            </label>
            <select
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              value={formData.companyId}
              onChange={(e) => handleChange("companyId", e.target.value)}
              disabled={loadingCompanies}
            >
              <option value="">Select your company</option>
              {companyOptions.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.company_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">Position</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Position"
              value={formData.position}
              onChange={(e) => handleChange("position", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">Location</label>
            <input
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none "
              placeholder="Location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">
              Workplace
            </label>
            <input
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none "
              placeholder="eg:(Internship,Full Time,Freelance),(remote,on-site,hybrid)"
              value={formData.workplace}
              onChange={(e) => handleChange("workplace", e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col space-y-6 w-full max-w-2xl mx-auto px-4">
          <div>
            <label className="block text-lg font-semibold mb-1">
              Salary Range
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Salary Range"
              value={formData.salaryRange}
              onChange={(e) => handleChange("salaryRange", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">
              Interview Process
            </label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Interview Process"
              value={formData.interviewProcess}
              onChange={(e) => handleChange("interviewProcess", e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 w-[90%] m-auto">
          <h3 className="font-semibold text-lg">Job Description</h3>
          {formData.jobDescription.map((desc, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded space-y-2">
              <input
                className="input border border-gray-400 outline-none rounded-sm p-2"
                placeholder="Title"
                value={desc.title}
                onChange={(e) =>
                  updateDynamicField(
                    "jobDescription",
                    i,
                    "title",
                    e.target.value
                  )
                }
              />
              <textarea
                className="input w-full outline-none border border-gray-400 rounded-sm p-2"
                placeholder="Content (one per line)"
                value={desc.content.join("\n")}
                onChange={(e) =>
                  updateDynamicField(
                    "jobDescription",
                    i,
                    "content",
                    e.target.value
                  )
                }
              />
            </div>
          ))}
          <button
            className="text-blue-500 underline"
            onClick={() => addDynamicItem("jobDescription")}
          >
            + Add Job Description Section
          </button>
          <h3 className="font-semibold text-lg mt-6">Requirements</h3>
          {formData.requirements.map((req, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded space-y-2">
              <input
                className="input border border-gray-400 outline-none rounded-sm p-2"
                placeholder="Title"
                value={req.title}
                onChange={(e) =>
                  updateDynamicField("requirements", i, "title", e.target.value)
                }
              />
              <textarea
                className="input w-full outline-none border border-gray-400 rounded-sm p-2"
                placeholder="Content (one per line)"
                value={req.content.join("\n")}
                onChange={(e) =>
                  updateDynamicField(
                    "requirements",
                    i,
                    "content",
                    e.target.value
                  )
                }
              />
            </div>
          ))}
          <button
            className="text-blue-500 underline"
            onClick={() => addDynamicItem("requirements")}
          >
            + Add Requirement
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col space-y-6 w-full max-w-2xl mx-auto px-4">
          <div>
            <label className="block text-lg font-semibold mb-1">Benefits</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm outline-none"
              placeholder="Benefits (comma separated)"
              value={formData.additionalBenefits.join(",")}
              onChange={(e) =>
                handleChange("additionalBenefits", e.target.value.split(","))
              }
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">
              Deadline to Apply
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm outline-none"
              value={formData.deadlineToApply}
              onChange={(e) => handleChange("deadlineToApply", e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="">
          <div className=" w-[50%] m-auto">
            <label className="block text-lg font-semibold mb-1">
              Add a Question
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Type your question here"
                className="flex-1 p-2 border border-gray-300 rounded outline-none shadow-sm"
              />
              <button
                type="button"
                onClick={() => {
                  if (newQuestion.trim()) {
                    setFormData((prev) => ({
                      ...prev,
                      additionalInfo: [
                        ...(prev.additionalInfo || []),
                        newQuestion,
                      ],
                    }));
                    setNewQuestion("");
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
            {formData.additionalInfo?.length > 0 && (
              <ul className="list-disc pl-5 space-y-1">
                {formData.additionalInfo.map((q, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span>{q}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.additionalInfo.filter(
                          (_, i) => i !== idx
                        );
                        setFormData((prev) => ({
                          ...prev,
                          additionalInfo: updated,
                        }));
                      }}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-8">
          <p className="text-2xl font-bold text-center">Review Your Job Post</p>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Company Info</h3>
            {formData.companyLogo && (
              <div className="mb-3">
                <p className="font-medium">Company Logo:</p>
                <img
                  src={
                    typeof formData.companyLogo === "string"
                      ? formData.companyLogo
                      : URL.createObjectURL(formData.companyLogo)
                  }
                  alt="Company Logo"
                  className="h-20 object-contain"
                />
              </div>
            )}
            {formData.companyImages?.length > 0 && (
              <div className="mb-3">
                <p className="font-medium">Company Images:</p>
                <div className="flex gap-4 overflow-x-auto">
                  {formData.companyImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={
                        typeof img === "string" ? img : URL.createObjectURL(img)
                      }
                      alt={`Company ${idx}`}
                      className="h-24 rounded"
                    />
                  ))}
                </div>
              </div>
            )}
            <p>
              <strong>Company ID:</strong> {formData.companyId}
            </p>
            <p>
              <strong>Location:</strong> {formData.location}
            </p>
            <p>
              <strong>Workplace:</strong> {formData.workplace}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Job Info</h3>
            <p>
              <strong>Position:</strong> {formData.position}
            </p>
            <p>
              <strong>Interview Process:</strong> {formData.interviewProcess}
            </p>
            <p>
              <strong>Salary Range:</strong> {formData.salaryRange}
            </p>
            {formData.deadlineToApply && (
              <p>
                <strong>Deadline to Apply:</strong> {formData.deadlineToApply}
              </p>
            )}
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            {formData.jobDescription.map((desc, index) => (
              <div key={index}>
                <h4 className="font-bold">{desc.title}</h4>
                <ul className="list-disc list-inside">
                  {desc.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            {formData.requirements.map((req, index) => (
              <div key={index}>
                <h4 className="font-bold">{req.title}</h4>
                <ul className="list-disc list-inside">
                  {req.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Benefits</h3>
            <ul className="list-disc list-inside">
              {formData.additionalBenefits?.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">
              Additional Information
            </h3>
            <ul className="list-disc list-inside">
              {formData.additionalInfo?.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </div>
          <div className="card_container  flex items-center space-x-20">
            <div className="card ">
              <div className="title mt-2 mb-4 p-2">
                <p className="text-lg font-semibold ">Job Card Preview</p>
              </div>
              <div className="card-container border border-gray-300 rounded-md p-4 cursor-pointer mb-5">
                <div className="card-title flex items-center justify-between">
                  
                </div>
                <div className="card-body mt-4">
                  <p className="text-xl md:text-2xl font-semibold">
                    {formData.position}
                  </p>
                  <p className="font-medium text-gray-600">
                    {formData.location} ({formData.workplace})
                  </p>
                </div>
                <div className="card-button flex items-center justify-between mt-4">
                  <div className="button flex flex-col md:flex-row gap-2 md:gap-4 w-full">
                    <button className="border-2 border-[#0C9653] bg-white rounded-full py-2 px-4 text-green-700 font-bold  w-full md:w-auto">
                      {formData.applyMethod === "Easy Apply"
                        ? "Easy Apply"
                        : "Apply Link"}
                    </button>
                    <button className="border border-white rounded-full py-2 px-4 bg-green-100 text-green-700 font-bold  w-full md:w-auto">
                      Multiple Candidate
                    </button>
                  </div>
                  <div className="posted-date ml-4 whitespace-nowrap">
                    <p className="text-sm text-black">0d</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded cursor-pointer"
              onClick={handleSubmit}
            >
              Submit Job Post
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-end w-[80%] m-auto p-2 ">
        {step < steps.length - 1 && (
          <button
            className="px-4 py-2 rounded-full bg-[#2986CE] text-white"
            onClick={nextStep}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
