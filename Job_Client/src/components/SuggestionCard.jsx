import React from "react";

function SuggestionCard({ logo, title, category, followers, connections, onFollow }) {
  return (

    
    <div className="bg-white border-t border-gray-300  p-2 mb-2 w-full max-w-sm ">

      
      <div className="flex items-center mb-3">
        <img src={logo} alt={title} className="w-12 h-12 rounded-md mr-3" />
        <div>
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-xs text-gray-500">{category}</div>
          <div className="text-xs text-gray-400">{followers.toLocaleString()} followers</div>
        </div>
      </div>
      <div className="flex items-center mb-3">
        {connections.map((conn, idx) => (
          <img
            key={idx}
            src={conn.avatar}
            alt={conn.name}
            className={`w-6 h-6 rounded-full border-2 border-white ${idx !== 0 ? "-ml-2" : ""}`}
          />
        ))}
        <span className="ml-2 text-xs text-gray-600">{connections.length} connections follow this page</span>
      </div>
     <button className="flex items-center px-4 border border-gray-400 rounded-full text-gray-700 text-sm font-medium hover:bg-gray-100 m-[1px]">
  <span className="mr-1 text-lg">+</span> Follow
</button>

    </div>
  );
}

export default SuggestionCard;