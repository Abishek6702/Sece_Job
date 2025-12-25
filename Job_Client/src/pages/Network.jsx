import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { initSocket } from "../utils/socket";
import MyNetworks from "../components/MyNetworks";
import UserCard from "../components/UserCard";
import Connections from "../components/Connections";
import Loader from "../components/Loader";

const Network = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get("tab") || "all";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id || decoded._id || decoded.userId);
        const sock = initSocket(decoded.id || decoded._id || decoded.userId);
        setSocket(sock);
        return () => sock.disconnect();
      } catch (e) {
        console.error("JWT decode error:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/${currentUserId}`)
        .then((res) => res.json())
        .then((data) => setCurrentUserData(data))
        .catch((err) => console.error("Failed to fetch user data:", err));
    }
  }, [currentUserId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredUsers = allUsers
    .filter((user) => {
      if (user._id === currentUserId) return false;
      const isConnected = currentUserData?.connections?.includes(user._id);
      const isRequested = currentUserData?.sentRequests?.includes(user._id);
      return !isConnected && !isRequested && user.role === "employee";
    })
    .filter((user) => {
      const name =
        user.onboarding?.firstName && user.onboarding?.lastName
          ? `${user.onboarding.firstName} ${user.onboarding.lastName}`
          : user.name || "";
      return name.toLowerCase().includes(search.toLowerCase());
    });

  const connectionCount = currentUserData?.connections?.length || 0;
  const allCount = allUsers.filter(
    (user) =>
      user._id !== currentUserId &&
      user.role === "employee" &&
      !currentUserData?.connections?.includes(user._id) &&
      !currentUserData?.sentRequests?.includes(user._id)
  ).length;

  const handleTabChange = (tab) => {
    navigate(`/network?tab=${tab}`);
    setSearch("");
  };
  const connectedUsers = allUsers.filter((user) =>
    currentUserData?.connections?.includes(user._id)
  );

  return (
    <>
      <div className="w-[95%] mx-auto py-8 ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold hidden md:block">
            Connect With Professionals
          </h2>
          {activeTab === "all" && (
            <div className="m-auto md:m-0 relative">
              <input
                type="text"
                className="border rounded-full px-4 py-2 w-64 outline-none border-gray-300"
                placeholder="Search Employees"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute top-2.5 right-2.5 w-4 text-gray-400 z-10 bg-white" />
            </div>
          )}
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/4 bg-white rounded-xl border border-gray-300">
            <MyNetworks
              activeTab={activeTab}
              onTabChange={handleTabChange}
              counts={{
                all: allCount,
                connections: connectionCount,
                groups: 0,
              }}
            />
          </div>
          <div className="w-full lg:w-3/4 ">
            {activeTab === "connections" ? (
              <Connections
                connections={connectedUsers}
                currentUserId={currentUserId}
                currentUserData={currentUserData}
              />
            ) : activeTab === "all" ? (
              loading ? (
                <div className="flex flex-col justify-center items-center text-gray-500 py-20 w-full h-full">
                  <Loader />
                  <p className="mt-4">Loading...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredUsers.length === 0 ? (
                    <div className="col-span-full text-gray-500 text-center py-12">
                      No employees found.
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <UserCard
                        key={user._id}
                        user={user}
                        currentUserId={currentUserId}
                        currentUserData={currentUserData}
                        showConnectButton={true}
                      />
                    ))
                  )}
                </div>
              )
            ) : (
              <div className="text-center text-gray-500 py-20">
                Groups feature coming soon.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Network;
