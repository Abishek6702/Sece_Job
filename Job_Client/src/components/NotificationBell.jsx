import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import NotificationPage from "../pages/NotificationPage";

const NotificationBell = ({ socket, userId }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!userId) return;
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/notifications/unread-count?userId=${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.count || 0));
    if (!socket) return;
    socket.on("new-notification", () => setUnreadCount((prev) => prev + 1));
    return () => socket?.off("new-notification");
  }, [socket, userId]);

  return (
    <>
      <button className="relative" onClick={() => setModalOpen(true)}>
        <Bell className="cursor-pointer text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {unreadCount}
          </span>
        )}
      </button>
      <NotificationPage
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={userId}
      />
    </>
  );
};

export default NotificationBell;
