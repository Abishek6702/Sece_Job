import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import { MessageSquareText, CircleUser } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import logo from "../../assets/logo.svg"
import logoshort from "../../assets/short-logo.svg"
import NotificationBell from "../NotificationBell";
import { useMessageContext } from "../../context/MessageContext";

const TopNavbar = ({ userName, userRole, onMessageClick, currentUserId, socket }) => {
  const { unreadCounts } = useMessageContext();
  const unreadUsersCount = Object.values(unreadCounts).filter((c) => c > 0).length;

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("carvion-key");
      if (!token) return;
      let userId;
      try {
        const decoded = jwtDecode(token);
        userId = decoded.id || decoded.userId;
      } catch (e) {
        console.error("Invalid token", e);
        return;
      }
      if (!userId) return;
      
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="bg-[#f6f6f4] rounded-2xl py-4 px-6 mt-4 mx-4 flex justify-between items-center ">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className='w-30 md:block hidden' ></img>
        <img src={logoshort} alt="Logo" className='w-10 md:hidden block' ></img>
      </div>
      
      <div className="flex items-center gap-4">
          <NavLink to="/messages" className="relative">
            <MessageSquareText className="cursor-pointer text-gray-600 w-6 h-6" />
            {unreadUsersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadUsersCount}
              </span>
            )}
          </NavLink>

          <NotificationBell socket={socket} userId={currentUserId} />

          <NavLink to="/profile" className="ml-2">
            {profile &&
            profile.onboarding &&
            profile.onboarding.profileImage ? (
              <img
                src={
                  `${profile.onboarding.profileImage}
                  `
                }
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md cursor-pointer"
                title={userName}
              />
            ) : (
              <CircleUser className="w-8 h-8 text-gray-400 mt-1 cursor-pointer" title={userName} />
            )}
          </NavLink>
        </div>
    </div>
  );
};

export default TopNavbar;

