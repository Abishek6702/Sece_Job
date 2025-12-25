import React, { useState, useEffect } from "react";


const ProfileCard = ({ profile, loading }) => {
  const [postCount, setPostCount] = useState(0);

 useEffect(() => {
  if (profile) {
    const token = localStorage.getItem("token");
    console.log("Fetching posts for user:", profile._id);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts/my-posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: profile._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched posts ak:", data);
        setPostCount(Array.isArray(data) ? data.length : 0);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setPostCount(0);
      });
  }
}, [profile]);


console.log("sk", postCount);



  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-3 ml-9 h-60 max-w-xs mx-auto text-center">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-xs mx-auto text-center">
        Profile not found.
      </div>
    );
  }

  const name =
    profile.onboarding?.firstName && profile.onboarding?.lastName
      ? `${profile.onboarding.firstName} ${profile.onboarding.lastName}`
      : profile.name || "User";
  const username = profile.onboarding?.firstName
    ? profile.onboarding.firstName.toLowerCase()
    : "username";
 const posts = postCount;

  const following = profile.connections?.length || 0;

  return (
    <div className="">
    <div className=" bg-white rounded-2xl shadow p-3 ml-9  max-w-xs mx-auto">
      <div className="relative h-25 mb-10 rounded-xl">
      {profile.onboarding?.banner ? (
  <img
    src={`${profile.onboarding.banner}`}
    alt="Cover"
    className="w-full h-full object-cover rounded-xl"
  />
) : (
  <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-sm">
    No Banner Image
  </div>
)}

        <div className="absolute top-[70px] left-[50%] translate-x-[-50%] rounded-full ">
          <img
            src={
              profile.onboarding?.profileImage
                ? `${profile.onboarding.profileImage}`
                : undefined
            }
            alt="Profile"
            className="w-16 h-16 object-fit rounded-full"
          />
        </div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-lg">{name}</div>
        <div className="text-gray-400 text-sm">@{username}</div>
      </div>
      <div className="flex justify-around text-center">
        <div>
          <div className="font-bold text-gray-900">{posts}</div>
          <div className="text-xs text-gray-400">Post</div>
        </div>
        <div>
          <div className="font-bold text-gray-900">{following}</div>
          <div className="text-xs text-gray-400">Connections</div>
        </div>
      </div>
      
    </div>
    </div>
  );
};

export default ProfileCard;
