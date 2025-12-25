import React from "react";
import { User, Info, Settings, Lock, Eye, Database } from "lucide-react";

const icons = [
  <User size={18} />,
  <Info size={18} />,
  <Settings size={18} />,
  <Lock size={18} />,
  <Eye size={18} />,
  <Database size={18} />,
];

const Sidebar = ({ items, activeSection, setActiveSection }) => (
  <div className="w-72 bg-white rounded-xl border p-4">
    {items.map((item, idx) => (
      <button
        key={item.label}
        className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg mb-1 font-medium transition ${
          activeSection === idx
            ? "bg-gray-100 text-black"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => setActiveSection(idx)}
      >
        {icons[idx]}
        {item.label}
      </button>
    ))}
  </div>
);

export default Sidebar;
