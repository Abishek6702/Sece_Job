import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMessageContext } from "../context/MessageContext";
import { Search } from "lucide-react";
import Loader from "./Loader";
import nodata from "../assets/cuate.svg";

const UserList = ({ users: initialUsers, loading, onUserSelect, isMobile }) => {
  const { unreadCounts, typingUsers, joinUserRoom, socket, unreadLoading } =
    useMessageContext();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(initialUsers);
  const location = useLocation();

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
            : user
        )
      );
    };
    socket.on("new-message", handleNewMessage);
    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket]);

  if (loading || unreadLoading) {
    return (
      <div className=" w-[35%] p-4 text-gray-500 border border-gray-300 rounded-xl">
       <div className="flex justify-center items-center flex-col py-8  h-[60%]">
         <Loader />
         <p className="mt-4">Loading Chats...</p>
       </div>
      </div>
    );
  }

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return null;
    const now = new Date();
    const msgDate = new Date(timestamp);
    const isToday = msgDate.toDateString() === now.toDateString();
    if (isToday) {
      return msgDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
    }
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
    if (loading || unreadLoading) {
      return (
        <div className="w-[35%] p-4 text-gray-500 border border-gray-300 rounded-xl">
          <div className="flex justify-center items-center flex-col py-8 h-[60%]">
            <Loader />
            <p className="mt-4">Loading Chats...</p>
          </div>
        </div>
      );
    }
    
    if (!loading && users.length === 0) {
      return (
        <div
          className={`bg-white rounded-xl border border-gray-300 p-4 text-center text-gray-500 ${
            isMobile ? "w-full" : "w-[35%]"
          }`}
        >
        <div className="text-center py-8">
        <img src={nodata} className="w-60 m-auto" />
        No chats available!
      </div>
        </div>
      );
    }
    

  return (
    <div
      className={`bg-white rounded-xl border border-gray-300 p-0 ${
        isMobile ? "w-full" : "w-[35%]"
      }`}
    >
      <div className="relative p-4">
        <Search className="absolute left-6 top-6 text-gray-400 w-6 h-6 pointer-events-none" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 p-2 rounded-lg bg-gray-100 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul>
        {filteredAndSortedUsers.map((user) => {
          const profileImg = user.role === "employer" && user.companyLogo
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
          return (
            <li key={user._id} className="my-1 mx-2">
              {isMobile ? (
                <button
                  onClick={() => onUserSelect(user._id)}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition relative"
                >
                  <img
                    src={profileImg}
                    alt={name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 truncate">
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
                        <span className="text-blue-500 italic">typing...</span>
                      ) : user.lastMessage ? (
                        <div className="flex justify-between gap-2">
                          <span className="truncate">{user.lastMessage}</span>
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
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition relative"
                >
                  <img
                    src={profileImg}
                    alt={name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 truncate">
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
                        <span className="text-blue-500 italic">typing...</span>
                      ) : user.lastMessage ? (
                        <div className="flex justify-between gap-2">
                          <span className="truncate">{user.lastMessage}</span>
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
