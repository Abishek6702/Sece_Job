import React, { useEffect, useState } from "react";
import { BriefcaseBusiness, Users, Check, X } from "lucide-react";

const ICONS = {
  connection: <Users className="w-6 h-6 text-blue-500" />,
  job: <BriefcaseBusiness className="w-6 h-6 text-green-500" />,
  default: (
    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-gray-400 font-bold">
      !
    </div>
  ),
};

const TABS = [
  { key: "all", label: "All" },
  { key: "connection", label: "Connections" },
  { key: "job", label: "Jobs" },
];

function formatTime(date) {
  const now = new Date();
  const d = new Date(date);
  const diff = (now - d) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 172800) return `Yesterday`;
  return d.toLocaleDateString();
}

const NotificationModal = ({ userId, open, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!open || !userId) return;
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/notifications?userId=${userId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId, open]);

  const markAsRead = async (notifId) => {
    try {
      await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/notifications/mark-read/${notifId}`,
        { method: "PATCH" }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, read: true } : n))
      );
    } catch (err) {}
  };

  const handleApprove = async (notif) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/connections/accept`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: notif.senderId._id || notif.senderId,
            receiverId: userId,
          }),
        }
      );
      if (res.ok) {
        await markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notif._id
              ? {
                  ...n,
                  type: "connection_accepted",
                  message: "You accepted this connection request.",
                  read: true,
                }
              : n
          )
        );
      }
    } catch (err) {
      alert("Failed to approve connection.");
    }
  };

  const handleReject = async (notif) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/connections/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: notif.senderId._id || notif.senderId,
            receiverId: userId,
          }),
        }
      );
      if (res.ok) {
        await markAsRead(notif._id);
        setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
      }
    } catch (err) {
      alert("Failed to reject connection.");
    }
  };

  const connectionNotifications = notifications.filter(
    (n) => n.type && n.type.startsWith("connection")
  );
  const jobNotifications = notifications.filter(
    (n) =>
      n.type && (n.type.startsWith("job") || n.type === "application_status")
  );

  let filtered = notifications;
  if (activeTab === "connection") filtered = connectionNotifications;
  else if (activeTab === "job") filtered = jobNotifications;

  const unreadCount = (cat) => {
    if (cat === "all") return notifications.filter((n) => !n.read).length;
    if (cat === "connection")
      return connectionNotifications.filter((n) => !n.read).length;
    if (cat === "job") return jobNotifications.filter((n) => !n.read).length;
    return 0;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30 ">
      <div className="absolute right-[70px] mt-[44px] w-4 h-4 bg-white rotate-45 shadow-sm "></div>

      <div className="lg:w-[35%]  mt-12 md:mr-14 rounded-lg shadow-2xl bg-white overflow-hidden animate-fade-in z-10 ">
        <div className="flex items-center justify-between p-6 pb-2 ">
          <h2 className="text-xl font-semibold">Notification</h2>
          <button
            onClick={onClose}
            className="text-gray-600 cursor-pointer rounded-full p-1 bg-gray-300"
          >
            <X />
          </button>
        </div>
        <div className="flex gap-2 p-2 ml-4 bg-gray-100 rounded-lg w-fit">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all
          ${isActive ? "bg-white text-gray-700 shadow-sm" : "text-gray-500"}
        `}
              >
                <span className="font-semibold">{tab.label}</span>
                {unreadCount(tab.key) > 0 && (
                  <span
                    className={`ml-1 text-xs font-bold px-1.5 py-0.5 rounded-md 
              ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-500"}
            `}
                  >
                    {unreadCount(tab.key)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="  p-4 space-y-3  h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="text-gray-500 p-6">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-500 p-6">No notifications.</div>
          ) : (
            filtered.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.read && markAsRead(n._id)}
                className={`flex items-center gap-4 rounded-xl  p-2 transition cursor-pointer border  ${
                  !n.read ? "border-gray-200 bg-gray-100" : "border-gray-200"
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {n.sender?.profileImage ? (
                    <img
                      src={`${
                        n.sender.profileImage
                      }`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    ICONS[n.type] || ICONS.default
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-base flex items-center">
                    {n.type === "connection_request" && n.senderId?.name ? (
                      <>
                        <p>
                          <span className="text-blue-600 font-semibold mr-1">
                            {n.senderId.name}
                          </span>
                          sent you a connection request
                        </p>
                      </>
                    ) : n.type === "connection_accepted" && n.senderId?.name ? (
                      <>
                        <p>
                          <span className="text-blue-600 font-semibold mr-1">
                            {n.senderId.name}
                          </span>
                          accepted your connection request
                        </p>
                      </>
                    ) : n.type === "connection_rejected" && n.senderId?.name ? (
                      <>
                        <p>
                          <span className="text-blue-600 font-semibold mr-1">
                            {n.senderId.name}
                          </span>
                          rejected your connection request
                        </p>
                      </>
                    ) : (
                      n.title || n.message
                    )}
                  </div>
                  {n.detail && (
                    <div className="text-gray-600 text-sm mt-1">{n.detail}</div>
                  )}
                  {n.type === "connection_request" && !n.read && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(n);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                      >
                        <Check size={18} /> Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(n);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition"
                      >
                        <X size={18} /> Reject
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400 min-w-[40px] text-right mt-1">
                  {formatTime(n.createdAt)}
                  {!n.read && (
                    <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
