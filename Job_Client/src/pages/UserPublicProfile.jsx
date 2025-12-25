import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ProfileSidebarTabs from "./ProfileSidebarTabs";
import AboutTab from "../components/tabs/AboutTab";
import EducationTab from "../components/tabs/EducationTab";
import ExperienceTab from "../components/tabs/ExperienceTab";
import SkillsTab from "../components/tabs/SkillsTab";
import ResumeTab from "../components/tabs/ResumeTab";
import { UserPlus, MessageCircle, Check, MoreVertical } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import MyPostsTab from "../components/tabs/MyPostsTab";
import Loader from "../components/Loader";

const TABS = ["About", "Education", "Experience", "Skills", "Posts"];

const UserPublicProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("About");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connect");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const token = localStorage.getItem("token");

  // Responsive flag
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Get logged-in user ID from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id || decoded._id || decoded.userId);
      } catch (error) {
        setCurrentUserId(null);
      }
    }
  }, []);

  // Fetch profile
  useEffect(() => {
    if (!userId) return;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  // Fetch connection status
  useEffect(() => {
    if (!currentUserId || !userId || currentUserId === userId) return;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/${currentUserId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.connections?.includes(userId))
          setConnectionStatus("connected");
        else if (data.sentRequests?.includes(userId))
          setConnectionStatus("pending");
        else setConnectionStatus("connect");
      });
  }, [currentUserId, userId]);

  const handleConnect = async () => {
    setConnectionStatus("pending");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/connections/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: currentUserId,
            receiverId: userId,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to send connection request");
    } catch (error) {
      setConnectionStatus("connect");
      alert("Failed to send connection request");
    }
  };

  const handleRemoveConnection = async () => {
    setMenuOpen(false);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/connections/unconnect`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId1: currentUserId,
            userId2: userId,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to remove connection");
      setConnectionStatus("connect");
    } catch (error) {
      alert("Failed to remove connection");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center text-gray-500 py-20 w-full h-full">
        <Loader />
        <p className="mt-4">Loading Profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-gray-500 py-20">Profile not found</div>
    );
  }

  const onboarding = profile.onboarding || {};
  const fullName = onboarding.firstName
    ? `${onboarding.firstName} ${onboarding.lastName}`
    : profile.name;

  const renderTabContent = () => {
    switch (activeTab) {
      case "About":
        return <AboutTab profile={profile} />;
      case "Education":
        return <EducationTab education={onboarding.education || []} />;
      case "Experience":
        return <ExperienceTab experience={onboarding.experience || []} />;
      case "Skills":
        return <SkillsTab onboarding={profile.onboarding} />;
      case "Posts":
        return <MyPostsTab userId={userId} token={token} profile={profile} />;
      default:
        return null;
    }
  };

  const showActions = currentUserId && currentUserId !== userId;

  // Responsive layout wrapper
  return (
    <div className="main_container bg-[#f8fafc] min-h-[100vh]">
      <div className="w-full sm:w-[95%] md:w-[80%] min-h-[90vh] m-auto mb-20 bg-white rounded-2xl mt-6 overflow-hidden border border-gray-300 shadow-md">
        {/* Banner */}
        <div className="relative h-40 bg-gray-100 rounded-t-2xl overflow-hidden">
          {onboarding.banner ? (
            <img
              src={`${onboarding.banner}`}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No banner image</span>
            </div>
          )}
          {showActions && connectionStatus === "connected" && (
            <div className="absolute top-2 right-2 z-30" ref={menuRef}>
              <button
                type="button"
                className="p-2 rounded-full bg-white border border-gray-200 shadow"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((open) => !open);
                }}
              >
                <MoreVertical className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-45 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <button
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    onClick={handleRemoveConnection}
                  >
                    Remove Connection
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Profile Info Row */}
        <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 pt-4 pb-6 gap-3 md:gap-0">
          {/* Left: profile pic + info */}
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative">
              <img
                src={
                  onboarding.profileImage
                    ? `${
                        onboarding.profileImage
                      }`
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="w-24 md:w-28 h-24 md:h-28 rounded-full border-4 border-white object-cover shadow -mt-12 md:-mt-14"
              />
            </div>
            <div className="ml-0 md:ml-4 mt-3 md:mt-0 text-center md:text-left">
              <p className="font-semibold text-lg md:text-xl">{fullName}</p>
              <p className="text-gray-500 mt-1">
                {onboarding.preferredRoles?.[0] || "Professional"}
              </p>
              <span className="text-blue-500 font-bold hover:underline cursor-default">
                {profile.connections.length} Connections
              </span>
            </div>
          </div>
          {/* Right: actions */}
          {showActions && (
            <div className="flex gap-2 mt-4 md:mt-0">
              {connectionStatus === "connect" && (
                <button
                  onClick={handleConnect}
                  className="bg-blue-600 text-white px-5 py-1.5 rounded-full font-medium flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <UserPlus size={18} />
                  Connect
                </button>
              )}
              {connectionStatus === "pending" && (
                <button
                  disabled
                  className="bg-yellow-100 text-yellow-700 px-5 py-1.5 rounded-full font-medium flex items-center gap-2"
                >
                  <Check size={18} /> Pending
                </button>
              )}
              {connectionStatus === "connected" && (
                <button className="border border-blue-600 text-blue-600 px-5 py-1.5 rounded-full font-medium flex items-center gap-2 hover:bg-blue-50 transition">
                  <MessageCircle size={18} />
                  Message
                </button>
              )}
            </div>
          )}
        </div>

        {/* --- Responsive Tabs & Content --- */}
        <div className="w-full px-0 sm:px-2 md:px-6 py-0 md:py-2">
          <div className="block md:flex md:gap-6 w-full">
            {/* Sidebar tabs */}
            <div className="w-full md:w-64 sticky top-2 z-20">
              {/* Horizontal (mobile) */}
              <div className="block md:hidden border-b">
                <ProfileSidebarTabs
                  activeMain="account"
                  setActiveMain={() => {}}
                  activeSub={activeTab}
                  setActiveSub={setActiveTab}
                  isOwnProfile={false}
                  tabs={TABS}
                  showOnlyMainTabs={true}
                  orientation="horizontal"
                />
              </div>
              {/* Vertical (desktop) */}
              <div className="hidden md:block">
                <ProfileSidebarTabs
                  activeMain="account"
                  setActiveMain={() => {}}
                  activeSub={activeTab}
                  setActiveSub={setActiveTab}
                  isOwnProfile={false}
                  tabs={TABS}
                  showOnlyMainTabs={true}
                  orientation="vertical"
                />
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 w-full bg-gray-50 rounded-2xl min-h-[300px] p-2 sm:p-4 md:p-6 shadow-inner">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPublicProfile;
