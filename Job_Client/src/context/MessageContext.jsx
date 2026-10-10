import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadLoading, setUnreadLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  const location = useLocation();

  // Socket connection
  useEffect(() => {
    const token = localStorage.getItem("carvion-key");
    
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    if (!socket) {
      const newSocket = io(`${import.meta.env.VITE_API_BASE_URL}`, {
        auth: { token },
        transports: ["websocket", "polling"],
      });
      setSocket(newSocket);
    }
  }, [location.pathname, socket]);

  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  // Fetch initial unread counts
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      setUnreadLoading(true);
      try {
        const token = localStorage.getItem("carvion-key");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/messages/unread-count`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setUnreadCounts(data);
      } catch (e) {
        setUnreadCounts({});
      } finally {
        setUnreadLoading(false);
      }
    };
    if (socket) fetchUnreadCounts();
  }, [socket]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleUnreadUpdate = ({ senderId, increment }) => {
      const openChatUserId = window.location.pathname.split("/").pop();
      if (senderId === openChatUserId) {
        setUnreadCounts((prev) => ({ ...prev, [senderId]: 0 }));
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]: increment ? (prev[senderId] || 0) + 1 : 0,
        }));
      }
    };

    const handleUserOnline = (userId) => {
      if (!userId) return;
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.add(userId.toString());
        return next;
      });
    };

    const handleUserOffline = (userId) => {
      if (!userId) return;
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId.toString());
        return next;
      });
    };

    socket.on("update-unread-count", handleUnreadUpdate);
    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);
    
    const fetchOnlineUsers = () => {
      socket.emit("get-online-users", (users) => {
        if (users) setOnlineUsers(new Set(users.map(u => u?.toString())));
      });
    };

    socket.on("connect", fetchOnlineUsers);
    if (socket.connected) {
      fetchOnlineUsers();
    }

    return () => {
      socket.off("update-unread-count", handleUnreadUpdate);
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
      socket.off("connect", fetchOnlineUsers);
    };
  }, [socket]);

  // Mark as read (when chat is opened)
  const markMessagesRead = useCallback(async (senderId) => {
    try {
      const token = localStorage.getItem("carvion-key");
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/messages/read/${senderId}`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadCounts((prev) => ({ ...prev, [senderId]: 0 }));
    } catch (err) {}
  }, []);

  // Join user room for sockets
  const joinUserRoom = useCallback(
    (userId) => {
      if (socket) socket.emit("join-user", userId);
    },
    [socket]
  );

  return (
    <MessageContext.Provider
      value={{
        socket,
        unreadCounts,
        typingUsers,
        unreadLoading,
        onlineUsers,
        joinUserRoom,
        markMessagesRead,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext);
