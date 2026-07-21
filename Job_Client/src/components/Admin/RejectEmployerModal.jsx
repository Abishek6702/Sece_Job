import React from "react";
import { Loader2, X, AlertTriangle } from "lucide-react";

const RejectEmployerModal = ({
  employer,
  rejectionReason,
  setRejectionReason,
  loading,
  onReject,
  onClose,
}) => {
  if (!employer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex p-2 items-center justify-center rounded-xl bg-red-100">
              <AlertTriangle size={24} className="text-red-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Reject Employer
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                This action cannot be undone. Please provide a reason before
                rejecting the employer.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 cursor-pointer transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          {/* Employer Card */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-lg font-semibold text-white">
                {employer.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">{employer.name}</h3>

                <p className="text-sm text-gray-500">{employer.email}</p>

                <p className="text-sm text-gray-500">{employer.phone}</p>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Rejection Reason
            </label>

            <textarea
              rows={5}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejecting this employer..."
              className="w-full resize-none rounded-xl border border-gray-300 p-4 text-sm outline-none transition focus:border-red-500 "
            />

            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>This message may be shared with the employer.</span>

              <span>{rejectionReason.length} characters</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={loading || !rejectionReason.trim()}
            onClick={onReject}
            className="flex min-w-[170px] items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}

            {loading ? "Rejecting..." : "Reject Employer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectEmployerModal;
