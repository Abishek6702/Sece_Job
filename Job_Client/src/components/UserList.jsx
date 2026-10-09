import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMessageContext } from "../context/MessageContext";
import { Search, MoreHorizontal, MessageCircle, Bookmark } from "lucide-react";
import Loader from "./Loader";
import nodata from "../assets/cuate.svg";

const UserList = ({
  users: initialUsers,
  loading,
  onUserSelect,
  isMobile,
  selectedTab,
  setSelectedTab,
  unreadConnectionsCount,
  unreadEmployersCount,
}) => {
  const {
    unreadCounts,
    typingUsers,
    joinUserRoom,
    socket,
    unreadLoading,
    onlineUsers,
  } = useMessageContext();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(initialUsers);
  const location = useLocation();
  const activeUserId = location.pathname.split("/").pop();

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) joinUserRoom(userId);
  }, [joinUserRoom]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (message) => {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === message.sender
            ? {
                ...user,
                lastMessage: message.content,
                lastMessageTime: message.createdAt,
              }
            : user,
        ),
      );
    };
    socket.on("new-message", handleNewMessage);
    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket]);



  const formatMessageTime = (timestamp) => {
    if (!timestamp) return null;
    const now = new Date();
    const msgDate = new Date(timestamp);

    const isToday = msgDate.toDateString() === now.toDateString();
    if (isToday) {
      return msgDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    const diffTime = now - msgDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return `${diffDays}d`;

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) return `${diffWeeks}w`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}m`;

    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears}y`;
  };

  const filteredAndSortedUsers = users
    .filter((user) => {
      const name =
        user.onboarding?.firstName && user.onboarding?.lastName
          ? `${user.onboarding.firstName} ${user.onboarding.lastName}`
          : user.name || "User";
      return name.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (a.lastMessageTime && b.lastMessageTime) {
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      }
      if (a.lastMessageTime) return -1;
      if (b.lastMessageTime) return 1;
      return 0;
    });


  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full mt-10">
      <img src={nodata} alt="No chats" className="w-48 h-48 opacity-80" />
      <p className="text-gray-500 font-medium mt-4">No chats available!</p>
    </div>
  );

  return (
    <div
      className={`bg-white rounded-xl  p-0 flex flex-col h-full ${
        isMobile ? "w-full" : "w-[35%]"
      }`}
    >
      <div className="px-4 mb-2">
        <div className="flex bg-[#F4F4F5] p-1.5 rounded-xl gap-1.5">
          <button
            onClick={() => setSelectedTab?.("Connections")}
            className={`flex-1 flex justify-center items-center gap-1.5 py-2 rounded-lg transition font-semibold text-sm ${
              selectedTab === "Connections"
                ? "bg-white text-[#4361EE] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            CHATS
            {unreadConnectionsCount > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  selectedTab === "Connections"
                    ? "bg-[#4361EE26]"
                    : "bg-gray-200"
                }`}
              >
                {unreadConnectionsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setSelectedTab?.("Employers")}
            className={`flex-1 flex justify-center items-center gap-1.5 py-2 rounded-lg transition font-semibold text-sm ${
              selectedTab === "Employers"
                ? "bg-white text-[#4361EE] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            Organisation
            {unreadEmployersCount > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                  selectedTab === "Employers" ? "bg-[#4361EE26]" : "bg-gray-200"
                }`}
              >
                {unreadEmployersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="relative pb-3 px-4">
        <Search className="absolute left-8 top-2.5 text-slate-400 w-5 h-5 pointer-events-none" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-11 p-2.5 rounded-xl bg-[#F4F4F5] border-none outline-none text-sm text-gray-700 font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="flex-1 overflow-y-auto custom-scroll">
        {(loading || unreadLoading) ? (
          <div className="flex justify-center items-center flex-col h-full min-h-[200px]">
            <Loader />
            <p className="mt-4 text-gray-500 font-medium">Loading Chats...</p>
          </div>
        ) : users.length === 0 && !search ? (
          renderEmptyState()
        ) : filteredAndSortedUsers.map((user) => {
              const profileImg =
                user.role === "employer" && user.companyLogo
                  ? `${user.companyLogo}`
                  : user.onboarding?.profileImage
                    ? `${user.onboarding.profileImage}`
                    : "/default-avatar.png";

              const name =
                user.onboarding?.firstName && user.onboarding?.lastName
                  ? `${user.onboarding.firstName} ${user.onboarding.lastName}`
                  : user.name || "User";
              const unreadCount = unreadCounts[user._id] || 0;
              const isTyping = typingUsers[user._id];
              const lastMessageTime = user.lastMessageTime
                ? formatMessageTime(user.lastMessageTime)
                : null;
              const isActive = activeUserId === user._id;
              return (
                <li key={user._id} className="mb-2 mx-4">
                  {isMobile ? (
                    <button
                      onClick={() => onUserSelect(user._id)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition relative ${
                        isActive ? "bg-[#EEF2FF]" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={profileImg}
                          alt={name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {onlineUsers?.has(user._id?.toString()) && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 shrink-0 border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 truncate flex items-center gap-1.5">
                            {name}
                          </span>
                          {unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {isTyping ? (
                            <span className="text-blue-500 italic">
                              typing...
                            </span>
                          ) : user.lastMessage ? (
                            <div className="flex justify-between gap-2">
                              <span className="truncate">
                                {user.lastMessage}
                              </span>
                              {lastMessageTime && (
                                <span className="whitespace-nowrap">
                                  {lastMessageTime}
                                </span>
                              )}
                            </div>
                          ) : (
                            "Start a conversation"
                          )}
                        </div>
                      </div>
                    </button>
                  ) : (
                    <Link
                      to={`/messages/${user._id}`}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition relative ${
                        isActive ? "bg-[#4361EE26]" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={profileImg}
                          alt={name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {onlineUsers?.has(user._id?.toString()) && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 shrink-0 border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 truncate flex items-center gap-1.5">
                            {name}
                          </span>
                          {unreadCount > 0 && (
                            <span className="bg-[#4F46E5] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {isTyping ? (
                            <span className="text-blue-500 italic">
                              typing...
                            </span>
                          ) : user.lastMessage ? (
                            <div className="flex justify-between gap-2">
                              <span className="truncate">
                                {user.lastMessage}
                              </span>
                              {lastMessageTime && (
                                <span className="whitespace-nowrap">
                                  {lastMessageTime}
                                </span>
                              )}
                            </div>
                          ) : (
                            "Start a conversation"
                          )}
                        </div>
                      </div>
                    </Link>
                  )}
                </li>
              );
            })}
      </ul>
    </div>
  );
};

export default UserList;
