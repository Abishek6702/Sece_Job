import React, { useState } from "react";

const DEFAULT_LOCATIONS = [
  "Coimbatore", "Madurai", "Chennai", "Pollachi", "Cuddalore", "Dharmapuri",
  "Dindigul", "Erode", "Kallakurichi", "Karur", "Nagapattinam",
  "Los Angeles", "Salem", "Thanjavur", "Bangalore","Tiruppur"
];

export default function PersonalInfo({ formData, setFormData, errors }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState(DEFAULT_LOCATIONS);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "location") {
      if (value.trim()) {
        setFilteredLocations(
          DEFAULT_LOCATIONS.filter((loc) =>
            loc.toLowerCase().includes(value.toLowerCase())
          )
        );
      } else {
        setFilteredLocations(DEFAULT_LOCATIONS);
      }
    }
  };

  const handleLocationFocus = () => {
    setShowSuggestions(true);
    setFilteredLocations(DEFAULT_LOCATIONS);
  };

  const handleSuggestionClick = (loc) => {
    setFormData((prev) => ({ ...prev, location: loc }));
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    // Delay hiding so click can register
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Personal Information</h2>
      <p className="mb-4 text-gray-700">Fill in your personal details</p>

      {/* First Name */}
      <div className="mb-6">
        <label className="font-bold">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-xl w-full mt-2 outline-none"
          placeholder="Enter Your First Name"
        />
        {errors?.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="mb-4">
        <label className="font-bold">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="border p-2 border-gray-300 rounded-xl w-full mt-2 outline-none"
          placeholder="Enter Your Last Name"
        />
        {errors?.lastName && (
          <p className="text-red-500 text-sm">{errors.lastName}</p>
        )}
      </div>

      {/* Location */}
      <div className="mb-4 relative">
        <label className="font-bold">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          onFocus={handleLocationFocus}
          onBlur={handleBlur}
          className="border p-2 border-gray-300 rounded-xl w-full mt-2 outline-none"
          placeholder="Enter Your Location"
          autoComplete="off"
        />
        {showSuggestions && (
          <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-auto mt-1">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <li
                  key={loc}
                  onMouseDown={() => handleSuggestionClick(loc)}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  {loc}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-400">No matching locations</li>
            )}
          </ul>
        )}
        {errors?.location && (
          <p className="text-red-500 text-sm">{errors.location}</p>
        )}
      </div>
    </div>
  );
}