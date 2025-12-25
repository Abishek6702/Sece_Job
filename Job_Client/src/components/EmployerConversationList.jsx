import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Search, User } from "lucide-react";
import { useEmployerMessageContext } from "../components/EmployerMessageContext";
import { useNavigate } from "react-router-dom";
import nodata from "../assets/cuate.svg";
import Loader from "./Loader";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.userId || decoded._id || null;
  } catch {
    return null;
  }
};

const formatMessageTime = (timestamp) => {
  if (!timestamp) return null;
  const now = new Date();
  const msgDate = new Date(timestamp);
  const isToday = msgDate.toDateString() === now.toDateString();
  return isToday
    ? msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
};

const EmployerConversationList = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Context for unread counts (object { [userId]: count })
  const { unreadCounts } = useEmployerMessageContext();

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      const userId = getUserIdFromToken();
      const token = localStorage.getItem("token");
      if (!userId || !token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/messages/conversations-for-employer`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId }),
          }
        );

        if (!res.ok) throw new Error("Failed to fetch conversations");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);
  console.log("k", users);
  // Filter and sort users by search and last message time
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

  return (
    <div className="bg-white rounded-xl border border-gray-300 p-0 w-full h-full flex flex-col">
      {/* Search Input */}
      <div className="relative p-4 border-b border-gray-200">
        <Search className="absolute left-6 top-6 text-gray-400 w-6 h-6 pointer-events-none" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 p-2 rounded-lg bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search users"
        />
      </div>

      {/* Content area - list or states */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center flex-col py-8">
            <div className="loader border-gray-300 border-t-blue-500 border-4 rounded-full w-10 h-10 animate-spin" />
            <p className="mt-40 text-gray-500">
              {" "}
              <Loader />
              <p className="mt-4 ml-12">Loading Chats...</p>
            </p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-6">{error}</div>
        ) : filteredAndSortedUsers.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <div className="text-center py-8">
              <img src={nodata} className="w-60 m-auto" />
              No Conversation available!
            </div>
          </div>
        ) : (
          <ul>
            {filteredAndSortedUsers.map((user) => {
              const profileImg =
                user.role === "employer" && user.companyLogo
                  ? user.companyLogo?.startsWith("http")
                    ? user.companyLogo
                    : `${user.companyLogo}`
                  : user.onboarding?.profileImage
                  ? `${
                      user.onboarding.profileImage
                    }`
                  : "/default-avatar.png";

              const name =
                user.onboarding?.firstName && user.onboarding?.lastName
                  ? `${user.onboarding.firstName} ${user.onboarding.lastName}`
                  : user.name || "User";

              const lastMessageTime = formatMessageTime(user.lastMessageTime);

              const unreadCount = unreadCounts?.[user._id] || 0;

              return (
                <li key={user._id} className="my-1 mx-2">
                  <div
                    className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition relative cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/employer-dashboard/employermessages/${user._id}`
                      )
                    }
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={profileImg}
                        alt={name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 truncate">
                          {name}
                        </span>
                        {unreadCount > 0 && (
                          <span className=" bg-blue-500 text-white text-xs font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate flex justify-between gap-2">
                        <span className="truncate">
                          {user.lastMessage || "Start a conversation"}
                        </span>
                        {lastMessageTime && (
                          <span className="whitespace-nowrap">
                            {lastMessageTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmployerConversationList;
