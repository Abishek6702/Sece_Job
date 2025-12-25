import React, { useState } from "react";

const PersonalInfo = ({
  data,
  updateData,
  nextStep,
  prevStep,
  isFirst,
  isLast,
}) => {
  const [newKey, setNewKey] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      updateData({ ...data, photo: files[0] });
    } else {
      updateData({ ...data, [name]: value });
    }
  };
  const addSocialLink = () => {
    if (newKey.trim() === "" || newUrl.trim() === "") return;
    const newLinks = data.socialLinks ? [...data.socialLinks] : [];
    newLinks.push({ key: newKey.trim(), url: newUrl.trim() });
    updateData({ ...data, socialLinks: newLinks });
    setNewKey("");
    setNewUrl("");
  };

  // Remove a social link by index
  const removeSocialLink = (index) => {
    const newLinks = [...(data.socialLinks || [])];
    newLinks.splice(index, 1);
    updateData({ ...data, socialLinks: newLinks });
  };

  return (
    <div className=" rounded-xl p-6   ">
      <h2 className="text-xl font-bold mb-6 text-gray-700">
        Personal Information
      </h2>

      {/* Photo at center top */}
      <div className="mb-4 hidden">
        <label className="block  font-semibold text-gray-700 text-lg">
          Profile Photo
        </label>

        <div className="relative group">
          {data.photo ? (
            <img
              src={URL.createObjectURL(data.photo)}
              alt="Preview"
              className="w-18 h-18 object-cover rounded-full border-2 border-gray-300 shadow-md"
            />
          ) : (
            <div className="w-18 h-18 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400">
              <span className="text-sm">Upload</span>
            </div>
          )}

          <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-sm"></span>
          </div>

          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB</p>
      </div>

      {/* Grid for the rest */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Enter Your Name"
            className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Phone
          </label>
          <input
            type="number"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            placeholder="Enter Phone Number"
            className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Enter Email ID"
            className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={data.address}
            onChange={handleChange}
            placeholder="Enter Current Address  "
            className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
          />
        </div>

        {/* Social Links */}
        <div className=" md:col-span-2">
          <label className="block mb-1 font-semibold text-gray-700 ">
            Social Media Links
          </label>

          {/* Input fields */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Platform (e.g. LinkedIn)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="flex-1 border border-gray-300 bg-gray-50 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              placeholder="Profile URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1 border border-gray-300 bg-gray-50 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addSocialLink}
              className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              type="button"
            >
              Add
            </button>
          </div>

          {/* Display added links */}
          <div className="flex flex-wrap gap-3">
            {(data.socialLinks || []).map((link, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-sm border border-gray-300 text-sm"
              >
                {/* Clickable key */}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue-600 hover:underline cursor-pointer"
                >
                  {link.key}
                </a>

                {/* Remove button */}
                <button
                  onClick={() => removeSocialLink(idx)}
                  className="ml-1 text-red-500 hover:text-red-700 font-bold"
                  type="button"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold text-gray-700 ">
            Summary
          </label>
          <textarea
            name="summary"
            value={data.summary}
            onChange={handleChange}
            placeholder="About Yourself"
            className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
            rows={4}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-2 mt-6">
        {!isFirst && (
          <button
            onClick={prevStep}
            className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Previous
          </button>
        )}
        <button
          onClick={nextStep}
          className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer font-semibold"
        >
          Save & Next
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
