import React, { useState } from "react";
import FeedsPost from "./FeedsPost";

const PostComposer = ({ profile, onNewPost  }) => {
  const [showComponent, setShowComponent] = useState(false);

  const handlePostCreated = (newPost) => {
    onNewPost(newPost);
    setShowComponent(false);
  };
  const profileImg =
    profile && profile.onboarding && profile.onboarding.profileImage
      ? `${profile.onboarding.profileImage}`
      : null;

  return (
    <>
      <div className="bg-white rounded-2xl shadow p-4 mb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 py-1">
          {profileImg && (
            <img
              src={profileImg}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <input
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none"
            placeholder="Share something..."
            onClick={() => setShowComponent(true)}
          />
        </div>
      </div>
      {showComponent && (
        <div className="fixed inset-0 tint flex items-center justify-center z-50">
          <FeedsPost 
            onClose={() => setShowComponent(false)} 
            onPostCreated={handlePostCreated} 
          />
        </div>
      )}
    </>
  );
};

export default PostComposer;
