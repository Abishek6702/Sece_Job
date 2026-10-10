import React from "react";
import { User, Power, BookMarked, FileCheck } from "lucide-react";

const accountTabs = [
  "Personal Information",
  "Education",
  "Experience",
  "Resumes",
];

const Profile_Design_Tabs = ({
  activeMain,
  setActiveMain,
  activeSub,
  setActiveSub,
}) => {
  return (
    <div className="w-full h-fit sm:max-w-[260px] bg-white rounded-2xl shadow p-0 overflow-hidden">
      <button
        className={`flex items-center w-full px-6 pt-6 pb-4 text-gray-700 font-semibold text-lg focus:outline-none transition
          ${activeMain === "account" ? "bg-gray-50" : ""}
        `}
        onClick={() => setActiveMain("account")}
      >
        <User className="w-6 h-6 mr-3" />
        Account Preferences
      </button>
      {activeMain === "account" && (
        <ul className="mb-2">
          {accountTabs.map((tab) => (
            <li
              key={tab}
              className={`flex items-center cursor-pointer h-11 pl-12 pr-2 rounded transition text-base
                ${
                  activeSub === tab
                    ? "bg-gray-100 font-semibold text-gray-900"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              onClick={() => setActiveSub(tab)}
            >
              <div
                className={`w-1 h-6 mr-3 rounded ${
                  activeSub === tab ? "bg-green-500" : ""
                }`}
              />
              <span>{tab}</span>
            </li>
          ))}
        </ul>
      )}
      <hr className="my-2 mx-6 border-gray-200" />
      <ul>
        <li
          className={`flex items-center h-12 px-6 text-gray-700 font-semibold text-lg cursor-pointer hover:bg-gray-50 transition
            ${activeMain === "saved" ? "bg-gray-100" : ""}
          `}
          onClick={() => setActiveMain("saved")}
        >
          <BookMarked className="w-5 h-5 mr-3" />
          Saved Jobs
        </li>
        <hr className="my-2 mx-6 border-gray-200" />
        <li
          className={`flex items-center h-12 px-6 text-gray-700 font-semibold text-lg cursor-pointer hover:bg-gray-50 transition
            ${activeMain === "applied" ? "bg-gray-100" : ""}
          `}
          onClick={() => setActiveMain("applied")}
        >
          <FileCheck className="w-5 h-5 mr-3" />
          Applied Jobs
        </li>
        <hr className="my-2 mx-6 border-gray-200" />
        <li
          className={`flex items-center h-12 px-6 text-gray-700 font-semibold text-lg cursor-pointer hover:bg-gray-50 transition
            ${activeMain === "logout" ? "bg-gray-100" : ""}
          `}
          onClick={() => setActiveMain("logout")}
        >
          <Power className="w-5 h-5 mr-3" />
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Profile_Design_Tabs;
