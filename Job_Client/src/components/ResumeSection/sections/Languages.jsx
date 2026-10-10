import React, { useState } from "react";

const Languages = ({ data, updateData, nextStep, prevStep, isFirst, isLast }) => {
  const [langInput, setLangInput] = useState("");

  const addLang = () => {
    if (langInput.trim() === "") return;
    updateData([...(data || []), langInput.trim()]);
    setLangInput("");
  };

  const removeLang = (index) => {
    const newLangs = (data || []).filter((_, idx) => idx !== index);
    updateData(newLangs);
  };

  return (
    <div className="rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-700">Languages</h2>

      {/* Input & Add Button */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={langInput}
          onChange={(e) => setLangInput(e.target.value)}
          placeholder="Enter a language"
          className="flex-grow border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
        />
        <button
          onClick={addLang}
          className="px-5 py-2 bg-blue-600 cursor-pointer text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      {/* Languages as Chips */}
      <div className="flex flex-wrap gap-2">
        {(data || []).map((lang, idx) => (
          <div
            key={idx}
            className="flex items-center bg-gray-100 text-blue-700 px-3 py-1 rounded-full font-medium shadow-sm border border-gray-300"
          >
            <span>{lang}</span>
            <button
              className="ml-2 text-red-600 hover:text-red-500 font-bold transition"
              onClick={() => removeLang(idx)}
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

export default Languages;
