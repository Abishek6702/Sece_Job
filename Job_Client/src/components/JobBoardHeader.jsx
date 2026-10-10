import React from "react";
import { Locate, Search } from "lucide-react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { filterOptions } from "../pages/JobBoard";

const JobBoardHeader = ({
  isMobile,
  showMobileFilter,
  setShowMobileFilter,
  position,
  handleTitleChange,
  location,
  handleLocationChange,
  showTitleDropdown,
  setShowTitleDropdown,
  filteredTitleSuggestions,
  selectTitleSuggestion,
  showLocationDropdown,
  setShowLocationDropdown,
  filteredLocationSuggestions,
  selectLocationSuggestion,
  filters,
  salaryRange,
  setSalaryRange,
  setHasInteractedWithSalarySlider,
  jobFilter,
  setJobFilter,
  handleCheckbox,
  handleSelect,
  clearFilters,
}) => {
  return (
    <>
      {/* Top Header Section */}
      <div className="bg-gray-50 rounded-2xl p-6 md:p-10 mb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Find Your dream job</h1>
        <p className="text-gray-500 mb-8">
          Looking for jobs? Browse our latest job openings to view & apply to the best jobs today!
        </p>

        {/* Desktop Search & Filters */}
        {!isMobile && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search inputs */}
              <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 gap-2 relative">
                <Search className="w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search job title or keyword"
                  value={position}
                  onChange={handleTitleChange}
                  onFocus={() => setShowTitleDropdown(filteredTitleSuggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowTitleDropdown(false), 150)}
                  className="bg-transparent outline-none text-gray-700 w-full"
                />
                {showTitleDropdown && filteredTitleSuggestions.length > 0 && (
                  <ul className="absolute top-full left-0 z-30 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-2 max-h-52 overflow-auto">
                    {filteredTitleSuggestions.map((title, idx) => (
                      <li
                        key={`${title}-${idx}`}
                        onMouseDown={() => selectTitleSuggestion(title)}
                        className="cursor-pointer px-4 py-2 hover:bg-blue-50 text-gray-700 font-medium"
                      >
                        {title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 gap-2 relative">
                <Locate className="w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Country or timezone"
                  value={location}
                  onChange={handleLocationChange}
                  onFocus={() => setShowLocationDropdown(filteredLocationSuggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowLocationDropdown(false), 150)}
                  className="bg-transparent outline-none text-gray-700 w-full"
                />
                {showLocationDropdown && filteredLocationSuggestions.length > 0 && (
                  <ul className="absolute top-full left-0 z-30 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-2 max-h-52 overflow-auto">
                    {filteredLocationSuggestions.map((loc, idx) => (
                      <li
                        key={`${loc}-${idx}`}
                        onMouseDown={() => selectLocationSuggestion(loc)}
                        className="cursor-pointer px-4 py-2 hover:bg-blue-50 text-gray-700 font-medium"
                      >
                        {loc}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FilterForm
                filters={filters}
                salaryRange={salaryRange}
                setSalaryRange={setSalaryRange}
                setHasInteractedWithSalarySlider={setHasInteractedWithSalarySlider}
                jobFilter={jobFilter}
                setJobFilter={setJobFilter}
                handleCheckbox={handleCheckbox}
                handleSelect={handleSelect}
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="rounded-lg bg-red-50 text-red-600 font-medium text-sm px-4 py-2 hover:bg-red-100 transition-colors"
                onClick={clearFilters}
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Filter Popup */}
      {isMobile && showMobileFilter && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="font-bold text-xl">Search & Filter</span>
            <button
              className="rounded px-3 py-1 bg-gray-100 text-gray-700 font-semibold"
              onClick={() => setShowMobileFilter(false)}
            >
              Close
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 gap-2">
              <Search className="w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Job title"
                value={position}
                onChange={handleTitleChange}
                className="bg-transparent outline-none w-full"
              />
            </div>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 gap-2">
              <Locate className="w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={handleLocationChange}
                className="bg-transparent outline-none w-full"
              />
            </div>
          </div>

          <div className="space-y-6">
            <FilterForm
              filters={filters}
              salaryRange={salaryRange}
              setSalaryRange={setSalaryRange}
              setHasInteractedWithSalarySlider={setHasInteractedWithSalarySlider}
              jobFilter={jobFilter}
              setJobFilter={setJobFilter}
              handleCheckbox={handleCheckbox}
              handleSelect={handleSelect}
            />
          </div>

          <div className="mt-8 mb-4">
            <button
              className="w-full rounded-lg bg-red-50 text-red-600 font-bold text-lg py-3"
              onClick={() => {
                clearFilters();
                setShowMobileFilter(false);
              }}
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </>
  );
};

function FilterForm({
  filters,
  salaryRange,
  setSalaryRange,
  setHasInteractedWithSalarySlider,
  jobFilter,
  setJobFilter,
  handleCheckbox,
  handleSelect,
}) {
  return (
    <>
      <div className="mb-4 text-gray-600">
        <label className="block text-sm font-semibold mb-2">Date Posted</label>
        <select
          value={filters.datePosted}
          onChange={handleSelect}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100"
        >
          {filterOptions.datePosted.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4 text-gray-600">
        <label className="block text-sm font-semibold mb-2">Job type</label>
        <div className="space-y-2">
          {filterOptions.jobType.map((type) => (
            <label key={type} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.jobType.includes(type)}
                onChange={() => handleCheckbox("jobType", type)}
                className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="group-hover:text-gray-900 transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4 text-gray-600">
        <label className="block text-sm font-semibold mb-2">Work Place</label>
        <div className="space-y-2">
          {filterOptions.remote.map((type) => (
            <label key={type} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.remote.includes(type)}
                onChange={() => handleCheckbox("remote", type)}
                className="mr-3 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="group-hover:text-gray-900 transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4 text-gray-600">
        <label className="block text-md font-medium mb-3">Salary Range</label>
        <RangeSlider
          min={0}
          max={5000000}
          step={10000}
          value={salaryRange}
          onInput={(value) => {
            setSalaryRange(value);
            setHasInteractedWithSalarySlider(true);
          }}
        />
        <div className="flex justify-between mt-2 text-sm">
          <span>₹{salaryRange[0].toLocaleString()}</span>
          <span>₹{salaryRange[1].toLocaleString()}</span>
        </div>
      </div>
    </>
  );
}

export default JobBoardHeader;
