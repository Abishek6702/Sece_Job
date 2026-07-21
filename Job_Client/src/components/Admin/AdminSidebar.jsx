import React from "react";
import { LayoutDashboard, Users, Building2, LogOut } from "lucide-react";
import logo from "../../assets/logomain.svg";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: "employee",
    label: "Employees",
    icon: <Users size={20} />,
  },
  {
    id: "employers",
    label: "Employers",
    icon: <Building2 size={20} />,
  },
  
];

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col justify-between h-screen fixed left-0 top-0">
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="h-24 flex items-center justify-center  ">
          <img src={logo} alt="Logo" className="h-16 w-auto" />
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div className="px-4 py-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center cursor-pointer gap-3 px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-100  transition font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
