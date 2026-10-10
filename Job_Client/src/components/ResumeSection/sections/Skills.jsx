import React, { useState } from "react";

const Skills = ({ data, updateData, nextStep, prevStep, isFirst, isLast }) => {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() === "") return;
    updateData([...(data || []), skillInput.trim()]);
    setSkillInput("");
  };

  const removeSkill = (index) => {
    const newSkills = (data || []).filter((_, idx) => idx !== index);
    updateData(newSkills);
  };

  return (
    <div className="rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-700">Skills</h2>

      {/* Input and Add Button */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          placeholder="Enter a skill"
          className="flex-grow border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
        />
        <button
          onClick={addSkill}
          className="px-5 py-2 cursor-pointer bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      {/* Skills Chips */}
      <div className="flex flex-wrap gap-2">
        {(data || []).map((skill, idx) => (
          <div
            key={idx}
            className="flex items-center bg-gray-100 text-blue-700 px-3 py-1 rounded-full font-medium border border-gray-300 shadow-sm"
          >
            <span>{skill}</span>
            <button
              className="ml-2 text-red-600 hover:text-red-500 font-bold transition"
              onClick={() => removeSkill(idx)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between space-x-2 mt-6">
        {!isFirst && (
          <button
            onClick={prevStep}
            className="px-5 py-2 rounded bg-gray-200 cursor-pointer font-semibold text-gray-500"
          >
            Previous
          </button>
        )}
        <button
          onClick={nextStep}
          className="px-6 py-2 rounded bg-blue-600 text-white font-semibold cursor-pointer"
        >
          Save & Next
        </button>
      </div>
    </div>
  );
};

export default Skills;
