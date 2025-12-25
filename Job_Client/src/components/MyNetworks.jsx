import React from 'react';
import { Users, UserPlus, Boxes } from 'lucide-react';

const MyNetworks = ({ activeTab, onTabChange, counts }) => {
  const items = [
    { label: 'All', view: 'all', icon: <Users size={24} />, count: counts.all },
    { label: 'Connections', view: 'connections', icon: <UserPlus size={24} />, count: counts.connections },
    { label: 'Groups', view: 'groups', icon: <Boxes size={24} />, count: counts.groups },
  ];

  return (
    <div className="p-4 ">
      <h2 className="text-xl font-bold text-gray-700 mb-3 border-b pb-4 border-gray-300">
        Manage my network
      </h2>
      <ul className="space-y-1 ">
        {items.map((item, index) => (
          <li
            key={index}
            className={`hover:bg-gray-100 rounded-lg flex justify-between items-center text-lg px-2 py-2 cursor-pointer ${
              activeTab === item.view
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-500 font-semibold"
            }`}
            onClick={() => onTabChange(item.view)}
          >
            <div className="flex items-center gap-4">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.count !== null && (
              <span className={activeTab === item.view ? "text-blue-600" : "text-gray-500"}>
                {item.count}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyNetworks;
