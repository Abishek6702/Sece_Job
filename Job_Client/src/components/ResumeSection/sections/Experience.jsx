import React, { useState, useEffect } from "react";

const Experience = ({
  data,
  updateData,
  nextStep,
  prevStep,
  isFirst,
  isLast,
}) => {
  const defaultEntry = {
    companyName: "",
    location: "",
    startDate: "",
    endDate: "",
    present: false,
    role: "",
    description: "",
  };

  const [fields, setFields] = useState(
    Array.isArray(data) && data.length > 0 ? data : [defaultEntry]
  );

  // 🔹 Only update parent when fields change
  useEffect(() => {
    updateData(fields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]); // ✅ no updateData dependency to avoid infinite loop

  const addEntry = () => {
    setFields((prev) => [...prev, { ...defaultEntry }]);
  };

  const removeEntry = (index) => {
    setFields((prev) => {
      const newFields = prev.filter((_, idx) => idx !== index);
      return newFields.length > 0 ? newFields : [defaultEntry];
    });
  };

  const handleChange = (idx, e) => {
    const { name, value, type, checked } = e.target;

    setFields((prev) =>
      prev.map((entry, i) => {
        if (i !== idx) return entry;

        if (name === "present") {
          return {
            ...entry,
            present: checked,
            endDate: checked ? "Present" : "",
          };
        }

        return { ...entry, [name]: type === "checkbox" ? checked : value };
      })
    );
  };

  return (
    <div className="rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold  text-gray-700">Experience</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
          onClick={addEntry}
        >
          Add Experience
        </button>
      </div>

      {fields.map((entry, idx) => (
        <div key={idx} className="mb-6 border-b border-gray-300 pb-4">
         <div className="flex flex-col space-y-4 md:grid md:grid-cols-2 md:gap-4">


            <div className="">
              <label className="block mb-1 text-gray-700 font-semibold">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={entry.companyName}
                onChange={(e) => handleChange(idx, e)}
                placeholder="Company Name"
                className="w-full border border-gray-300 bg-gray-50 
                focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-semibold">
                Company Location
              </label>
              <input
                type="text"
                name="location"
                value={entry.location}
                onChange={(e) => handleChange(idx, e)}
                placeholder="Location"
                className="w-full border border-gray-300 bg-gray-50 
                focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-semibold">
                Job Title
              </label>
              <input
                type="text"
                name="role"
                value={entry.role}
                onChange={(e) => handleChange(idx, e)}
                placeholder="Role"
                className="w-full border border-gray-300 bg-gray-50 
                focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-semibold">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={entry.startDate}
                onChange={(e) => handleChange(idx, e)}
                className="w-full border border-gray-300 bg-gray-50 
                focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            {/* End Date - hidden when "Present" is checked */}
            <div>
              {!entry.present && (
                <div>
                  <label className="block mb-1 text-gray-700 font-semibold">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={entry.endDate !== "Present" ? entry.endDate : ""}
                    onChange={(e) => handleChange(idx, e)}
                    className="w-full border border-gray-300 bg-gray-50 
                    focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="present"
                checked={entry.present}
                onChange={(e) => handleChange(idx, e)}
                className="mr-2"
              />
              <span className="text-gray-700 font-semibold">Currently Work Here</span>
            </div>

            <div className="col-span-2">
              <label className="block mb-1 text-gray-700 font-semibold">
                Role Description
              </label>
              <textarea
                name="description"
                value={entry.description}
                onChange={(e) => handleChange(idx, e)}
                placeholder="Role Description"
                className="w-full border border-gray-300 bg-gray-50 
                focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
                rows={3}
              />
            </div>
          </div>

          {fields.length > 1 && (
            <button
              className="text-red-500 mt-2"
              onClick={() => removeEntry(idx)}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      {/* Navigation */}
      <div className="flex items-center justify-between space-x-2 mt-6">
        {!isFirst && (
          <button
            onClick={prevStep}
            className="px-5 py-2 rounded bg-gray-200 
            cursor-pointer font-semibold text-gray-500"
          >
            Previous
          </button>
        )}
        <button
          onClick={nextStep}
          className="px-6 py-2 rounded bg-blue-600 text-white 
          font-semibold cursor-pointer"
        >
          Save & Next
        </button>
      </div>
    </div>
  );
};

export default Experience;
