import React, { useEffect, useState, useMemo } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // fixed import (default import)
import UserList from "../components/UserList";
import MessageDetail from "../components/MessageDetail";
import { MessageProvider } from "../context/MessageContext";
import { useMessageContext } from "../context/MessageContext";

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

const Messages = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { unreadCounts } = useMessageContext();

  // NEW STATES FOR TABS & EMPLOYER CONVERSATION DATA
  const [selectedTab, setSelectedTab] = useState("Connections"); // or "Employers"
  const [employerConversations, setEmployerConversations] = useState([]);
  const [employerLoading, setEmployerLoading] = useState(false);

  const currentUserId = getUserIdFromToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch all users
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => setAllUsers(data))
      .catch((err) => {
        console.error(err);
        setAllUsers([]);
      });
  }, []);

  // Fetch current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = currentUserId;
      if (!userId || !token) {
        setLoading(false);
        return;
      }
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
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUserId]);

  // Filter users: only connections
  const connections = useMemo(() => {
    if (!profile || !Array.isArray(allUsers)) return [];
    return allUsers.filter(
      (user) =>
        user._id !== profile._id && profile.connections?.includes(user._id)
    );
  }, [allUsers, profile]);

  // Fetch employer conversations when "Employers" tab is selected
  useEffect(() => {
    if (selectedTab !== "Employers") return;

    const fetchEmployerConversations = async () => {
      setEmployerLoading(true);
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();

      if (!userId) {
        console.error("No user ID found from token");
        setEmployerLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/messages/employers-with-conversation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // can omit if backend doesn’t require auth here
            },
            body: JSON.stringify({ userId }), // pass userId explicitly in the body
          }
        );

        if (!res.ok) throw new Error("Failed to fetch employer conversations");

        const data = await res.json();
        setEmployerConversations(data);
      } catch (err) {
        console.error(err);
        setEmployerConversations([]);
      } finally {
        setEmployerLoading(false);
      }
    };

    fetchEmployerConversations();
  }, [selectedTab]);

  const usersToShow =
    selectedTab === "Employers" ? employerConversations : connections;

  const handleUserSelect = (userId) => {
    navigate(`/messages/${userId}`);
  };

  const handleBack = () => {
    navigate("/messages");
  };

  let showUserList = true;
  let showMessageDetail = true;
  if (isMobile) {
    if (location.pathname.match(/^\/messages\/[^/]+/)) {
      showUserList = false;
      showMessageDetail = true;
    } else {
      showUserList = true;
      showMessageDetail = false;
    }
  }

  const unreadConnectionsCount = useMemo(() => {
    return connections.filter((user) => unreadCounts[user._id] > 0).length;
  }, [connections, unreadCounts]);

  const unreadEmployersCount = useMemo(() => {
    return employerConversations.filter((user) => unreadCounts[user._id] > 0)
      .length;
  }, [employerConversations, unreadCounts]);

  return (
    <MessageProvider>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Messages</h2>

        {/* Tabs UI */}
        <div className="flex gap-2 mb-4">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded border transition ${
              selectedTab === "Connections"
                ? "bg-blue-600 text-white border-transparent"
                : "bg-white text-blue-600 border border-blue-600"
            }`}
            onClick={() => setSelectedTab("Connections")}
          >
            Connections
            {unreadConnectionsCount > 0 && (
              <span
                className={`w-5 h-5 flex items-center justify-center text-xs rounded-full font-semibold ${
                  selectedTab === "Connections"
                    ? "bg-white text-blue-600"
                    : "bg-blue-600 text-white"
                }`}
              >
                {unreadConnectionsCount}
              </span>
            )}
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded border transition ${
              selectedTab === "Employers"
                ? "bg-blue-600 text-white border-transparent"
                : "bg-white text-blue-600 border border-blue-600"
            }`}
            onClick={() => setSelectedTab("Employers")}
          >
            Employers
            {unreadEmployersCount > 0 && (
              <span
                className={`w-5 h-5 flex items-center justify-center text-xs rounded-full font-semibold ${
                  selectedTab === "Employers"
                    ? "bg-white text-blue-600"
                    : "bg-blue-600 text-white"
                }`}
              >
                {unreadEmployersCount}
              </span>
            )}
          </button>
        </div>

        <div
          className={`flex gap-4 h-[calc(100vh-150px)] ${
            isMobile ? "flex-col" : ""
          }`}
        >
          {showUserList && (
            <UserList
              users={usersToShow}
              loading={selectedTab === "Employers" ? employerLoading : loading}
              onUserSelect={handleUserSelect}
              isMobile={isMobile}
            />
          )}
          {showMessageDetail && (
            <Routes>
              <Route
                index
                element={
                  !isMobile ? (
                    <div className="w-full bg-white rounded shadow p-4 flex items-center justify-center">
                      <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center">
                        <div className="text-4xl mb-2">👋</div>
                        <p className="text-lg">
                          Select a conversation to start messaging
                        </p>
                      </div>
                    </div>
                  ) : null
                }
              />
              <Route
                path=":userId"
                element={
                  <MessageDetail isMobile={isMobile} onBack={handleBack} />
                }
              />
            </Routes>
          )}
        </div>
      </div>
    </MessageProvider>
  );
};

export default Messages;
