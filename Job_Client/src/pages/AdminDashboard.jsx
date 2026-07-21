import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/Admin/AdminSidebar";
import EmployerApprovals from "../components/Admin/EmployerApprovals";

import EmployeesList from "../components/Admin/EmployeesList";
import DashboardOverview from "../components/Admin/DashboardOverview";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen bg-[#fafafa]">
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="px-8 py-2">
            <h1 className="text-[24px] font-bold text-gray-600">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "employee" && "Employees Management"}
              {activeTab === "employers" && "Employers Approvals"}
            </h1>
            <p className="text-gray-500 text-[18px]">
              Manage your platform efficiently
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* Dashboard Overview */}
          {activeTab === "dashboard" && (
            <DashboardOverview setActiveTab={setActiveTab} />
          )}

          {/* Employees List */}
          {activeTab === "employee" && <EmployeesList />}

          {/* Employers Approvals */}
          {activeTab === "employers" && <EmployerApprovals />}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
