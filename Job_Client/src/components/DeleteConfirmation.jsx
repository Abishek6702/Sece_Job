import React from "react";
import close_icon from "../assets/close.svg";

const DeleteConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 joblist_model_bg bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow w-[90%] max-w-md">
        <div className="flex justify-between items-center p-2 px-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">Delete Confirmation</h2>
          <button onClick={onCancel} className="p-2 rounded-full bg-gray-300">
            <img src={close_icon} alt="Close" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-lg font-semibold text-gray-500">
            Are you sure you want to delete this?
          </p>
        </div>

        <div className="flex justify-around w-[90%] m-auto gap-4 mb-4">
          <button
            onClick={onConfirm}
            className="bg-[#2EB67D] text-white font-bold py-2 px-8 rounded-lg w-[50%]"
          >
            <p className="text-md"> Yes</p>
          </button>
          <button
            onClick={onCancel}
            className="border-2 text-[#F94144] font-bold py-3 px-8 rounded-lg w-[50%]"
          >
            <p className="text-md"> NO</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
