import React from "react";
import Post from "./Post";
import nodata from "../assets/cuate.svg";
import Loader from "./Loader";

const PostList = ({ posts, profile, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col py-8  h-[60%]">
        <Loader />
        <p className="mt-4">Loading posts...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8">
        <img src={nodata} className="w-60 m-auto" />
        No posts available. Be the first to post!
      </div>
    );
  }
  console.log(posts);

  return (
    <div className="space-y-2  ">
      {posts.map((post) => (
        <Post key={post._id} post={post} profile={profile} />
      ))}
    </div>
  );
};

export default PostList;
