import React, { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import { Search } from "lucide-react";
import nodata from "../assets/cuate.svg"
import Loader from "./Loader";
const Connections = ({ currentUserId }) => {
  const [search, setSearch] = useState("");
  const [connList, setConnList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/${currentUserId}`)
      .then((res) => res.json())
      .then((data) => setCurrentUserData(data))
      .catch((err) => console.error("Failed to fetch user data:", err));
  }, [currentUserId]);

  // Fetch all users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAllUsers(data))
      .catch((err) => console.error("Failed to fetch all users:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filter connected users 
  useEffect(() => {
    if (!currentUserData || allUsers.length === 0) return;

    const connected = allUsers.filter((user) =>
      currentUserData.connections?.includes(user._id)
    );

    setConnList(connected);
  }, [currentUserData, allUsers]);

  // Remove connection
  const handleRemoveConnection = async (removeUserId) => {
    if (!window.confirm("Are you sure you want to remove this connection?"))
      return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/connections/unconnect`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId1: currentUserId,
            userId2: removeUserId,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to remove connection");

      setConnList((prev) => prev.filter((u) => u._id !== removeUserId));
    } catch (error) {
      alert("Failed to remove connection");
    }
  };

  // Filter by search
  const filteredConnections = connList.filter((user) => {
    const name =
      user.onboarding?.firstName && user.onboarding?.lastName
        ? `${user.onboarding.firstName} ${user.onboarding.lastName}`
        : user.name || "";

    return name.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return  <div className="flex flex-col justify-center items-center text-gray-500 py-20 w-full h-full">
                  <Loader />
                  <p className="mt-4">Loading...</p>
                </div>;
  }

  return (
    <div className="w-full">
      <div className="flex md:justify-between items-center md:mb-6 relative  md:mt-0 mb-10 mt-6 justify-center ">
        <input
          type="text"
          className="border absolute   md:-top-14 md:right-0 rounded-full px-4 py-2 w-64 outline-none border-gray-300"
          placeholder="Search Connections"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="hidden md:block absolute -top-11.5 right-2.5 w-4 text-gray-400 z-10 bg-white" />
      </div>

      {filteredConnections.length === 0 ? (
        <div className="col-span-full text-gray-500 text-center py-12">
          <img src={nodata} className="w-60 m-auto" />
          You haven't made any connections yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredConnections.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              currentUserId={currentUserId}
              currentUserData={currentUserData}
              showConnectButton={false}
              showMenu={true}
              onRemoveConnection={handleRemoveConnection}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Connections;
