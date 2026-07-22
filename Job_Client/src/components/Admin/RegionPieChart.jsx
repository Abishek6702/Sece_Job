import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "react-toastify";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

const RegionPieChart = () => {
  const token = localStorage.getItem("token");

  const [data, setData] = useState([
    { name: "Employees", value: 0 },
    { name: "Approved Employers", value: 0 },
    { name: "Pending Employers", value: 0 },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPieChart();
  }, []);

  const fetchPieChart = async () => {
    try {
      setLoading(true);

      const { data: response } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/adminDashboard/dashboard/charts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData([
        {
          name: "Employees",
          value: response.pieChart.employees,
        },
        {
          name: "Approved Employers",
          value: response.pieChart.approvedEmployers,
        },
        {
          name: "Pending Employers",
          value: response.pieChart.pendingEmployers,
        },
      ]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load chart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-700">
          Platform Overview
        </h2>

        <p className="text-sm text-gray-500">
          Distribution of users and employers
        </p>
      </div>

      <div className="h-80">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                label
              >
                {data.map((item, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RegionPieChart;