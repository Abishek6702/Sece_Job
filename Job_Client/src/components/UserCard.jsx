import React, { useState, useEffect, useRef } from "react";
import { Plus, Clock, MessageCircle, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserCard = ({
  user,
  currentUserId,
  currentUserData,
  showConnectButton,
  showMenu = false,
  onRemoveConnection,
}) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("connect");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const getInitialStatus = () => {
      if (!currentUserData) return "connect";
      if (currentUserData.connections?.includes(user._id)) return "connected";
      if (currentUserData.sentRequests?.includes(user._id)) return "pending";
      return "connect";
    };
    setStatus(getInitialStatus());
  }, [currentUserData, user._id]);

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

  const name =
    user.onboarding?.firstName && user.onboarding?.lastName
      ? `${user.onboarding.firstName} ${user.onboarding.lastName}`
      : user.name;

  const jobTitle =
    user.onboarding?.preferredRoles?.[0] || user.role || "Employee";

  const bannerUrl = user.onboarding?.banner
    ? `${user.onboarding.banner}`
    : null;

  const profileUrl = user.onboarding?.profileImage
    ? `${user.onboarding.profileImage}`
    : null;

  const handleProfileClick = () => {
    navigate(`/profile/${user._id}`);
  };

  const getInitials = () => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  const handleMessageClick = (e) => {
    e.stopPropagation();
    navigate(`/messages/${user._id}`);
  };

  const handleRemoveConnection = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onRemoveConnection) {
      onRemoveConnection(user._id);
    }
  };

  const handleConnect = async (e) => {
    e.stopPropagation();
    setStatus("pending");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/connections/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: currentUserId,
            receiverId: user._id,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to send connection request");
    } catch (error) {
      setStatus("connect");
      alert("Failed to send connection request");
    }
  };

  return (
    <div
      className=" bg-white rounded-xl p-0 flex flex-col items-center relative max-w-xs min-w-[220px] mx-auto overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      onClick={handleProfileClick}
    >
      <div className="w-full h-24 rounded-t-xl overflow-hidden bg-gradient-to-r from-blue-400 to-blue-600 relative">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt="Cover"
            className="w-full h-full object-fit"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-400 ">
            No banner image
          </div>
        )}

        {showMenu && (
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
              <div className="absolute right-10 -top-2 mt-2 w-45 bg-white border border-gray-200 rounded-md shadow-lg z-50 ">
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

      <div className="absolute top-14 left-1/2 transform -translate-x-1/2">
        {profileUrl ? (
          <img
            src={profileUrl}
            alt={name}
            className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover bg-white"
          />
        ) : (
          <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg bg-gray-800 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {getInitials()}
            </span>
          </div>
        )}
      </div>

      <div className="pt-8 pb-4 px-4 text-center w-full">
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{name}</h3>
          <p className="truncate max-w-[180px] mx-auto text-sm text-gray-600">
            {jobTitle}
          </p>
        </div>

        <div className="w-full">
          {showConnectButton && status === "connect" && (
            <button
              onClick={handleConnect}
              className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center gap-2 font-medium hover:bg-blue-100 transition border border-blue-200"
            >
              <Plus size={16} />
              Connect
            </button>
          )}

          {status === "pending" && (
            <button
              disabled
              className="w-full px-4 py-2 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center gap-2 font-medium border border-yellow-200"
            >
              <Clock size={16} />
              Pending
            </button>
          )}
          {status === "connected" && (
            <button
              onClick={handleMessageClick}
              className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center gap-2 font-medium border border-blue-200 hover:bg-blue-100 transition"
            >
              <MessageCircle size={16} />
              Message
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
