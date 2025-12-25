import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CircleUser,
  Home,
  Mail,
  Settings,
  Users,
  Menu,
  X,
  MessageCircle,
  MessageSquareText,
  Logs,
} from "lucide-react";
import logo from "../assets/logomain.svg";
import NotificationBell from "./NotificationBell";
import { useMessageContext } from "../context/MessageContext";

const Navbar = ({ socket, currentUserId }) => {
  const { unreadCounts } = useMessageContext();
  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
  const unreadUsersCount = Object.values(unreadCounts).filter(
    (c) => c > 0
  ).length;

  const [showServices, setShowServices] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      let userId;
      try {
        const decoded = jwtDecode(token);
        userId = decoded.id;
      } catch (e) {
        console.error("Invalid token", e);
        return;
      }
      if (!userId) return;
      console.log("hsgus",userId)
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

  const isServiceActive = [
    "/resumes",
    "/score-checker",
    "/interview-prep",
    "/resume-builder",
    "/result"
  ].some((path) => location.pathname.startsWith(path));

  const toggleDropdown = () => setShowServices((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const MenuItems = (
    <>
      <NavLink
        to="/feeds"
        className={({ isActive }) =>
          `flex items-center gap-1 ${
            isActive ? "text-blue-600 font-semibold" : "text-gray-600"
          }`
        }
        onClick={closeMobileMenu}
      >
        <Logs />
        Home
      </NavLink>
       <NavLink
        to="/Network"
        className={({ isActive }) =>
          `flex items-center gap-1 ${
            isActive ? "text-blue-600 font-semibold" : "text-gray-600"
          }`
        }
        onClick={closeMobileMenu}
      >
        <Users />
        Network
      </NavLink>
      <NavLink
        to="/Jobs"
        className={({ isActive }) =>
          `flex items-center gap-1 ${
            isActive ? "text-blue-600 font-semibold" : "text-gray-600"
          }`
        }
        onClick={closeMobileMenu}
      >
        <BriefcaseBusiness />
        Jobs
      </NavLink>
       <NavLink
        to="/companies"
        className={({ isActive }) =>
          `flex items-center gap-1 ${
            isActive ? "text-blue-600 font-semibold" : "text-gray-600"
          }`
        }
        onClick={closeMobileMenu}
      >
        <Building2 />
        Companies
      </NavLink>

     

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-1 cursor-pointer outline-none"
        >
          <Settings
            className={
              isServiceActive ? "text-blue-500 font-semibold" : "text-gray-800"
            }
          />
          <p
            className={
              isServiceActive ? "text-blue-500 font-semibold" : "text-gray-800"
            }
          >
            Services
          </p>
          <svg
            width="16"
            height="16"
            viewBox="0 0 11 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-200 w-3 mt-1 ${
              showServices ? "rotate-180" : ""
            } ${isServiceActive ? "text-blue-500" : "text-gray-700"}`}
          >
            <path
              d="M0.700684 0L5.70068 5L10.7007 0H0.700684Z"
              fill="currentColor"
            />
          </svg>
        </button>
        {showServices && (
          <div className="absolute flex flex-col top-full mt-2 left-0 bg-white rounded-md shadow-lg z-10 min-w-[180px]">
            <Link
              to="/resumes"
              className={`px-4 py-2 hover:bg-gray-100 ${
                location.pathname.startsWith("/resumes")
                  ? "text-blue-500 font-semibold"
                  : ""
              }`}
              onClick={() => {
                setShowServices(false);
                closeMobileMenu();
              }}
            >
              Resumes
            </Link>
            <Link
              to="/score-checker"
              className={`px-4 py-2 hover:bg-gray-100 ${
                location.pathname.startsWith("/score-checker")
                  ? "text-blue-500 font-medium"
                  : ""
              }`}
              onClick={() => {
                setShowServices(false);
                closeMobileMenu();
              }}
            >
              Score Checker
            </Link>
            <Link
              to="/interview-prep"
              className={`px-4 py-2 hover:bg-gray-100 ${
                location.pathname.startsWith("/interview-prep")
                  ? "text-blue-500 font-medium"
                  : ""
              }`}
              onClick={() => {
                setShowServices(false);
                closeMobileMenu();
              }}
            >
              Interview Prep
            </Link>
          </div>
        )}
      </div>
     
      <NavLink
        to="/e-learning"
        className={({ isActive }) =>
          `flex items-center gap-1 ${
            isActive ? "text-blue-600 font-semibold" : "text-gray-600"
          }`
        }
        onClick={closeMobileMenu}
      >
        <BookOpen />
        E-Learning
      </NavLink>
    </>
  );
  return (
    <div className="bg-white sticky top-0 z-40 shadow-sm px-4 sm:px-6 py-3 rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu />
          </button>
          <Link to="/" className="font-bold py-1 rounded-md text-gray-700">
            <img src={logo} className="h-6" alt="Logo" />
          </Link>
        </div>

        <div className="hidden lg:flex gap-6 text-sm font-medium text-gray-600 text-[16px] items-center">
          {MenuItems}
        </div>

        <div className="flex items-center gap-4">
          <NavLink to="/messages" className="relative">
            <MessageSquareText className="cursor-pointer text-gray-600" />
            {unreadUsersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadUsersCount}
              </span>
            )}
          </NavLink>

          <NotificationBell socket={socket} userId={currentUserId} />

          <NavLink to="/profile">
            {profile &&
            profile.onboarding &&
            profile.onboarding.profileImage ? (
              <img
                src={
                  `${profile.onboarding.profileImage}
                  `
                }
                alt="Profile"
                className="w-7 h-7 rounded-full  object-cover "
              />
            ) : (
              <CircleUser className="w-6 h-6 text-gray-400" />
            )}
          </NavLink>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 tint flex">
          <div className="bg-white w-64 h-full p-6 flex flex-col gap-6 shadow-lg relative">
            <button
              className="absolute top-4 right-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
            <div className="flex flex-col gap-4 mt-8">{MenuItems}</div>
          </div>
          <div
            className="flex-1"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
