import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  User,
  MessageCircle,
  MailIcon,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logomain.svg";

const EmployerNavbar = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstTimeLogin, setFirstTimeLogin] = useState(false);
  const [unreadUsersCount, setUnreadUsersCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setEmail(decoded.email || "User");
        setFirstTimeLogin(decoded.firstTimeLogin || false);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/messages/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch unread counts");

        const data = await res.json();

        // Count how many users have unread messages > 0
        const usersWithUnread = Object.values(data).filter(count => count > 0).length;

        setUnreadUsersCount(usersWithUnread);
      } catch (err) {
        console.error("Error fetching unread counts:", err);
      }
    };

    fetchUnreadCounts();

    // Optionally, set up polling or socket subscription to keep counts updated
  }, []);

  const handleProfileClick = () => {
    if (!firstTimeLogin) {
      navigate("/employer-dashboard/employer-profile");
    } else {
      alert("Complete Your Company Profile");
    }
  };

  const handleMessagesClick = () => {
    navigate("/employer-dashboard/employermessages");

  };

  return (
    <nav className="w-full flex justify-between items-center p-4 bg-white drop-shadow-sm">
      <div>
        <img src={logo} alt="Job Portal" className="h-6 md:h-6" />
      </div>

      <div className="flex items-center gap-6 text-gray-600 text-sm md:text-base">
        {/* Messages icon with unread users count */}
        <div className="relative cursor-pointer" onClick={handleMessagesClick} title="Messages">
          <MailIcon size={24} />
          {unreadUsersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
              {unreadUsersCount}
            </span>
          )}
        </div>

        <div
          className="profile_container flex items-center gap-2 cursor-pointer"
          onClick={handleProfileClick}
        >
          <div className="flex items-center border-l pl-4">
            <User size={18} />
            <span className="hidden md:block text-xs md:text-sm truncate max-w-[100px] ml-1">{email}</span>
            <ChevronDown />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EmployerNavbar;
