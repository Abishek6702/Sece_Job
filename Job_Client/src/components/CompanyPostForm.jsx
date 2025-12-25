import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import close from "../assets/close.svg";
import ExitConfirmation from "./ExitConfirmation";

export default function CompanyPostForm() {
   const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const steps = [
    "Company Info",
    "About",
    "Images",
    "Submit",
  ];
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    company_name: "",
    company_type: "public",
    location: "",
    followers_count: 0,
    employee_count: 0,
    site_url: "",
    founded:0,
    revenue:""
,    about: {
      content: "",
      contact_info: "",
      stock_value: "",
    },
    people: [{ content: "", category: "" }],
    company_logo: null,
    images: [],
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (field, subfield, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [subfield]: value },
    }));
  };

  const handlePeopleChange = (index, key, value) => {
    const list = [...formData.people];
    list[index][key] = value;
    setFormData((prev) => ({ ...prev, people: list }));
  };

  const addPerson = () => {
    setFormData((prev) => ({
      ...prev,
      people: [...prev.people, { content: "", category: "" }],
    }));
  };

  const handleFileChange = (e, field) => {
    if (field === "company_logo") {
      handleChange(field, e.target.files[0]);
    } else if (field === "images") {
      handleChange(field, Array.from(e.target.files));
    }
  };

  const nextStep = () => {
    setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const prevStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      form.append("company_name", formData.company_name);
      form.append("company_type", formData.company_type);
      form.append("location", formData.location);
      form.append("followers_count", formData.followers_count);
      form.append("employee_count", formData.employee_count);
      form.append("site_url", formData.site_url);
      form.append("founded", formData.founded);
      form.append("revenue", formData.revenue);

      form.append("about", JSON.stringify(formData.about));
      form.append("people", JSON.stringify(formData.people));

      if (formData.company_logo instanceof File) {
        form.append("company_logo", formData.company_logo);
      }

      if (formData.images.length > 0) {
        formData.images.forEach((file) => {
          if (file instanceof File) {
            form.append("images", file);
          }
        });
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/companies`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to post company data");
      }

      alert("Company data posted successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Error:", err.message);
      alert(`Failed to submit company data: ${err.message}`);
    }
  };

  const handleClose = () => {
    setShowModal(true);
  };

  const handleConfirmExit = () => {
    navigate(-1); 
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <div className="back-icon flex items-center justify-between">
        <div className="icon w-full flex items-center justify-between ">
          <svg
            width="20"
            height="16"
            viewBox="0 0 20 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={prevStep}
            disabled={step === 0}
            className="cursor-pointer"
          >
            <path
              d="M19.7499 7.99978C19.7499 8.41378 19.4139 8.74978 18.9999 8.74978H2.81091L8.53088 14.4698C8.82388 14.7628 8.82388 15.2378 8.53088 15.5308C8.38488 15.6768 8.19285 15.7508 8.00085 15.7508C7.80885 15.7508 7.61682 15.6778 7.47082 15.5308L0.470818 8.53079C0.401818 8.46179 0.346953 8.37889 0.308953 8.28689C0.232953 8.10389 0.232953 7.89689 0.308953 7.71389C0.346953 7.62189 0.401818 7.53875 0.470818 7.46975L7.47082 0.46975C7.76382 0.17675 8.23885 0.17675 8.53185 0.46975C8.82485 0.76275 8.82485 1.23779 8.53185 1.53079L2.81188 7.25076H18.9999C19.4139 7.24976 19.7499 7.58578 19.7499 7.99978Z"
              fill="black"
            />
          </svg>
          <img src={close} className="cursor-pointer" onClick={handleClose}/>
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

      {/* Step 0: Company Info */}
      {step === 0 && (
        <div className="flex flex-wrap gap-4 w-[80%] m-auto items-center justify-center">
          <div className="w-[45%]">
            <label className="block text-lg font-semibold mb-1">Company Name</label>
            <input
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              placeholder="Company Name"
              value={formData.company_name}
              onChange={(e) => handleChange("company_name", e.target.value)}
            />
          </div>

          <div className="w-[45%]">
            <label className="block text-lg font-semibold mb-1">Company Type</label>
            <select
              className="w-full border border-gray-300 p-2 rounded"
              value={formData.company_type}
              onChange={(e) => handleChange("company_type", e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="w-[45%]">
            <label className="block text-lg font-semibold mb-1">Location</label>
            <input
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <div className="w-[45%]">
            <label className="block text-lg font-semibold mb-1">Followers Count</label>
            <input
              type="number"
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              value={formData.followers_count}
              onChange={(e) => handleChange("followers_count", e.target.value)}
            />
          </div>

          <div className="w-[45%]">
            <label className="block text-lg font-semibold mb-1">Employee Count</label>
            <input
              type="number"
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              value={formData.employee_count}
              onChange={(e) => handleChange("employee_count", e.target.value)}
            />
          </div>

          <div className="w-[45%]">
            <label className="block text-lg font-semibold mb-1">Website URL</label>
            <input
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              placeholder="https://..."
              value={formData.site_url}
              onChange={(e) => handleChange("site_url", e.target.value)}
            />
          </div>
          <div className="w-[45%]">
            <label className="block text-lg font-semibold mb-1">Founded</label>
            <input
              type="number"
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              value={formData.founded}
              onChange={(e) => handleChange("founded", e.target.value)}
            />
          </div>

          <div className="w-[45%]">
            <label className="block text-lg font-semibold mb-1">Revenue</label>
            <input
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              placeholder="10M"
              value={formData.revenue}
              onChange={(e) => handleChange("revenue", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Step 1: About */}
      {step === 1 && (
        <div className="flex flex-col space-y-4 w-[80%] m-auto">
          <div>
            <label className="block text-lg font-semibold mb-1">About Content</label>
            <textarea
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              placeholder="Leading AI company."
              value={formData.about.content}
              onChange={(e) => handleNestedChange("about", "content", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-1">Contact Info</label>
            <input
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              placeholder="info@techcorp.com"
              value={formData.about.contact_info}
              onChange={(e) => handleNestedChange("about", "contact_info", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-1">Stock Value</label>
            <input
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              placeholder="$500M"
              value={formData.about.stock_value}
              onChange={(e) => handleNestedChange("about", "stock_value", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Step 2: People */}
      {/* {step === 2 && (
        <div className="flex flex-col space-y-4 w-[80%] m-auto">
          <h3 className="text-lg font-semibold mb-2">People</h3>
          {formData.people.map((person, index) => (
            <div key={index} className="mb-2 border p-2 rounded">
              <input
                className="w-full border p-2 mb-2"
                placeholder="Category"
                value={person.category}
                onChange={(e) => handlePeopleChange(index, "category", e.target.value)}
              />
              <input
                className="w-full border p-2"
                placeholder="Content"
                value={person.content}
                onChange={(e) => handlePeopleChange(index, "content", e.target.value)}
              />
            </div>
          ))}
          <button className="text-blue-500 underline" onClick={addPerson}>
            + Add Person
          </button>
        </div>
      )} */}

      {/* Step 3: Images */}
      {step === 2 && (
        <div className="flex flex-col space-y-4 w-[80%] m-auto">
          <div>
            <label className="block text-lg font-semibold mb-1">Company Logo</label>
            <input
              type="file"
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              onChange={(e) => handleFileChange(e, "company_logo")}
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-1">Images</label>
            <input
              type="file"
              multiple
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              onChange={(e) => handleFileChange(e, "images")}
            />
          </div>
        </div>
      )}

          {/* Step 4: Submit */}
          {step === 3 && (
        <div className="flex flex-col space-y-6 w-full max-w-2xl mx-auto px-4">
            <div>
            <p className="text-center">Please review all the information before submitting.</p>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">Company Name:</p>
            <p>{formData.company_name}</p>

            <p className="text-lg font-semibold">Company Type:</p>
            <p>{formData.company_type}</p>

            <p className="text-lg font-semibold">Location:</p>
            <p>{formData.location}</p>

            <p className="text-lg font-semibold">Followers Count:</p>
            <p>{formData.followers_count}</p>

            <p className="text-lg font-semibold">Employee Count:</p>
            <p>{formData.employee_count}</p>

            <p className="text-lg font-semibold">Site URL:</p>
            <p>{formData.site_url}</p>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold">About:</p>
            <p>Content: {formData.about.content}</p>
            <p>Contact Info: {formData.about.contact_info}</p>
            <p>Stock Value: {formData.about.stock_value}</p>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold">People:</p>
            {formData.people.map((person, index) => (
              <div key={index} className="mb-2">
                <p>Category: {person.category}</p>
                <p>Content: {person.content}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-lg font-semibold">Company Logo:</p>
            {formData.company_logo && (
              <img
                src={URL.createObjectURL(formData.company_logo)}
                alt="Company Logo Preview"
                className="max-w-xs"
              />
            )}
          </div>

          <div>
            <p className="text-lg font-semibold">Images:</p>
            <div className="flex flex-wrap">
              {formData.images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Image ${index + 1}`}
                  className="max-w-xs mr-2 mb-2"
                />
              ))}
            </div>
          </div>

          
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={prevStep}
          disabled={step === 0}
        >
          Previous
        </button>
        {step < steps.length - 1 ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={nextStep}
          >
            Next
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
