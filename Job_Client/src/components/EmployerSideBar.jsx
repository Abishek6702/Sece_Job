import React, { useState } from "react";
import {
  PlusCircle,
  Briefcase,
  Users,
  Calendar,
  ChevronRight,
  Menu,
  X,
  Power,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const menuItems = [
  {
    title: "Create Job",
    icon: <PlusCircle size={23} />,
    path: "/job-post",
  },
  {
    title: "Jobs",
    icon: <Briefcase size={23} />,
    path: "/employer-dashboard",
  },
  {
    title: "Candidates",
    icon: <Users size={23} />,
    children: [
      {
        title: "Applied Candidates",
        path: "/employer-dashboard/candidates-application",
      },
      {
        title: "Selected & Not Selected",
        path: "/employer-dashboard/selectednotselected",
      },
    ],
  },
  {
    title: "Interviews",
    icon: <Calendar size={23} />,
    path: "/employer-dashboard/interviews",
  },
];

const EmployerSideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    toast.info("Logout Sucessfully");
  };
  const handleMouseEnter = (title) => {
    setTimeout(() => setHoveredItem(title), 100);
  };
  const handleMouseLeave = () => {
    setTimeout(() => setHoveredItem(null), 100);
  };

  const isMenuActive = (item) => {
    if (item.path && item.path === currentPath) return true;
    if (item.children) {
      return item.children.some((child) => child.path === currentPath);
    }
    return false;
  };

  return (
    <div
      className={`relative min-h-screen bg-gray-900 text-white transition-all duration-300 p-1 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <button
        className="text-sm px-4 py-5 hover:bg-gray-800 w-full text-left flex items-center gap-2"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <Menu /> : <X />}
      </button>

      {menuItems.map((item, index) => (
        <div
          key={index}
          className="relative group"
          onMouseEnter={() => handleMouseEnter(item.title)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`w-full flex items-center justify-between cursor-pointer px-4 py-5 text-md
              hover:bg-white hover:text-gray-700 hover:rounded-lg hover:w-[96%] mx-auto
              ${
                isMenuActive(item)
                  ? "bg-white text-gray-700  font-bold rounded-lg w-[80%]  "
                  : ""
              }
            `}
            onClick={() => {
              if (item.path) navigate(item.path);
            }}
          >
            <div className="flex items-center gap-3 relative  ">
              {item.icon}
              {collapsed && !item.children && (
                <span className="absolute left-full ml-6 px-3 py-1 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
                  {item.title}
                </span>
              )}

              {!collapsed && <span>{item.title}</span>}
            </div>
            {!collapsed && item.children && <ChevronRight size={18} />}
          </button>

          {item.children && hoveredItem === item.title && (
            <div className="absolute top-0 left-full ml-2 bg-gray-900 rounded-md py-2 z-10 whitespace-nowrap">
              {item.children.map((child, childIndex) => (
                <div
                  key={childIndex}
                  onClick={() => child.path && navigate(child.path)}
                  className={`px-4 py-2 text-md cursor-pointer
                    hover:bg-white hover:text-gray-700 hover:rounded-lg hover:w-[90%] hover:mx-auto
                    ${
                      child.path === currentPath
                        ? "bg-white text-gray-700 font-bold rounded-lg w-[90%] mx-auto"
                        : ""
                    }
                  `}
                >
                  {typeof child === "string" ? child : child.title}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="absolute bottom-4 w-full">
        <button
          className="w-full flex items-center justify-between cursor-pointer hover:bg-red-500 hover:m-auto hover:text-white hover:text-md hover:rounded-lg hover:w-[95%] px-4 py-3 text-md"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-3 px-1">
            <Power />
            {!collapsed && <span>Logout</span>}
          </div>
        </button>
      </div>
    </div>
  );
};

export default EmployerSideBar;
