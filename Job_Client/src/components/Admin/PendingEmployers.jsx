import React, { useState } from "react";
import EmployerDrawer from "./EmployerDrawer.jsx";
import { Check, X, Loader, Eye, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PendingEmployers = ({ employers, loading, onApprove, onReject }) => {
  const navigate = useNavigate();
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleView = (employer) => {
    setSelectedEmployer(employer);
    setDrawerOpen(true);
  };

  if (loading && employers.length === 0) {
    return (
      <div className="p-8 text-center">
        <Loader className="animate-spin mx-auto mb-4" size={40} />
        <p className="text-gray-600">Loading pending employers...</p>
      </div>
    );
  }

  if (employers.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-lg">No pending employer approvals</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Employer
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Email
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Phone
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Applied
            </th>

            {/* <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              Resume
            </th> */}

            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {employers.map((employer) => (
            <tr
              key={employer._id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              {/* Employer */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                    {employer.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {employer.name}
                    </p>

                    <p className="text-xs text-gray-500">Employer</p>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td className="px-6 py-4 text-sm text-gray-600">
                {employer.email}
              </td>

              {/* Phone */}
              <td className="px-6 py-4 text-sm text-gray-600">
                {employer.phone}
              </td>

              {/* Applied Date */}
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(employer.createdAt).toLocaleDateString()}
              </td>

              {/* Resume */}
              {/* <td className="px-6 py-4 text-center">
                <button
                  onClick={() =>
                    employer.resume &&
                    window.open(employer.resume, "_blank")
                  }
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
                  title="View Resume"
                >
                  <FileText size={18} />
                </button>
              </td> */}

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  {/* View */}
                  <button
                    onClick={() => handleView(employer)}
                    className="inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                    title="View Employer"
                  >
                    <Eye size={18} />
                  </button>

                  {/* Approve */}
                  <button
                    disabled={loading}
                    onClick={() => onApprove(employer._id)}
                    className="inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50 transition"
                    title="Approve"
                  >
                    <Check size={18} />
                  </button>

                  {/* Reject */}
                  {/* <button
                    onClick={() => onReject(employer)}
                    className="inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                    title="Reject"
                  >
                    <X size={18} />
                  </button> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EmployerDrawer
        isOpen={drawerOpen}
        employer={selectedEmployer}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default PendingEmployers;
