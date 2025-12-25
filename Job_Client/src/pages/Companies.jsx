import React, { useEffect, useState, useRef } from "react";
import CompanyListing from "../components/CompanyListing";
import CompanyDetails from "../components/CompanyDetails";
import { Building2, LocateIcon, Search } from "lucide-react";

const Companies = () => {
  const [fullScreen, setFullScreeen] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({});
  const [nameFilter, setNameFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [company, setCompany] = useState([]);

  // Autocomplete related state & refs
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [filteredNameSuggestions, setFilteredNameSuggestions] = useState([]);
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const nameInputRef = useRef(null);
  const nameFetchTimeout = useRef();

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [filteredLocationSuggestions, setFilteredLocationSuggestions] =
    useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationInputRef = useRef(null);
  const locationFetchTimeout = useRef();

  // Fetch companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/companies`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }

        const data = await response.json();
        setCompany(data);

        // Initialize company details on desktop if data exists
        if (data.length > 0 && window.innerWidth >= 768) {
          setCompanyDetails(data[0]);
        } else {
          setCompanyDetails({});
        }
      } catch (error) {
        console.error("Error fetching companies:", error.message);
      }
    };

    fetchCompanies();
  }, []);

  // Extract unique names and locations for autocomplete suggestions whenever companies data changes
  useEffect(() => {
    if (!company || company.length === 0) {
      setNameSuggestions([]);
      setLocationSuggestions([]);
      return;
    }

    const uniqueNames = [
      ...new Set(company.map((c) => c.company_name).filter(Boolean)),
    ];
    setNameSuggestions(uniqueNames);

    const uniqueLocations = [
      ...new Set(company.map((c) => c.location).filter(Boolean)),
    ];
    setLocationSuggestions(uniqueLocations);
  }, [company]);

  // Filter companies based on the *selected* name and location filters (full string match allowed – used for final filtering)
  const filteredCompanies = company.filter((c) => {
    const matchesName = c.company_name
      ?.toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchesLocation = c.location
      ?.toLowerCase()
      .includes(locationFilter.toLowerCase());

    return matchesName && matchesLocation;
  });

  // Manage company details when filtered list changes or filters update
  useEffect(() => {
    if (filteredCompanies.length === 0) {
      setCompanyDetails({}); // no results, clear detail
    } else {
      if (
        !companyDetails ||
        !filteredCompanies.some(
          (c) => c.id === companyDetails.id || c._id === companyDetails._id
        )
      ) {
        setCompanyDetails(filteredCompanies[0]);
      }
    }
    // eslint-disable-next-line
  }, [nameFilter, locationFilter, company.length]);

  // Handle company name input changes with debounce and filtering
  const handleNameInputChange = (e) => {
    const value = e.target.value;
    setNameFilter(value);

    if (!value) {
      setFilteredNameSuggestions([]);
      setShowNameDropdown(false);
      return;
    }

    clearTimeout(nameFetchTimeout.current);
    nameFetchTimeout.current = setTimeout(() => {
      const filtered = nameSuggestions.filter((name) =>
        name.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredNameSuggestions(filtered);
      setShowNameDropdown(filtered.length > 0);
    }, 150);
  };

  // Handle location input changes with debounce and filtering
  const handleLocationInputChange = (e) => {
    const value = e.target.value;
    setLocationFilter(value);

    if (!value) {
      setFilteredLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    clearTimeout(locationFetchTimeout.current);
    locationFetchTimeout.current = setTimeout(() => {
      const filtered = locationSuggestions.filter((loc) =>
        loc.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredLocationSuggestions(filtered);
      setShowLocationDropdown(filtered.length > 0);
    }, 150);
  };

  // Select suggestion from the dropdown for company name
  const selectNameSuggestion = (name) => {
    setNameFilter(name);
    setShowNameDropdown(false);
  };

  // Select suggestion from the dropdown for location
  const selectLocationSuggestion = (loc) => {
    setLocationFilter(loc);
    setShowLocationDropdown(false);
  };

  return (
    <div className="w-[90%] m-auto mt-4 h-[88vh] flex flex-col bg-white rounded-lg">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-white px-2 w-full mb-4 ">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center bg-white border border-gray-200 rounded-full px-6 py-2 shadow-sm gap-4">
           
            <div className="relative flex-1" ref={nameInputRef}>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 text-gray-400 hidden md:block" />
                <input
                  type="text"
                  placeholder="Search by Company Name"
                  value={nameFilter}
                  onChange={handleNameInputChange}
                  onFocus={() =>
                    setShowNameDropdown(filteredNameSuggestions.length > 0)
                  }
                  onBlur={() =>
                    setTimeout(() => setShowNameDropdown(false), 150)
                  }
                  className="bg-transparent outline-none text-gray-600 placeholder-gray-400 w-full truncate pr-6"
                />
                {nameFilter && (
                  <button
                    onClick={() => setNameFilter("")}
                    className="absolute right-2 cursor-pointer text-gray-400 hover:text-gray-600"
                    aria-label="Clear Company Name"
                    type="button"
                    tabIndex={-1} // so it doesn't focus on tabbing
                  >
                    &#x2715; {/* × character */}
                  </button>
                )}
              </div>
              {showNameDropdown && filteredNameSuggestions.length > 0 && (
                <ul className="absolute z-30 left-0 bg-white border border-gray-300 rounded-xl shadow-lg shadow-gray-300 w-full mt-1 max-h-52 overflow-auto">
                  {filteredNameSuggestions.map((name, idx) => (
                    <li
                      key={`${name}-${idx}`}
                      onMouseDown={() => selectNameSuggestion(name)}
                      className="cursor-pointer px-4 py-2 hover:bg-green-50"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Location Input with clear button */}
            <div className="relative flex-1" ref={locationInputRef}>
              <div className="flex items-center gap-2">
                <LocateIcon className="w-5 text-gray-400 hidden md:block" />
                <input
                  type="text"
                  placeholder="Search by Location"
                  value={locationFilter}
                  onChange={handleLocationInputChange}
                  onFocus={() =>
                    setShowLocationDropdown(
                      filteredLocationSuggestions.length > 0
                    )
                  }
                  onBlur={() =>
                    setTimeout(() => setShowLocationDropdown(false), 150)
                  }
                  className="bg-transparent outline-none text-gray-600 placeholder-gray-400 w-full truncate pr-6"
                />
                {locationFilter && (
                  <button
                    onClick={() => setLocationFilter("")}
                    className="absolute right-2 cursor-pointer text-gray-400 hover:text-gray-600"
                    aria-label="Clear Location"
                    type="button"
                    tabIndex={-1}
                  >
                    &#x2715; {/* × character */}
                  </button>
                )}
              </div>
              {showLocationDropdown &&
                filteredLocationSuggestions.length > 0 && (
                  <ul className="absolute z-30 left-0 bg-white border border-gray-300 rounded-xl shadow-lg shadow-gray-300 w-full mt-1 max-h-52 overflow-auto">
                    {filteredLocationSuggestions.map((loc, idx) => (
                      <li
                        key={`${loc}-${idx}`}
                        onMouseDown={() => selectLocationSuggestion(loc)}
                        className="cursor-pointer px-4 py-2 hover:bg-green-50"
                      >
                        {loc}
                      </li>
                    ))}
                  </ul>
                )}
            </div>

            <button
              type="button"
              className="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 transition"
            >
              <Search className="w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content: Company list and details */}
      <div className="flex-1">
        <div className="block md:hidden">
          {companyDetails && (companyDetails.id || companyDetails._id) ? (
            <div>
              <button
                onClick={() => setCompanyDetails({})}
                className="text-blue-500 font-medium mb-2"
              >
                ← Back to list
              </button>
              <CompanyDetails companyDetails={companyDetails} />
            </div>
          ) : (
            <CompanyListing
              company_props={filteredCompanies}
              setCompanyDetails={setCompanyDetails}
              activeCompany={companyDetails}
            />
          )}
        </div>

        <div className="hidden md:grid md:grid-cols-12 gap-6 flex-1 md:min-h-0">
          <div className="md:col-span-4 h-full min-h-0 overflow-auto">
            <CompanyListing
              company_props={filteredCompanies}
              setCompanyDetails={setCompanyDetails}
              activeCompany={companyDetails}
            />
          </div>
          <div className="md:col-span-8 h-full min-h-0 overflow-auto">
            <CompanyDetails
              companyDetails={filteredCompanies.length ? companyDetails : {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
