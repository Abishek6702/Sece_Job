import React from "react";
import { AlertTriangle, Loader2, RotateCcw, X } from "lucide-react";

const RevokeApprovalModal = ({
    isOpen,
  employer,
  loading,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !employer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
              <AlertTriangle
                size={24}
                className="text-amber-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Revoke Approval
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                This employer will lose access to the employer portal.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-lg font-semibold text-white">
                {employer.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  {employer.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {employer.email}
                </p>

                <p className="text-sm text-gray-500">
                  {employer.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              <strong>What happens next?</strong>
            </p>

            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-700">
              <li>The employer account will be marked as pending.</li>
              <li>Portal access will be revoked immediately.</li>
              <li>The employer will appear in the Pending Employers list.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className="flex min-w-[170px] items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 font-medium text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {loading && (
              <Loader2
                size={18}
                className="animate-spin"
              />
            )}

            {!loading && <RotateCcw size={18} />}

            {loading ? "Revoking..." : "Revoke Approval"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default RevokeApprovalModal;