import React, { useState } from "react";
import { User, GraduationCap, Briefcase, FileText, Bookmark, Send } from "lucide-react";

const tabIcons = [
  <User size={18} />,
  <GraduationCap size={18} />,
  <Briefcase size={18} />,
  <FileText size={18} />,
  <Bookmark size={18} />,
  <Send size={18} />,
];

const ProfileTabs = ({ tabs }) => {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex border-b bg-white sticky top-0 z-10">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`flex items-center gap-2 px-4 py-3 transition-all duration-200 font-medium text-md 
              ${i === active
                ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-blue-600"}`
            }
            onClick={() => setActive(i)}
          >
            {tabIcons[i]}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{tabs[active].content}</div>
    </div>
  );
};

export default ProfileTabs;
