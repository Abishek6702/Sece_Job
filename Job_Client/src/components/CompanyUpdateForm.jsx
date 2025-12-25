import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import close from "../assets/close.svg";
import ExitConfirmation from "./ExitConfirmation";
import { ArrowLeft, X } from "lucide-react";

export default function CompanyUpdateForm({ company, onCancel }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const steps = ["Company Info", "About", "Images", "Submit"];
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    company_name: company?.company_name || "",
    company_type: company?.company_type || "public",
    location: company?.location || "",
    followers_count: company?.followers_count || 0,
    founded: company.founded,
    revenue: company.revenue,
    employee_count: company?.employee_count || 0,
    site_url: company?.site_url || "",
    about: {
      content: company?.about?.content || "",
      contact_info: company?.about?.contact_info || "",
      stock_value: company?.about?.stock_value || "",
    },
    people: company?.people || [{ content: "", category: "" }],
    company_logo: null,
    images: [],
  });

  useEffect(() => {
    if (company) {
      setFormData({
        company_name: company.company_name || "",
        company_type: company.company_type || "public",
        location: company.location || "",
        followers_count: company.followers_count || 0,
        employee_count: company.employee_count || 0,
        founded:company.founded,
        revenue: company.revenue,
        site_url: company.site_url || "",
        about: {
          content: company.about?.content || "",
          contact_info: company.about?.contact_info || "",
          stock_value: company.about?.stock_value || "",
        },
        people: company.people || [{ content: "", category: "" }],
        company_logo: null,
        images: [],
      });
    }
  }, [company]);

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
      form.append("founded",formData.founded);
      form.append("revenue",formData.revenue);


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

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/companies/${company._id}`,
        {
          method: "PUT", // Changed to PUT
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update company data"); 
      }

      alert("Company data updated successfully!"); 
      onCancel(); 
      navigate("/employer-dashboard");
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
          <ArrowLeft  className="cursor-pointer"/>
          <X className="cursor-pointer" onClick={handleClose}/>
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
        <div className="flex flex-wrap gap-4 md:w-[80%] m-auto">
          <div className="md:w-[48%]">
            <label className="block text-lg font-semibold mb-1">
              Company Name
            </label>
            <input
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              placeholder="Company Name"
              value={formData.company_name}
              onChange={(e) => handleChange("company_name", e.target.value)}
            />
          </div>

          <div className="md:w-[48%]">
            <label className="block text-lg font-semibold mb-1">
              Company Type
            </label>
            <select
              className="w-full border p-2 rounded"
              value={formData.company_type}
              onChange={(e) => handleChange("company_type", e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="md:w-[48%]">
            <label className="block text-lg font-semibold mb-1">Location</label>
            <input
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <div className="md:w-[48%]">
            <label className="block text-lg font-semibold mb-1">
              Followers Count
            </label>
            <input
              type="number"
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              value={formData.followers_count}
              onChange={(e) => handleChange("followers_count", e.target.value)}
            />
          </div>

          <div className="md:w-[48%]">
            <label className="block text-lg font-semibold mb-1">
              Employee Count
            </label>
            <input
              type="number"
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              value={formData.employee_count}
              onChange={(e) => handleChange("employee_count", e.target.value)}
            />
          </div>

          <div className="md:w-[48%]">
            <label className="block text-lg font-semibold mb-1">
              Website URL
            </label>
            <input
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              placeholder="https://..."
              value={formData.site_url}
              onChange={(e) => handleChange("site_url", e.target.value)}
            />
          </div>
          <div className="md:w-[48%]">
            <label className="block text-lg font-semibold mb-1">
              Founded
            </label>
            <input
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              placeholder="2002"
              value={formData.founded}
              onChange={(e) => handleChange("founded", e.target.value)}
            />
          </div>
          <div className="md:w-[48%]">
            <label className="block text-lg font-semibold mb-1">
              Revenue
            </label>
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
            <label className="block text-lg font-semibold mb-1">
              About Content
            </label>
            <textarea
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              placeholder="Leading AI company."
              value={formData.about.content}
              onChange={(e) =>
                handleNestedChange("about", "content", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-1">
              Contact Info
            </label>
            <input
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              placeholder="info@techcorp.com"
              value={formData.about.contact_info}
              onChange={(e) =>
                handleNestedChange("about", "contact_info", e.target.value)
              }
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-1">
              Stock Value
            </label>
            <input
              className="input w-full border border-gray-300 rounded-sm p-2 text-sm outline-none"
              placeholder="$500M"
              value={formData.about.stock_value}
              onChange={(e) =>
                handleNestedChange("about", "stock_value", e.target.value)
              }
            />
          </div>
        </div>
      )}

      {/* Step 2: People
      {step === 2 && (
        <div className="flex flex-col space-y-4 w-[80%] m-auto">
          <h3 className="text-lg font-semibold mb-2">People</h3>
          {formData.people.map((person, index) => (
            <div key={index} className="mb-2 border p-2 rounded">
              <input
                className="w-full border p-2 mb-2"
                placeholder="Category"
                value={person.category}
                onChange={(e) =>
                  handlePeopleChange(index, "category", e.target.value)
                }
              />
              <input
                className="w-full border p-2"
                placeholder="Content"
                value={person.content}
                onChange={(e) =>
                  handlePeopleChange(index, "content", e.target.value)
                }
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
            <label className="block text-lg font-semibold mb-1">
              Company Logo
            </label>
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
            <p className="text-center">
              Please review all the information before submitting.
            </p>
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
        {/* <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={onCancel}
        >
          Cancel
        </button> */}
      </div>
    </div>
  );
}
