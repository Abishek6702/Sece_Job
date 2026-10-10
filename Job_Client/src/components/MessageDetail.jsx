import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMessageContext } from "../context/MessageContext";
import { jwtDecode } from "jwt-decode";
import { EmojiPicker } from "@ferrucc-io/emoji-picker";
import EmojiInput from "./EmojiInput";
import {
  Search,
  Check,
  CheckCheck,
  FileText,
  ArrowUpRight,
  Trash2,
  MoreVertical,
} from "lucide-react";
import ConfirmModal from "./ConfirmModal";

const formatDateDivider = (dateString) => {
  if (!dateString) return "";
  const msgDate = new Date(dateString);
  const now = new Date();

  const msgDateOnly = new Date(
    msgDate.getFullYear(),
    msgDate.getMonth(),
    msgDate.getDate(),
  );
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = todayOnly - msgDateOnly;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return msgDate.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
};

function getUserIdFromToken() {
  const token = localStorage.getItem("carvion-key");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.userId || decoded._id || null;
  } catch (err) {
    return null;
  }
}

const MessageDetail = ({ isMobile, onBack }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [recipientProfile, setRecipientProfile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);
  const messagesEndRef = useRef(null);
  const {
    sendTypingIndicator,
    sendStopTyping,
    markMessagesRead,
    typingUsers,
    socket,
    onlineUsers,
  } = useMessageContext();

  const isOnline = onlineUsers?.has(userId?.toString());

  useEffect(() => {
    const fetchRecipientProfile = async () => {
      try {
        const token = localStorage.getItem("carvion-key");
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        setRecipientProfile(data);
      } catch (error) {
        console.error("Error fetching recipient profile:", error);
      }
    };
    if (userId) fetchRecipientProfile();
  }, [userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("carvion-key");
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/messages/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(Array.isArray(data) ? data : []);
        markMessagesRead(userId);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [userId, markMessagesRead]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (message) => {
      const senderId =
        message.sender?._id?.toString() || message.sender?.toString();
      const recipientId =
        message.recipient?._id?.toString() || message.recipient?.toString();
      if (senderId === userId || recipientId === userId) {
        setMessages((prev) => [...prev, message]);
        markMessagesRead(userId);
      }
    };

    const handleMessagesRead = ({ recipientId }) => {
      if (recipientId === userId) {
        setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
      }
    };

    const handleDeleteMessage = (deletedMsgId) => {
      setMessages((prev) => prev.filter((m) => m._id !== deletedMsgId));
    };

    socket.on("new-message", handleNewMessage);
    socket.on("messages-read", handleMessagesRead);
    socket.on("delete-message", handleDeleteMessage);
    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("messages-read", handleMessagesRead);
      socket.off("delete-message", handleDeleteMessage);
    };
  }, [socket, userId, markMessagesRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setIsTyping(!!typingUsers[userId]);
  }, [typingUsers, userId]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim()) {
      sendTypingIndicator(userId, getUserIdFromToken());
    } else {
      sendStopTyping(userId);
    }
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !imageFile) || isSending) return;
    setIsSending(true);
    try {
      const token = localStorage.getItem("carvion-key");
      const formData = new FormData();
      formData.append("recipient", userId);
      formData.append("content", newMessage);
      if (imageFile) formData.append("image", imageFile);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/messages`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Failed to send message: ${errorText}`);
        throw new Error(errorText);
      }

      setNewMessage("");
      setImageFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("carvion-key");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/messages/${messageToDelete._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error("Failed to delete message");

      setMessages((prev) => prev.filter((m) => m._id !== messageToDelete._id));
      socket.emit("delete-message", {
        messageId: messageToDelete._id,
        recipientId: userId,
      });
      setMessageToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete message");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded shadow p-4">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  const currentUserId = getUserIdFromToken();

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji.native);
    setShowEmoji(false);
  };

  const viewProfile = () => {
    navigate(`/profile/${userId}`);
  };

  // Get profile image for recipientProfile — include companyLogo if employer
  const recipientProfileImg =
    recipientProfile?.role === "employer" && recipientProfile.companyLogo
      ? recipientProfile.companyLogo.startsWith("http")
        ? recipientProfile.companyLogo
        : `${recipientProfile.companyLogo}`
      : recipientProfile?.onboarding?.profileImage
        ? `${recipientProfile.onboarding.profileImage}`
        : "/default-avatar.png";

  return (
    <div className="w-full bg-[#F6F6FA] rounded-xl p-4 flex flex-col h-full">
      <div className="border-b border-gray-300 pb-4 mb-4 flex items-center justify-between">
        {isMobile && (
          <button
            onClick={onBack}
            className="mr-2 p-1 rounded-full hover:bg-gray-200"
            aria-label="Back"
          >
            ←
          </button>
        )}
        {recipientProfile && (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={recipientProfileImg}
                  alt={recipientProfile.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 flex items-center gap-1 text-xs text-green-500 font-medium ">
                    <span className="w-3 h-3 border-2 border-white rounded-full bg-green-500"></span>{" "}
                  </span>
                )}
              </div>
              <div className={isMobile ? "hidden" : "block"}>
                <h3 className=" text-lg flex items-center gap-2">
                  {recipientProfile.onboarding?.firstName &&
                  recipientProfile.onboarding?.lastName
                    ? `${recipientProfile.onboarding.firstName} ${recipientProfile.onboarding.lastName}`
                    : recipientProfile.name}
                </h3>
                <p className="text-sm text-gray-500">
                  @{recipientProfile.name?.toLowerCase().replace(/\s+/g, "_")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative">
              {isSearching ? (
                <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1.5 transition-all shadow-sm">
                  <Search className="w-4 h-4 text-[#343434] mr-2" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-sm w-24 md:w-40 text-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsSearching(false);
                      setSearchQuery("");
                    }}
                    className="text-gray-400 hover:text-gray-600 ml-1 text-lg leading-none mb-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ) : isMobile ? (
                <>
                  <button 
                    onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                    className="bg-[#d2d8f8] p-2 rounded-lg text-gray-600 cursor-pointer"
                  >
                    <MoreVertical className="w-5 h-5 text-[#343434]" />
                  </button>
                  {showHeaderMenu && (
                    <div className="absolute right-0 top-12 bg-white shadow-lg border border-gray-100 rounded-xl py-2 w-48 z-50">
                      <button 
                        onClick={() => { setIsSearching(true); setShowHeaderMenu(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                      >
                        <Search className="w-4 h-4" /> Search
                      </button>
                      <button 
                        onClick={() => { viewProfile(); setShowHeaderMenu(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                      >
                        <ArrowUpRight className="w-4 h-4" /> View Profile
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsSearching(true)}
                    className="bg-[#d2d8f8]  p-2 rounded-lg text-gray-600 cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-[#343434]" />
                  </button>
                  <button
                    onClick={viewProfile}
                    className="btn-grad text-white px-4 cursor-pointer py-2 rounded-full font-medium text-sm hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    View Profile <ArrowUpRight className=" w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto mb-4 px-2 custom-scroll">
        {messages
          .filter((msg) => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            if (msg.content && msg.content.toLowerCase().includes(q))
              return true;
            if (msg.fileName && msg.fileName.toLowerCase().includes(q))
              return true;
            return false;
          })
          .map((message, index, filteredMessages) => {
            let showDateDivider = false;
            let dateDividerText = "";

            if (index === 0) {
              showDateDivider = true;
              dateDividerText = formatDateDivider(message.createdAt);
            } else {
              const prevMsgDate = new Date(
                filteredMessages[index - 1].createdAt,
              );
              const currMsgDate = new Date(message.createdAt);
              if (prevMsgDate.toDateString() !== currMsgDate.toDateString()) {
                showDateDivider = true;
                dateDividerText = formatDateDivider(message.createdAt);
              }
            }

            let senderId = message.sender;
            if (typeof senderId === "object" && senderId !== null) {
              senderId = senderId._id || senderId.id;
            }
            senderId = senderId?.toString();
            const isSender = senderId === currentUserId;

            // Determine sender profile image prioritizing companyLogo if employer
            const isEmployer = message.sender?.role === "employer";
            const companyLogo = message.sender?.companyLogo;
            const onboardingProfileImage =
              message.sender?.profileImage ||
              message.sender?.onboarding?.profileImage;

            const profileImage =
              isEmployer && companyLogo
                ? companyLogo.startsWith("http")
                  ? companyLogo
                  : `${companyLogo}`
                : onboardingProfileImage
                  ? `${onboardingProfileImage}`
                  : "/default-avatar.png";

            const messageTime = new Date(message.createdAt).toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              },
            );

            return (
              <React.Fragment key={message._id}>
                {showDateDivider && (
                  <div className="flex items-center justify-center my-6">
                    <hr className="flex-1 border-gray-200" />
                    <span className="mx-4 text-xs font-semibold text-gray-400">
                      {dateDividerText}
                    </span>
                    <hr className="flex-1 border-gray-200" />
                  </div>
                )}
                <div
                  className={`flex mb-2 items-end group relative ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isSender && (
                    <img
                      src={profileImage}
                      alt="avatar"
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                  )}
                  {isSender && (
                    <div className="relative mr-2 flex items-center">
                      <div className="lg:hidden relative">
                        <button
                          onClick={() => setActiveMessageMenu(activeMessageMenu === message._id ? null : message._id)}
                          className="cursor-pointer p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeMessageMenu === message._id && (
                          <div className="absolute bottom-full right-0 mb-1 bg-white shadow-lg border border-gray-100 rounded-lg py-1 w-32 z-50">
                            <button
                              onClick={() => { setMessageToDelete(message); setActiveMessageMenu(null); }}
                              className="w-full text-left px-3 py-1.5 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setMessageToDelete(message)}
                        className="hidden lg:block cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex flex-col max-w-[70%]">
                    <div
                      className={`px-4 py-2 rounded-2xl break-words  ${
                        isSender
                          ? message.image
                            ? "bg-[#4361ee]/15 text-gray-900 rounded-br-none border border-gray-100"
                            : "btn-grad shadow text-white rounded-br-none"
                          : "bg-white text-gray-900 shadow rounded-bl-none"
                      }`}
                      style={{
                        borderTopLeftRadius: isSender ? "1rem" : "0.5rem",
                        borderTopRightRadius: isSender ? "0.5rem" : "1rem",
                      }}
                    >
                      {message.content && <div>{message.content}</div>}
                      {message.image &&
                        (message.fileType &&
                        !message.fileType.startsWith("image/") ? (
                          <a
                            href={message.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 mt-2 rounded-lg border transition cursor-pointer bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                          >
                            <FileText className="w-5 h-5 shrink-0 text-[#4361EE]" />
                            <span className="text-sm font-medium truncate max-w-[150px]">
                              {message.fileName || "Document"}
                            </span>
                          </a>
                        ) : (
                          <img
                            src={`${message.image}`}
                            alt="attachment"
                            className="max-w-xs w-40 md:w-80   rounded-lg shadow mt-2 object-contain cursor-pointer"
                            onClick={() => window.open(message.image, "_blank")}
                          />
                        ))}
                    </div>
                    <div
                      className={`text-xs mt-1 flex items-center gap-1 ${
                        isSender
                          ? "justify-end text-gray-500"
                          : "justify-start text-gray-500"
                      }`}
                    >
                      {messageTime}
                      {isSender &&
                        (message.read ? (
                          <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-gray-400" />
                        ))}
                    </div>
                  </div>
                  {isSender && (
                    <img
                      src={profileImage}
                      alt="avatar"
                      className="w-8 h-8 rounded-full ml-2 object-cover"
                    />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center pt-2">
        <EmojiInput
          value={newMessage}
          onChange={handleInputChange}
          onSend={handleSendMessage}
          imageFile={imageFile}
          setImageFile={setImageFile}
          placeholder="Type a message..."
          loading={isSending}
        />
      </div>

      {messageToDelete && (
        <ConfirmModal
          title="Delete Message"
          message="Are you sure you want to permanently delete this message for everyone? This action cannot be undone."
          onConfirm={confirmDeleteMessage}
          onCancel={() => setMessageToDelete(null)}
          confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        />
      )}
    </div>
  );
};

export default MessageDetail;
