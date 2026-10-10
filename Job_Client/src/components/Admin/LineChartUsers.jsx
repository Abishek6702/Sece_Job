import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { city: "Chennai", applications: 165 },
  { city: "Coimbatore", applications: 132 },
  { city: "Bangalore", applications: 118 },
  { city: "Hyderabad", applications: 95 },
  { city: "Madurai", applications: 74 },
  { city: "Salem", applications: 58 },
];

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
];

const BarChartCities = () => {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-700">
          Applications by City
        </h2>
        <p className="text-sm text-gray-500">
          Top 6 cities by application count
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="city" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="applications"
              radius={[8, 8, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartCities;