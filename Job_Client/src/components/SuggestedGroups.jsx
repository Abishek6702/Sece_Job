import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuggestionCompanys({ activeCompany }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const normalizeName = (name) => name?.trim().toLowerCase() || "";

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/companies`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const allCompanies = Array.isArray(data) ? data : [];
        const grouped = allCompanies.reduce((acc, company) => {
          const key = normalizeName(company.company_name);
          if (!key) return acc;
          if (!acc[key]) {
            acc[key] = { ...company };
          } else {
            acc[key].jobs = [...(acc[key].jobs || []), ...(company.jobs || [])];
          }
          return acc;
        }, {});
        setCompanies(Object.values(grouped));
      })
      .catch(() => setCompanies([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow ml-9 p-4 mx-auto max-h-[60vh] overflow-hidden">
        <div className="font-medium text-gray-700 text-sm">
          Loading companies...
        </div>
      </div>
    );
  }

  // Show only first 5 companies in the suggestion list
  const visibleSuggestions = companies.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow ml-9 p-4 mx-auto max-h-[60vh] overflow-hidden">
      {/* Header with title and See All button */}
      <div className="flex items-center justify-between ">
        <h2 className="font-semibold text-gray-800 text-base mb-3">
          Recommended Companies
        </h2>
        {companies.length > visibleSuggestions.length && (
          <button
            className="text-xs text-blue-600 font-medium hover:underline"
            onClick={() => navigate("/companies")}
          >
            See All
          </button>
        )}
      </div>

      {/* Scrollable list of company cards */}
      <div className="overflow-y-auto pr-2 scrollbar-hide max-h-[calc(60vh-50px)]">
        {visibleSuggestions.map((item) => {
          const normalizedKey = normalizeName(item.company_name);
          const isActive =
            activeCompany &&
            normalizeName(activeCompany.company_name) === normalizedKey;

          return (
            <div
              key={normalizedKey}
              onClick={() => navigate(`/companies`)}
              className={`rounded-lg p-3  cursor-pointer transition hover:bg-gray-50 ${
                isActive ? "border-blue-400 bg-gray-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Logo + Name */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      item.company_logo
                        ? `${
                            item.company_logo
                          }`
                        : "/default-logo.png"
                    }
                    alt={item.company_name || "Company"}
                    className="w-9 h-9 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <h2 className="font-semibold text-sm">
                      {item.company_name || "Company Name"}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {item.location || "Location"}
                    </p>
                  </div>
                </div>

                {/* Jobs Count */}
                <span className="px-3 py-0.5 border text-blue-600 rounded-xl text-xs font-medium">
                  {(item.jobs?.length || 0) + " Jobs"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
