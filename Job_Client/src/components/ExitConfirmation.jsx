import React from "react";
import close_icon from "../assets/close.svg";

const ExitConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div className=" joblist_model_bg fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow w-[90%] max-w-md">
        <div className="flex justify-between items-center p-2 px-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">Exit Confirmation</h2>
          <button
            onClick={onCancel}
            className="p-[8px] rounded-full bg-gray-300 cursor-pointer"
          >
            <img src={close_icon} alt="Close" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-lg font-semibold text-gray-500">
            Are you sure you want to go back? Unsaved changes may be lost.
          </p>
        </div>

        <div className="flex justify-around w-[90%] m-auto gap-4 mb-4">
          <button
            onClick={onConfirm}
            className="bg-blue-600 text-white text-md font-bold py-2 px-8 rounded-lg w-[50%] cursor-pointer"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="border-2 text-[#F94144] text-md font-bold py-3 px-8 rounded-lg w-[50%] cursor-pointer"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmation;
