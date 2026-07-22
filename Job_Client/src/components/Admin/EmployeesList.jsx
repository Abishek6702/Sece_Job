import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader, Eye, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmployeeDrawer from "./EmployeeDrawer.jsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
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
  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setIsDrawerOpen(true);
  };

  const handleResume = (resumeUrl) => {
    if (!resumeUrl) {
      toast.error("Resume not uploaded");
      return;
    }

    window.open(resumeUrl, "_blank");
  };

  const filteredEmployees = employees.filter((employee) => {
    const search = searchTerm.toLowerCase();

    return (
      employee?.name?.toLowerCase().includes(search) ||
      employee?.email?.toLowerCase().includes(search) ||
      employee?.phone?.toLowerCase().includes(search) ||
      employee?.onboarding?.preferredRoles?.some((role) =>
        role.toLowerCase().includes(search),
      ) ||
      employee?.onboarding?.skills?.some((skill) =>
        skill.toLowerCase().includes(search),
      ) 
    );
  });

  const handleSelect = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map((emp) => emp._id));
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employees");

    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Preferred Role", key: "preferredRole", width: 25 },
      { header: "Skills", key: "skills", width: 50 },
      { header: "Resume Link", key: "resume", width: 50 },
    ];

    const data =
      selectedEmployees.length > 0
        ? filteredEmployees.filter((emp) => selectedEmployees.includes(emp._id))
        : filteredEmployees;

    data.forEach((employee) => {
      worksheet.addRow({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        preferredRole: employee?.onboarding?.preferredRoles?.join(", ") || "",
        skills: employee?.onboarding?.skills?.join(", ") || "",
        resume: employee?.onboarding?.resume || "",
      });
    });

    // Make resume links clickable
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const resumeCell = row.getCell(6);

      if (resumeCell.value) {
        resumeCell.value = {
          text: resumeCell.value,
          hyperlink: resumeCell.value,
        };

        resumeCell.font = {
          color: { argb: "FF0000FF" },
          underline: true,
        };
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "employees.xlsx",
    );
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
      <div className="flex  items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-700">Employees</h2>
          <span className="bg-blue-100 text-blue-800 px-2 py-0 rounded-full  font-semibold">
            {filteredEmployees.length}
          </span>
        </div>
        <div className="  flex items-center gap-4 pr-4">
          <input
            type="text"
            placeholder="Search by name, email, phone, roles ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={exportToExcel}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-alias"
          >
            Export
            {selectedEmployees.length > 0 && ` (${selectedEmployees.length})`}
          </button>
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p className="text-lg">No employees found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredEmployees.length > 0 &&
                      selectedEmployees.length === filteredEmployees.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
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
                  Skills
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Onboarded
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Location
                </th>
              

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee._id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee._id)}
                      onChange={() => handleSelect(employee._id)}
                    />
                  </td>
                  {/* Employee */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={employee?.onboarding?.profileImage}
                        alt={employee.name}
                        className="h-11 w-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold"
                      />

                      <div>
                        <p className="font-semibold whitespace-nowrap text-gray-900">
                          {employee.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {employee?.onboarding?.preferredRoles[0]}
                        </p>
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
                    {employee?.onboarding?.skills?.length > 0 ? (
                      <div className="flex items-center gap-2">
                        {/* First Skill */}
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                          {employee.onboarding.skills[0]}
                        </span>

                        {/* Remaining Count */}
                        {employee.onboarding.skills.length > 1 && (
                          <div className="relative group">
                            <span className="cursor-pointer inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                              +{employee.onboarding.skills.length - 1}
                            </span>

                            {/* Tooltip */}
                            <div className="absolute left-0 top-8 z-20 hidden min-w-[180px] rounded-lg border border-gray-200 bg-white p-3 shadow-lg group-hover:block">
                              <div className="flex flex-wrap gap-2">
                                {employee.onboarding.skills
                                  .slice(1)
                                  .map((skill, index) => (
                                    <span
                                      key={index}
                                      className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No skills listed</p>
                    )}
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(
                      employee?.onboarding?.createdAt,
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {
                      employee?.onboarding?.location}
                  </td>

                 

                  {/* Actions */}
                  <td className="px-6 py-4 text-center flex items-center gap-2">
                    <button
                      onClick={() => handleView(employee)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      title="View Employee"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleResume(employee?.onboarding?.resume)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
                      title="View Resume"
                    >
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <EmployeeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default EmployeesList;
