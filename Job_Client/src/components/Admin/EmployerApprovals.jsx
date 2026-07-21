import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PendingEmployers from "./PendingEmployers.jsx";
import ApprovedEmployers from "./ApprovedEmployers.jsx";
import RejectEmployerModal from "./RejectEmployerModal.jsx";

const EmployerApprovals = () => {
  const [pendingEmployers, setPendingEmployers] = useState([]);
  const [approvedEmployers, setApprovedEmployers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

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

      if (!res.ok) throw new Error();

      const data = await res.json();

      setPendingEmployers(data.employers || []);
    } catch (err) {
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

      if (!res.ok) throw new Error();

      const data = await res.json();

      setApprovedEmployers(data.employers || []);
    } catch (err) {
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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employerId }),
        },
      );

      if (!res.ok) throw new Error();

      toast.success("Employer approved successfully");

      fetchPendingEmployers();
      fetchApprovedEmployers();
    } catch (err) {
      toast.error("Failed to approve employer");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter rejection reason");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/reject-employer`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employerId: selectedEmployer._id,
            reason: rejectionReason,
          }),
        },
      );

      if (!res.ok) throw new Error();

      toast.success("Employer rejected");

      setSelectedEmployer(null);
      setRejectionReason("");

      fetchPendingEmployers();
      fetchApprovedEmployers();
    } catch (err) {
      toast.error("Failed to reject employer");
    } finally {
      setLoading(false);
    }
  };
  const revokeEmployer = async (employerId) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/revoke-employer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employerId,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success(data.message);

      fetchPendingEmployers();
      fetchApprovedEmployers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2 rounded-lg font-medium cursor-pointer transition ${
              activeTab === "pending"
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300"
            }`}
          >
            Pending ({pendingEmployers.length})
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`px-6 py-2 rounded-lg font-medium cursor-pointer transition ${
              activeTab === "approved"
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300"
            }`}
          >
            Approved ({approvedEmployers.length})
          </button>
        </div>

        {/* Pending */}

        {activeTab === "pending" && (
          <PendingEmployers
            employers={pendingEmployers}
            loading={loading}
            onApprove={handleApprove}
            onReject={(employer) => setSelectedEmployer(employer)}
          />
        )}

        {/* Approved */}

        {activeTab === "approved" && (
          <ApprovedEmployers employers={approvedEmployers} loading={loading} onRevoke={revokeEmployer} />
        )}

        {/* Reject Modal */}

        <RejectEmployerModal
          employer={selectedEmployer}
          loading={loading}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onReject={handleReject}
          onClose={() => {
            setSelectedEmployer(null);
            setRejectionReason("");
          }}
        />
      </div>
    </div>
  );
};

export default EmployerApprovals;
