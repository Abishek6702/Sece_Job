import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader, Eye, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();

      // Filter only employees (role === "employee")
      const employeesList = data.filter((user) => user.role === "employee");
      setEmployees(employeesList);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };
  const handleView = (id) => {
    navigate(`/admin/employees/${id}`);
  };

  const handleResume = (resumeUrl) => {
    if (!resumeUrl) {
      toast.error("Resume not uploaded");
      return;
    }

    window.open(resumeUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader className="animate-spin mx-auto mb-4" size={40} />
        <p className="text-gray-600">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex  items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Employees</h2>
        <span className="bg-blue-100 text-blue-800 px-2 py-0 rounded-full  font-semibold">
          {employees.length}
        </span>
      </div>

      {employees.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p className="text-lg">No employees found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Employee
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Phone
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Joined
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Resume
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {employees.map((employee) => (
                <tr
                  key={employee._id}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  {/* Employee */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {employee.name?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {employee.name}
                        </p>

                        <p className="text-xs text-gray-500">Employee</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {employee.email}
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {employee.phone}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        employee.isVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {employee.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </td>

                  {/* Resume */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleResume(employee.resume)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
                      title="View Resume"
                    >
                      <FileText size={18} />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleView(employee._id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      title="View Employee"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeesList;
