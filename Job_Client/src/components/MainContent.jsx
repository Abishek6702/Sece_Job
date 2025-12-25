import React from "react";

const MainContent = ({ activeSection, profile }) => {
  switch (activeSection) {
    case 1: 
      return (
        <div className="flex-1 bg-white rounded-xl border p-8">
          <div className="font-bold text-2xl mb-6">Profile Information</div>
          <div className="flex justify-between items-center border-b py-6">
            <div>
              <div className="font-semibold">Name, Location and Recipe Type</div>
              <div className="text-gray-500 text-sm">
                Choose how your name and profile field appear to other members
              </div>
            </div>
            <button className="text-blue-600 font-medium">Change Settings</button>
          </div>
          <div className="font-bold text-xl mt-8 mb-4">Site Preferences</div>
          <div className="divide-y">
            {[
              "Language",
              "Showing Profile Recipes",
              "People You followed",
              "Change Settings",
              "Account management",
            ].map((label) => (
              <div
                key={label}
                className="flex justify-between items-center py-5"
              >
                <div className="font-medium">{label}</div>
                <button className="text-blue-600 font-medium">
                  Change Settings
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return (
        <div className="flex-1 bg-white rounded-xl border p-8 flex items-center justify-center text-gray-400">
          Section under construction...
        </div>
      );
  }
};

export default MainContent;
