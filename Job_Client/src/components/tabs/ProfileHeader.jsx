    import React, { useRef } from "react";
import axios from "axios";

const ProfileHeader = ({ profile }) => {
  const profileImageInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const onboarding = profile.onboarding || {};
  const fullName = onboarding.firstName
    ? `${onboarding.firstName} ${onboarding.lastName}`
    : profile.name;

  const handleProfileImageButtonClick = () => {
    profileImageInputRef.current.click();
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/onboarding/profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      window.location.reload();
    } catch (error) {
      alert("Failed to upload profile image.");
    }
  };

  return (
    <div className="profile_section m-4 p-4 mb-2 border">
      <div className="user_profile relative text-gray-500">
        {onboarding.profileImage ? (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/${onboarding.profileImage}`}
            alt="Profile"
            className="w-30 h-30 rounded-full object-cover"
          />
        ) : (
          <div className="w-30 h-30 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
            {fullName
              ? fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "U"}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={profileImageInputRef}
          style={{ display: "none" }}
          onChange={handleProfileImageChange}
        />
        <div
          className="img_edit absolute bottom-1 left-23 p-2 rounded-full bg-white cursor-pointer"
          onClick={handleProfileImageButtonClick}
        >
          <svg width="23" height="23" fill="none" viewBox="0 0 23 23">
            <path
              d="M10.4285 3.42773H3.42847C2.89803 3.42773 2.38933 3.63845 2.01425 4.01352C1.63918 4.38859 1.42847 4.8973 1.42847 5.42773V19.4277C1.42847 19.9582 1.63918 20.4669 2.01425 20.8419C2.38933 21.217 2.89803 21.4277 3.42847 21.4277H17.4285C17.9589 21.4277 18.4676 21.217 18.8427 20.8419C19.2178 20.4669 19.4285 19.9582 19.4285 19.4277V12.4277"
              stroke="currentcolor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.9285 1.92796C18.3263 1.53014 18.8659 1.30664 19.4285 1.30664C19.9911 1.30664 20.5306 1.53014 20.9285 1.92796C21.3263 2.32579 21.5498 2.86535 21.5498 3.42796C21.5498 3.99057 21.3263 4.53014 20.9285 4.92796L11.4285 14.428L7.42847 15.428L8.42847 11.428L17.9285 1.92796Z"
              stroke="currentcolor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="user_details mt-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-2xl">{fullName}</p>
          <button className="border rounded-full p-2 px-6">Open to</button>
        </div>
        <p className="text-gray-500 font-md mt-2">{onboarding.location || "N/A"}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
