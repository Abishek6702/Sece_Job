import { Crown } from "lucide-react";
import React from "react";

const avatars = [
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/33.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/men/46.jpg",
];

export default function ProfileActivity() {
  return (
    <div className="bg-white rounded-xl shadow p-4 w-[95%]">
      <h2 className="font-semibold text-gray-800 text-base mb-3">
        Profile Activity
      </h2>
      <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-start">
        <div className="flex -space-x-2  mb-3">
          {avatars.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt=""
              className="w-8 h-8 rounded-full border-2 border-white"
              style={{ zIndex: avatars.length - idx }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold text-gray-900">+1,158</span>
          <span className="text-xs text-gray-500">Followers</span>
        </div>
        <div className="flex items-center gap-1 mb-2">
          <svg
            className="w-4 h-4 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          <span className="text-xs text-green-600 font-medium">23%</span>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
        <div className="text-xs text-gray-600">
          You gained a substantial amount of followers this month!
        </div>
        <div className=" border-2 cursor-pointer w-full p-1 text-center text-lg font-bold text-blue-500 rounded-xl mt-4 border-blue-300 flex justify-center gap-2 hover:bg-blue-600 hover:border-none hover:text-white">
         <span><Crown/></span>
          <button> Go Premimum</button>
        </div>
      </div>
    </div>
  );
}


