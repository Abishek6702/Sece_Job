import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMessageContext } from "../context/MessageContext";
import { jwtDecode } from "jwt-decode";
import { EmojiPicker } from "@ferrucc-io/emoji-picker";
import EmojiInput from "./EmojiInput";

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
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
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [recipientProfile, setRecipientProfile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const messagesEndRef = useRef(null);
  const {
    sendTypingIndicator,
    sendStopTyping,
    markMessagesRead,
    typingUsers,
    socket,
  } = useMessageContext();

  useEffect(() => {
    const fetchRecipientProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setRecipientProfile(data);
      } catch (error) {
        console.error("Error fetching recipient profile:", error);
      }
    };
    if (userId) fetchRecipientProfile();
  }, [userId]);

  console.log("pt", recipientProfile);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/messages/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
    socket.on("new-message", handleNewMessage);
    return () => socket.off("new-message", handleNewMessage);
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
    if (!newMessage.trim() && !imageFile) return;
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("recipient", userId);
      formData.append("content", newMessage);
      if (imageFile) formData.append("image", imageFile);

      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      setNewMessage("");
      setImageFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
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
    <div className="w-full bg-white rounded-xl border border-gray-300 p-4 flex flex-col h-full">
      <div className="border-b border-gray-300 pb-4 mb-4 flex items-center">
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
          <div className="flex items-center gap-4">
            <img
              src={recipientProfileImg}
              alt={recipientProfile.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-lg">
                {recipientProfile.onboarding?.firstName &&
                recipientProfile.onboarding?.lastName
                  ? `${recipientProfile.onboarding.firstName} ${recipientProfile.onboarding.lastName}`
                  : recipientProfile.name}
              </h3>
              <p>{recipientProfile.email}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto mb-4 px-2 custom-scroll">
        {messages.map((message) => {
          let senderId = message.sender;
          if (typeof senderId === "object" && senderId !== null) {
            senderId = senderId._id || senderId.id;
          }
          senderId = senderId?.toString();
          const isSender = senderId === currentUserId;

          // Determine sender profile image prioritizing companyLogo if employer
          const isEmployer = message.sender?.role === "employer";
          const companyLogo = message.sender?.companyLogo;
          const onboardingProfileImage = message.sender?.profileImage || message.sender?.onboarding?.profileImage;

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
            }
          );

          return (
            <div
              key={message._id}
              className={`flex mb-2 items-end ${
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
              <div className="flex flex-col max-w-[70%]">
                <div
                  className={`px-4 py-2 rounded-2xl break-words shadow ${
                    isSender
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                  style={{
                    borderTopLeftRadius: isSender ? "1rem" : "0.5rem",
                    borderTopRightRadius: isSender ? "0.5rem" : "1rem",
                  }}
                >
                  {message.content}
                  {message.image && (
                    <img
                      src={`${message.image}`}
                      alt="attachment"
                      className="max-w-xs rounded-lg shadow mt-2"
                    />
                  )}
                </div>
                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    isSender ? "text-right" : "text-left"
                  }`}
                >
                  {messageTime}
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
      <div className="flex items-center border-t border-gray-300 pt-4">
        <EmojiInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onSend={handleSendMessage}
          imageFile={imageFile}
          setImageFile={setImageFile}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
};

export default MessageDetail;
