import React, { useEffect, useState } from "react";
import PostList from "../components/PostList";
import FriendSuggestions from "../components/FriendSuggestions";
import ProfileActivity from "../components/ProfileActivity";
import ProfileCard from "../components/ProfileCards";
import PostComposer from "../components/PostCompose";
import { jwtDecode } from "jwt-decode";
import SuggestedGroups from "../components/SuggestedGroups";

// Helper to get userId from token
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.userId || decoded._id || null;
  } catch {
    return null;
  }
};

const Feeds = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken();

      if (!userId || !token) {
        setLoading(false);
        return;
      }

      try {
        const profileRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const profileData = await profileRes.json();
        setProfile(profileData);

        const postsRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/posts/feed`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const postsData = await postsRes.json();
        setPosts(postsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 h-screen bg-gray-100 gap-6 p-4 overflow-hidden scroll">
        <div className="empty-container md:col-span-3 overflow-auto space-y-4 hidden lg:block">
          <ProfileCard profile={profile} loading={loading} />
          <SuggestedGroups />
        </div>

        <div className="col-span-12 lg:col-span-6 overflow-y-auto scroll">
          <PostComposer profile={profile} onNewPost={handleNewPost} />
          <PostList posts={posts} profile={profile} loading={loading} />
        </div>

        <div className="md:col-span-3 hidden lg:block  h-[90vh]">
          <div className="sticky  ">
            <FriendSuggestions userId={getUserIdFromToken()} />
            <ProfileActivity />
          </div>
        </div>
      </div>
    </>
  );
};

export default Feeds;
