import React, { useState } from "react";

const statusColor = (status) => {
  if (status === "in progress") return "bg-yellow-100 text-orange-600";
  if (status === "rejected") return "bg-red-100 text-red-600";
  if (status === "pending") return "bg-yellow-100 text-orange-600";
  if (status === "selected") return "bg-green-100 text-green-600";
  if (status === "not selected") return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-600";
};

export default function ApplicationStatusChange({
  application,
  applicationIds,
  onClose,
  onStatusUpdated,
  isBulk = false,
}) {
  const [selectedStatus, setSelectedStatus] = useState(
    isBulk ? "" : application?.status || ""
  );
  const [notes, setNotes] = useState(isBulk ? "" : application?.notes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!selectedStatus) {
      setError("Please select a status");
      return;
    }
    if (!isBulk && selectedStatus === application.status && notes === (application.notes || "")) {
      onClose();
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let res;
      const body = isBulk
        ? JSON.stringify({
            ids: applicationIds,
            status: selectedStatus,
            notes: notes, 
          })
        : JSON.stringify({
            status: selectedStatus,
            notes: notes, 
          });

      if (isBulk) {
        res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/applications/bulk/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body,
        });
      } else {
        res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/applications/${application._id}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body,
          }
        );
      }
      if (!res.ok) throw new Error("Failed to update status");

      if (!isBulk && selectedStatus === "rejected") {
        alert(
          "Status updated successfully! The application will be removed within 1 day."
        );
      } else {
        alert("Status updated successfully!");
      }

      if (onStatusUpdated) {
        onStatusUpdated();
      }
      onClose();
    } catch (err) {
      setError("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isBulk && !application) return null;
  if (isBulk && (!applicationIds || applicationIds.length === 0)) return null;

  return (
    <div className="fixed inset-0 tint flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative border border-gray-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-2xl font-bold"
          aria-label="Close modal"
          disabled={loading}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          {isBulk
            ? `Change Status for ${applicationIds.length} Selected Applications`
            : "Change Status"}
        </h2>
        <hr className="mb-4 text-gray-300" />
        {!isBulk && (
          <div className="mb-4 flex items-center gap-2">
            <span className="font-medium">Current Status :</span>
            <span
              className={`px-3 py-1 rounded-md text-base ${statusColor(
                application.status
              )} capitalize`}
            >
              {application.status}
            </span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 font-medium">Select new status:</div>
          <div className="flex flex-col gap-2 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="in progress"
                checked={selectedStatus === "in progress"}
                onChange={() => setSelectedStatus("in progress")}
                className="accent-blue-600"
                disabled={loading}
              />
              In Progress
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="rejected"
                checked={selectedStatus === "rejected"}
                onChange={() => setSelectedStatus("rejected")}
                className="accent-blue-600"
                disabled={loading}
              />
              Rejected
            </label>
            <div className="notes_container">
              <p>Notes</p>
              <div className="border border-gray-500 rounded-lg mt-1.5">
                <textarea
                  type="text"
                  name="notes"
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full outline-none rounded-lg px-2 py-1 max-h-[150px] min-h-[40px]"
                  disabled={loading}
                  placeholder="Add notes (optional)"
                />
              </div>
            </div>
          </div>
          {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg text-lg font-medium bg-white  text-black"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg text-lg font-medium ${
                loading
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white "
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
