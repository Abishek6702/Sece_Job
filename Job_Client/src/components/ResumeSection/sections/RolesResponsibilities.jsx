import React, { useState } from "react";

const RolesResponsibilities = ({
  data,
  updateData,
  nextStep,
  prevStep,
  isFirst,
  isLast,
  onSubmit,
}) => {
  const [roleInput, setRoleInput] = useState("");
  const roles = data || [];

  const addRole = () => {
    if (roleInput.trim() === "") return;
    updateData([...roles, roleInput.trim()]);
    setRoleInput("");
  };

  const removeRole = (idx) => {
    updateData(roles.filter((_, i) => i !== idx));
  };

  const handleFinalSubmit = () => {
    onSubmit(); // directly submit without confirmation modal
  };

  return (
    <div className="rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-700">
        Roles & Responsibilities
      </h2>

      {/* Input + Add Button */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={roleInput}
          onChange={(e) => setRoleInput(e.target.value)}
          placeholder="Enter role/responsibility"
          className="flex-grow border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-2 rounded-lg"
        />
        <button
          onClick={addRole}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
        >
          Add
        </button>
      </div>

      {/* Explicit Numbered List */}
      <div className="flex-1 overflow-y-auto">
        {roles.length === 0 ? (
          <p className="text-gray-500 italic">No roles added yet.</p>
        ) : (
          <ul className="space-y-3">
            {roles.map((role, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-gray-700 text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 font-medium">{role}</span>
                </div>
                <button
                  className="text-red-500 font-bold hover:text-red-700 ml-3"
                  onClick={() => removeRole(idx)}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between space-x-2 mt-6">
        {!isFirst && (
          <button
            onClick={prevStep}
            className="px-5 py-2 rounded bg-gray-200 cursor-pointer font-semibold text-gray-600 hover:bg-gray-300"
          >
            Previous
          </button>
        )}
        {isLast ? (
          <button
            onClick={handleFinalSubmit}
            className="px-6 py-2 rounded bg-green-600 text-white font-semibold cursor-pointer hover:bg-green-700"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="px-6 py-2 rounded bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-700"
          >
            Save & Next
          </button>
        )}
      </div>
    </div>
  );
};

export default RolesResponsibilities;
