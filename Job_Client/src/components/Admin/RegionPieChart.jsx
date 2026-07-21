import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Employees", value: 320 },
  { name: "Approved Employers", value: 145 },
  { name: "Pending Employers", value: 25 },
];

const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

const RegionPieChart = () => {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-700">Platform Overview</h2>
        <p className="text-sm text-gray-500">
          Distribution of users and employers
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
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
            <Legend verticalAlign="bottom" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RegionPieChart;