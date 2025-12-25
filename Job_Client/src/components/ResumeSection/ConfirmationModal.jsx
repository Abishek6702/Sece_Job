import React from "react";

const ConfirmationModal = ({ isOpen, onCancel, onSave, onDownload }) => {
  if (!isOpen) return null; // hide when closed

  return (
    <div className="fixed inset-0 flex items-center justify-center tint z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
          Confirm Action
        </h2>
        <p className="text-gray-600 text-center">
          Do you want to save or download your resume?
        </p>
        <p className="text-gray-600 mb-6 text-center">Directly Downloading will not be saved for future reference.</p>

        <div className="flex justify-between gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Save & Download
          </button>
          <button
            onClick={onDownload}
            className="hidden px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
