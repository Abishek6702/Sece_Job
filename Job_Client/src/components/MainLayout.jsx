import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "./Layout/DashboardLayout";
import { Logs, Users, BriefcaseBusiness, Building2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const MainLayout = ({ currentUserId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  const activeTab = location.pathname.split("/")[1] || "employee-dashboard";

  const handleTabChange = (tabId) => {
    if (tabId === "dashboard") {
      navigate("/employee-dashboard");
    } else {
      navigate(`/${tabId}`);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("carvion-key");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.email) setUserName(decoded.email.split("@")[0]);
        else if (decoded.name) setUserName(decoded.name);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const sidebarItems = [
    { id: "feeds", icon: Logs, label: "Feeds" },
    { id: "network", icon: Users, label: "Network" },
    { id: "jobs", icon: BriefcaseBusiness, label: "Jobs" },
    { id: "companies", icon: Building2, label: "Companies" },
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      activeTab={activeTab === "employee-dashboard" ? "dashboard" : activeTab}
      setActiveTab={handleTabChange}
      userName={userName}
      userRole="Employee"
      currentUserId={currentUserId}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default MainLayout;

