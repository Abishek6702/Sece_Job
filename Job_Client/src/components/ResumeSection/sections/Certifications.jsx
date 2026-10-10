import React, { useState } from "react";

const Certifications = ({
  data,
  updateData,
  nextStep,
  prevStep,
  isFirst,
  isLast,
}) => {
  const [fields, setFields] = useState(
    data.length > 0
      ? data
      : [
          {
            courseName: "",
            institution: "",
            startDate: "",
            endDate: "",
            present: false,
            location: "",
          },
        ]
  );

  const addEntry = () => {
    setFields([
      ...fields,
      {
        courseName: "",
        institution: "",
        startDate: "",
        endDate: "",
        present: false,
        location: "",
      },
    ]);
  };

  const removeEntry = (index) => {
    const newFields = fields.filter((_, idx) => idx !== index);
    setFields(newFields);
    updateData(newFields);
  };

  const handleChange = (idx, e) => {
    const { name, value, type, checked } = e.target;
    const newFields = fields.map((entry, i) =>
      i === idx
        ? { ...entry, [name]: type === "checkbox" ? checked : value }
        : entry
    );
    setFields(newFields);
    updateData(newFields);
  };

  return (
    <div className="rounded-xl p-6">
      <div className=" flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-700">
          Certifications & Courses
        </h2>
        {/* Add Button */}
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer font-semibold"
          onClick={addEntry}
          type="button"
        >
          Add Certification<span className="hidden md:block"></span>
        </button>
      </div>

      {fields.map((entry, idx) => (
        <div key={idx} className="mb-6 border-b border-gray-300 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Name */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Course Name
              </label>
              <input
                type="text"
                name="courseName"
                value={entry.courseName}
                onChange={(e) => handleChange(idx, e)}
                placeholder="Enter Course Name"
                className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            {/* Institution */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Institution
              </label>
              <input
                type="text"
                name="institution"
                value={entry.institution}
                onChange={(e) => handleChange(idx, e)}
                placeholder="Enter Institution"
                className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={entry.startDate}
                onChange={(e) => handleChange(idx, e)}
                className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            {/* End Date + Present */}
            <div>
              {!entry.present && (
                <>
                  <label className="block mb-1 font-semibold text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={entry.endDate}
                    onChange={(e) => handleChange(idx, e)}
                    className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
                  />
                </>
              )}

              <label
                className={`flex items-center space-x-2 font-semibold text-gray-700 ${
                  entry.present ? "mt-9" : "mt-1"
                }`}
              >
                <input
                  type="checkbox"
                  name="present"
                  checked={entry.present}
                  onChange={(e) => handleChange(idx, e)}
                />
                <span>Currently Studying</span>
              </label>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={entry.location}
                onChange={(e) => handleChange(idx, e)}
                placeholder="Enter Location"
                className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>
          </div>

          {/* Remove Button (not for first entry) */}
          {fields.length > 1 && idx !== 0 && (
            <button
              className="text-red-500 mt-2"
              onClick={() => removeEntry(idx)}
              type="button"
            >
              Remove Certification
            </button>
          )}
        </div>
      ))}

      {/* Navigation */}
      <div className="flex items-center justify-between space-x-2 mt-6">
        {!isFirst && (
          <button
            onClick={prevStep}
            className="px-5 py-2 rounded bg-gray-200 cursor-pointer font-semibold text-gray-500"
            type="button"
          >
            Previous
          </button>
        )}
        <button
          onClick={nextStep}
          className="px-6 py-2 rounded bg-blue-600 text-white cursor-pointer font-semibold"
          type="button"
        >
          Save & Next
        </button>
      </div>
    </div>
  );
};

export default Certifications;
