import React, { useState, useEffect } from "react";

const Education = ({
  data,
  updateData,
  nextStep,
  prevStep,
  isFirst,
  isLast,
}) => {
  const defaultEntry = {
    courseName: "",
    college: "",
    branch: "",
    location: "",
    startDate: "",
    endDate: "",
    isPresent: false,
    cgpa: "",
  };

  const [fields, setFields] = useState([defaultEntry]);

  // Sync local state when parent sends new data
  useEffect(() => {
    if (data && data.length > 0) {
      setFields(data);
    } else {
      setFields([defaultEntry]);
    }
  }, [data]);

  const addEntry = () => {
    setFields([...fields, { ...defaultEntry }]);
  };

  const removeEntry = (index) => {
    const newFields = fields.filter((_, idx) => idx !== index);
    setFields(newFields.length > 0 ? newFields : [defaultEntry]); // always keep at least one
  };

  const handleChange = (idx, e) => {
    const { name, value, type, checked } = e.target;

    const newFields = fields.map((entry, i) => {
      if (i !== idx) return entry;

      if (name === "isPresent") {
        return {
          ...entry,
          isPresent: checked,
          endDate: checked ? "Present" : "",
        };
      }

      return { ...entry, [name]: value };
    });

    setFields(newFields);
  };

  const handleSaveAndNext = () => {
    updateData(fields); // ✅ update parent only once
    nextStep();
  };

  return (
    <div className="rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold  text-gray-700">
          Education Qualifications
        </h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold  "
          onClick={addEntry}
          type="button"
        >
          <p className="whitespace-nowrap">Add Education   <span className="hidden md:block"></span></p>
        </button>
      </div>

      {fields.map((entry, idx) => (
        <div key={idx} className="mb-6 border-b border-gray-300 pb-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Course */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Course
              </label>
              <input
                type="text"
                name="courseName"
                value={entry.courseName}
                onChange={(e) => handleChange(idx, e)}
                placeholder="Course Name"
                className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            {/* College */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                School / College
              </label>
              <input
                type="text"
                name="college"
                value={entry.college}
                onChange={(e) => handleChange(idx, e)}
                placeholder="College"
                className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Branch Studied
              </label>
              <input
                type="text"
                name="branch"
                value={entry.branch}
                onChange={(e) => handleChange(idx, e)}
                placeholder="Branch"
                className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Institution Location
              </label>
              <input
                type="text"
                name="location"
                value={entry.location}
                onChange={(e) => handleChange(idx, e)}
                placeholder="Location"
                className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Course Start
              </label>
              <input
                type="date"
                name="startDate"
                value={entry.startDate}
                onChange={(e) => handleChange(idx, e)}
                className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            {/* End Date / Present */}
            <div>
              {!entry.isPresent && (
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Course End
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={entry.endDate !== "Present" ? entry.endDate : ""}
                    onChange={(e) => handleChange(idx, e)}
                    className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
                  />
                </div>
              )}
              <label className={`flex items-center space-x-1 mt-2 ${entry.isPresent?"mt-9":"mt-0"}`}>
                <input
                  type="checkbox"
                  name="isPresent"
                  checked={entry.isPresent}
                  onChange={(e) => handleChange(idx, e)}
                />
                <span className="font-semibold text-gray-700">Currently Study Here</span>
              </label>
            </div>

            {/* CGPA */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Marks Scored
              </label>
              <input
                type="number"
                name="cgpa"
                value={entry.cgpa}
                onChange={(e) => handleChange(idx, e)}
                placeholder="CGPA"
                className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>
          </div>

          {fields.length > 1 && (
            <button
              className="text-red-500 mt-2"
              onClick={() => removeEntry(idx)}
              type="button"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      {/* Navigation */}
      <div className="flex space-x-2 mt-6 justify-between">
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
          onClick={handleSaveAndNext}
          className="px-6 py-2 rounded bg-blue-600 text-white cursor-pointer font-semibold"
          type="button"
        >
          Save & Next
        </button>
      </div>
    </div>
  );
};

export default Education;
