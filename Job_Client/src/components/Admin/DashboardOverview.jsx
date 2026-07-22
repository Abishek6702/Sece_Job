import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Building2,
  ClipboardPen,
} from "lucide-react";
import { toast } from "react-toastify";
import LineChartUsers from "./LineChartUsers.jsx";
import RegionPieChart from "./RegionPieChart.jsx";

const DashboardOverview = ({ setActiveTab }) => {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalEmployers: 0,
    approvedEmployers: 0,
    pendingEmployers: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/adminDashboard/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
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
      icon: ClipboardPen,
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
                    {loading ? "..." : card.value}
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

      {/* Charts */}
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