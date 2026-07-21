import React, { useEffect, useState } from "react";
import {
  BarChart,
  Users,
  Building2,
  TrendingUp,
  ClipboardPen,
} from "lucide-react";
import LineChartUsers from "./LineChartUsers.jsx";
import RegionPieChart from "./RegionPieChart.jsx";

const DashboardOverview = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmployees: 0,
    totalEmployers: 0,
    approvedEmployers: 0,
    pendingEmployers: 0,
  });

  useEffect(() => {
    // Fetch stats - you can implement actual API calls here
    // For now, using dummy data
    setStats({
      totalUsers: 245,
      totalEmployees: 189,
      totalEmployers: 56,
      approvedEmployers: 45,
      pendingEmployers: 11,
    });
  }, []);

  const statCards = [
    {
      title: "Total Employees",
      value: stats.totalUsers,
      border: "border-blue-500",
      bg: "bg-blue-100",
      text: "text-blue-600",
      icon: Users,
    },
    {
      title: "Total Employers",
      value: stats.totalEmployers,
      border: "border-green-500",
      bg: "bg-green-100",
      text: "text-green-600",
      icon: Building2,
    },
    {
      title: "Pending Employers",
      value: stats.pendingEmployers,
      border: "border-purple-500",
      bg: "bg-purple-100",
      text: "text-purple-600",
      icon: ClipboardPen, // You can replace this with an appropriate icon
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${card.border} hover:shadow-lg transition`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-700 mt-2">
                    {card.value}
                  </p>
                </div>

                <div className={`${card.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${card.text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/5">
          <LineChartUsers />
        </div>

        <div className="lg:w-2/5">
          <RegionPieChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
