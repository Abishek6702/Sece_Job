import React, { useState } from "react";
import EmployerDrawer from "./EmployerDrawer";
import RevokeApprovalModal from "./RevokeApprovalModal";
import { Download, Eye, FileText, RotateCcw, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ApprovedEmployers = ({ employers, loading, onRevoke }) => {
  const navigate = useNavigate();
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployers, setSelectedEmployers] = useState([]);

  const [revokeModal, setRevokeModal] = useState(false);

  const handleRevokeClick = (employer) => {
    setSelectedEmployer(employer);
    setRevokeModal(true);
  };

  const handleView = (employer) => {
    setSelectedEmployer(employer);
    setDrawerOpen(true);
  };

  const filteredEmployers = employers.filter((employer) => {
    const search = searchTerm.toLowerCase();

    return (
      employer?.company?.company_name?.toLowerCase().includes(search) ||
      employer?.name?.toLowerCase().includes(search) ||
      employer?.email?.toLowerCase().includes(search) ||
      employer?.phone?.toLowerCase().includes(search)
    );
  });

  const handleSelect = (id) => {
    setSelectedEmployers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployers.length === filteredEmployers.length) {
      setSelectedEmployers([]);
    } else {
      setSelectedEmployers(filteredEmployers.map((e) => e._id));
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Pending Employers");

    worksheet.columns = [
      { header: "Company Name", key: "company", width: 30 },
      { header: "Employer Name", key: "name", width: 25 },
      { header: "Company Type", key: "type", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Requested On", key: "requested", width: 18 },
      { header: "Website", key: "website", width: 35 },
    ];

    const data =
      selectedEmployers.length > 0
        ? filteredEmployers.filter((emp) => selectedEmployers.includes(emp._id))
        : filteredEmployers;

    data.forEach((emp) => {
      worksheet.addRow({
        company: emp?.company?.company_name || "",
        name: emp.name,
        type: emp?.company?.company_type || "",
        email: emp.email,
        phone: emp.phone,
        requested: new Date(
          emp.updatedAt || emp.createdAt,
        ).toLocaleDateString(),
        website: emp?.company?.site_url || "",
      });
    });

    // Make website clickable
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const cell = row.getCell(7);

      if (cell.value) {
        cell.value = {
          text: cell.value,
          hyperlink: cell.value,
        };

        cell.font = {
          underline: true,
          color: { argb: "FF0000FF" },
        };
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer]),
      `Approved_Employers_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  if (employers.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-lg">No approved employers found</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by company, employer, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-white border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={exportToExcel}
          className="ml-4 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
        >
          <Download size={18} />
          Export
          {selectedEmployers.length > 0 && ` (${selectedEmployers.length})`}
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-4 text-center">
                <input
                  type="checkbox"
                  checked={
                    filteredEmployers.length > 0 &&
                    selectedEmployers.length === filteredEmployers.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
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
                Requested On
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredEmployers.map((employer) => (
              <tr
                key={employer._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedEmployers.includes(employer._id)}
                    onChange={() => handleSelect(employer._id)}
                  />
                </td>
                {/* Employer */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={employer?.company?.company_logo}
                      alt={employer.name}
                      className=" w-12 rounded-full flex items-center justify-center text-white font-semibold"
                    />

                    <div>
                      <p className="font-semibold text-gray-900">
                        {employer.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {employer?.company?.company_type}
                      </p>
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

                {/* Approved Date */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(
                    employer.updatedAt || employer.createdAt,
                  ).toLocaleDateString()}
                </td>

                {/* View */}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {/* View */}
                    <button
                      onClick={() => handleView(employer)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      title="View Employer"
                    >
                      <Eye size={18} />
                    </button>

                    {/* Revoke Approval */}
                    <button
                      onClick={() => handleRevokeClick(employer)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
                      title="Revoke Approval"
                    >
                      <RotateCcw size={18} />
                    </button>
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
        <RevokeApprovalModal
          isOpen={revokeModal}
          employer={selectedEmployer}
          // loading={loading}
          onClose={() => setRevokeModal(false)}
          onConfirm={() => {
            onRevoke(selectedEmployer._id);
            setRevokeModal(false);
          }}
        />
      </div>
    </>
  );
};

export default ApprovedEmployers;
