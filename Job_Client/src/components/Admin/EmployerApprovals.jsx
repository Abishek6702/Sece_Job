import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Check, X, Loader,Eye,FileText } from "lucide-react";

const EmployerApprovals = () => {
  const [pendingEmployers, setPendingEmployers] = useState([]);
  const [approvedEmployers, setApprovedEmployers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPendingEmployers();
    fetchApprovedEmployers();
  }, []);

  const fetchPendingEmployers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/pending-employers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch pending employers");
      const data = await res.json();
      setPendingEmployers(data.employers || []);
    } catch (error) {
      console.error("Error fetching pending employers:", error);
      toast.error("Failed to load pending employers");
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedEmployers = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/approved-employers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch approved employers");
      const data = await res.json();
      setApprovedEmployers(data.employers || []);
    } catch (error) {
      console.error("Error fetching approved employers:", error);
      toast.error("Failed to load approved employers");
    }
  };

  const handleApprove = async (employerId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/approve-employer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ employerId }),
        },
      );

      if (!res.ok) throw new Error("Failed to approve employer");

      toast.success("Employer approved successfully!");
      fetchPendingEmployers();
      fetchApprovedEmployers();
      setSelectedEmployer(null);
    } catch (error) {
      console.error("Error approving employer:", error);
      toast.error("Failed to approve employer");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (employerId) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/reject-employer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ employerId, reason: rejectionReason }),
        },
      );

      if (!res.ok) throw new Error("Failed to reject employer");

      toast.success("Employer rejected successfully!");
      fetchPendingEmployers();
      fetchApprovedEmployers();
      setSelectedEmployer(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting employer:", error);
      toast.error("Failed to reject employer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Employer Management
        </h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === "pending"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Pending Approvals ({pendingEmployers.length})
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === "approved"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Approved ({approvedEmployers.length})
          </button>
        </div>

        {/* Pending Employers Tab */}
        {activeTab === "pending" && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {loading && pendingEmployers.length === 0 ? (
              <div className="p-8 text-center">
                <Loader className="animate-spin mx-auto mb-4" />
                <p>Loading pending employers...</p>
              </div>
            ) : pendingEmployers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No pending employer approvals
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Applied Date
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
  {pendingEmployers.map((employer) => (
    <tr
      key={employer._id}
      className="hover:bg-blue-50 transition-colors duration-200"
    >
      {/* Employer */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
            {employer.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-semibold text-gray-900">
              {employer.name}
            </p>
            <p className="text-xs text-gray-500">
              Employer
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-600">
        {employer.email}
      </td>

      <td className="px-6 py-4 text-sm text-gray-600">
        {employer.phone}
      </td>

      <td className="px-6 py-4 text-sm text-gray-600">
        {new Date(employer.createdAt).toLocaleDateString()}
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">

          {/* View */}
          <button
            className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition"
            title="View Employer"
            onClick={() => navigate(`/admin/employers/${employer._id}`)}
          >
            <Eye size={18} />
          </button>

          {/* Resume */}
          <button
            className="h-9 w-9 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 flex items-center justify-center transition"
            title="View Company Profile"
            onClick={() => window.open(employer.resume, "_blank")}
          >
            <FileText size={18} />
          </button>

          {/* Approve */}
          <button
            onClick={() => handleApprove(employer._id)}
            disabled={loading}
            className="h-9 w-9 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition disabled:opacity-50"
            title="Approve"
          >
            <Check size={18} />
          </button>

          {/* Reject */}
          <button
            onClick={() => setSelectedEmployer(employer)}
            className="h-9 w-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition"
            title="Reject"
          >
            <X size={18} />
          </button>

        </div>
      </td>
    </tr>
  ))}
</tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Approved Employers Tab */}
        {activeTab === "approved" && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {approvedEmployers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No approved employers yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Approved Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedEmployers.map((employer) => (
                      <tr
                        key={employer._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-3">{employer.name}</td>
                        <td className="px-6 py-3">{employer.email}</td>
                        <td className="px-6 py-3">{employer.phone}</td>
                        <td className="px-6 py-3">
                          {new Date(employer.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Rejection Modal */}
        {selectedEmployer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-2xl font-bold mb-4">Reject Employer</h2>
              <p className="mb-4 text-gray-600">
                Are you sure you want to reject{" "}
                <strong>{selectedEmployer.name}</strong>?
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection"
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:border-red-500"
                rows="4"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedEmployer(null);
                    setRejectionReason("");
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedEmployer._id)}
                  disabled={loading || !rejectionReason.trim()}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition disabled:opacity-50"
                >
                  {loading ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerApprovals;
