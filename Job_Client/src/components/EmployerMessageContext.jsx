// EmployerMessageContext.jsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { io } from "socket.io-client";

const EmployerMessageContext = createContext();

export const EmployerMessageProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadLoading, setUnreadLoading] = useState(false);

  // Initialize Socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io(`${import.meta.env.VITE_API_BASE_URL}`, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch unread counts initially whenever socket connects
  useEffect(() => {
    if (!socket) return;

    const fetchUnreadCounts = async () => {
      setUnreadLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/messages/unread-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch unread counts");
        const data = await res.json();
        setUnreadCounts(data);
      } catch (err) {
        setUnreadCounts({});
      } finally {
        setUnreadLoading(false);
      }
    };

    fetchUnreadCounts();
  }, [socket]);

  // Handle socket event to update unread counts dynamically
  useEffect(() => {
    if (!socket) return;

    const handleUpdateUnread = ({ senderId, increment }) => {
      // Determine if user currently viewing the chat with senderId
      const pathParts = window.location.pathname.split("/");
      const openChatUserId = pathParts[pathParts.length - 1];
      if (!senderId) return;

      if (senderId === openChatUserId) {
        // Reset count if chat is open
        setUnreadCounts((prev) => ({ ...prev, [senderId]: 0 }));
      } else {
        // Increment or reset based on 'increment' flag
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]: increment ? (prev[senderId] || 0) + 1 : 0,
        }));
      }
    };

    socket.on("update-unread-count", handleUpdateUnread);

    // Listen for typing events (optional)
    const handleUserTyping = ({ userId, isTyping }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [userId]: isTyping,
      }));
    };

    socket.on("user-typing", handleUserTyping);

    return () => {
      socket.off("update-unread-count", handleUpdateUnread);
      socket.off("user-typing", handleUserTyping);
    };
  }, [socket]);

  // Mark messages as read by senderId
  // Call this when employer views the message detail for a user
  const markMessagesRead = useCallback(
    async (senderId) => {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/messages/read/${senderId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Reset unread count locally
        setUnreadCounts((prev) => ({ ...prev, [senderId]: 0 }));

        // Optionally notify backend/socket users here
        if (socket) {
          socket.emit("messages-read", { userId: senderId });
        }
      } catch (err) {
        // Handle error silently or log it
        console.error("Failed to mark messages read", err);
      }
    },
    [socket]
  );

  // Join a user room to receive real-time updates for that user
  const joinUserRoom = useCallback(
    (userId) => {
      if (socket && userId) {
        socket.emit("join-user", userId);
      }
    },
    [socket]
  );

  // Emit typing indicator start
  const sendTypingIndicator = useCallback(
    (recipientId, senderId) => {
      if (socket) {
        socket.emit("typing", { recipientId, senderId });
      }
    },
    [socket]
  );

  // Emit typing indicator stop
  const sendStopTyping = useCallback(
    (recipientId) => {
      if (socket) {
        socket.emit("stop-typing", { recipientId });
      }
    },
    [socket]
  );

  return (
    <EmployerMessageContext.Provider
      value={{
        socket,
        unreadCounts,
        typingUsers,
        unreadLoading,
        joinUserRoom,
        markMessagesRead,
        sendTypingIndicator,
        sendStopTyping,
      }}
    >
      {children}
    </EmployerMessageContext.Provider>
  );
};

// Custom hook for ease of use
export const useEmployerMessageContext = () => useContext(EmployerMessageContext);
