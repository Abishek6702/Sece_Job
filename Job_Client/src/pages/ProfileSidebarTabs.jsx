import React from "react";
import { User } from "lucide-react";

const mainTabs = [
  {
    label: "Account",
    value: "account",
    icon: <User className="w-5 h-5 mr-2" />,
  },
  { label: "Saved Jobs", value: "saved" },
  { label: "Applied Jobs", value: "applied" },
  { label: "My Posts", value: "myPosts" },
  { label: "Settings", value: "settings" },
];

const ProfileSidebarTabs = ({
  activeMain,
  setActiveMain,
  activeSub,
  setActiveSub,
  isOwnProfile,
  tabs = [],
  showOnlyMainTabs = false, // add this prop, defaults to false!
  orientation = "vertical",
  subTabContents = [], // horizontal for mobile, vertical for desktop
}) => {
  // ---- PUBLIC PROFILE: Only show subtabs ----
  if (showOnlyMainTabs) {
    // Only display the subtabs (About, Skills...), NO main sidebar tabs!
    // Keep responsive: horizontal for mobile, vertical for desktop
    if (orientation === "horizontal") {
      return (
        <div className="w-full flex flex-row gap-2 overflow-x-auto border-b bg-white">
          {tabs.map((subTab) => (
            <button
              key={subTab}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition
                ${
                  activeSub === subTab
                    ? "bg-green-100 text-green-800"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              onClick={() => setActiveSub(subTab)}
            >
              {subTab}
            </button>
          ))}
        </div>
      );
    } else {
      // vertical
      return (
        <div className="w-full h-fit sm:max-w-[240px] bg-white rounded-2xl shadow p-2">
          <ul>
            {tabs.map((subTab) => (
              <li key={subTab}>
                <button
                  className={`w-full text-left py-2 px-3 my-1 rounded-lg font-semibold text-sm
                    ${
                      activeSub === subTab
                        ? "bg-green-100 text-green-800"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  onClick={() => setActiveSub(subTab)}
                >
                  {subTab}
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }

  // ---- PRIVATE PROFILE: Main tabs + sticky for mobile ----
  return (
    <>
      {/* Mobile/tablet: horizontal main tabbar, sticky on mobile */}
      <div className="block md:hidden w-full">
        {/* Sticky tab bar */}
        <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
          <div className="flex flex-row gap-0 overflow-x-auto w-full">
            {mainTabs.map((tab) => (
              <button
                key={tab.value}
                className={`flex items-center px-4 py-2 font-medium border-b-2 transition whitespace-nowrap
                  ${
                    activeMain === tab.value
                      ? "text-blue-700 border-blue-600 bg-blue-100"
                      : "text-gray-700 border-transparent"
                  }
                `}
                onClick={() => {
                  setActiveMain(tab.value);
                  if (tab.value === "account" && tabs.length)
                    setActiveSub(tabs[0]);
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* Show all account section content below the tabs, if Account is active */}
        {activeMain === "account" && (
          <div className="w-full flex flex-col gap-4 px-2 pb-1 bg-white border-b">
            {subTabContents.map(({ label, content }) => (
              <div key={label}>{content}</div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: vertical sidebar with main and subtabs */}
      <div className="hidden md:block w-full h-fit sm:max-w-[240px] bg-white rounded-2xl shadow p-0 overflow-hidden">
        {/* Main (vertical) */}
        {mainTabs.map((tab) => (
          <div key={tab.value}>
            <button
              className={`flex items-center w-full px-6 py-3 text-left font-medium rounded-none border-l-4 transition
                ${
                  activeMain === tab.value
                    ? "text-blue-700 border-blue-500 bg-blue-50"
                    : "text-gray-700 border-transparent hover:bg-gray-50"
                }`}
              onClick={() => {
                setActiveMain(tab.value);
                if (tab.value === "account" && tabs.length)
                  setActiveSub(tabs[0]);
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
            {/* Subtabs for account (vertical) */}
            {tab.value === "account" && activeMain === "account" && (
              <ul className="pl-10 pr-2 py-2">
                {tabs.map((subTab) => (
                  <li
                    key={subTab}
                    className={`cursor-pointer py-2 text-sm font-semibold 
                      ${
                        activeSub === subTab
                          ? "text-green-800 bg-green-100 rounded pr-2 pl-3"
                          : "text-gray-700 hover:bg-gray-50 rounded pr-2 pl-3"
                      }`}
                    onClick={() => setActiveSub(subTab)}
                  >
                    {subTab}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileSidebarTabs;
