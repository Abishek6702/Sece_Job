import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow, format } from "date-fns";
import {
  Heart,
  MessageCircle,
  Send,
  SendHorizonal,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useRef } from "react";

const getImageUrl = (relativePath, fallbackName = "User") => {
  if (relativePath && relativePath.trim() !== "") {
    const normalizedPath = relativePath.replace(/\\/g, "/");

    if (normalizedPath.startsWith("uploads/")) {
      return `${import.meta.env.VITE_API_BASE_URL}/${normalizedPath}`;
    }
    return `${
      import.meta.env.VITE_API_BASE_URL
    }/uploads/images/${normalizedPath}`;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}`;
};

const Post = ({ post, profile }) => {
  const myId = profile?._id;
  const [isLiked, setIsLiked] = useState(
    post.likes.some((like) =>
      typeof like === "string"
        ? like === myId
        : like && (like._id === myId || like.toString() === myId)
    )
  );
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);

  const [showAllComments, setShowAllComments] = useState(false);

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const visibleComments = showAllComments
    ? sortedComments
    : sortedComments.slice(0, 1);

  useEffect(() => {
    console.log("Post data from backend:", post);
    console.log("Post author image:", post.author?.onboarding?.profileImage);
    if (post.comments && post.comments.length > 0) {
      post.comments.forEach((comment, idx) => {
        console.log(
          `Comment[${idx}] user:`,
          comment.user,
          "profileImage:",
          comment?.user?.onboarding?.profileImage
        );
      });
    }
    console.log("Current user profile:", profile);
  }, [post, profile]);

  const getFormattedTime = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diff = now - date;
    const oneDay = 1000 * 60 * 60 * 24;

    if (diff < oneDay * 3) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, "MMM d, yyyy");
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsLiked(!isLiked);
      setLikeCount(
        res.data.likes ? res.data.likes.length : likeCount + (isLiked ? -1 : 1)
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/${post._id}/comment`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data);
      setNewComment("");
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleEmojiClick = (emojiData) => {
    const input = inputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const updated =
      newComment.substring(0, start) +
      emojiData.emoji +
      newComment.substring(end);

    setNewComment(updated);
    setTimeout(() => input.focus(), 0);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.author.onboarding.profileImage}
          alt={post.author?.name || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
        {
            console.log("Amt",post.author.onboarding.profileImage)

        }
        <div>
          <h3 className="font-semibold">{post.author?.name || "User"}</h3>
        </div>
        <span className="ml-auto text-gray-500 text-sm">
          {getFormattedTime(post.createdAt)}
        </span>
      </div>

      <p className="mb-3">{post.content}</p>
      {post.image && (
        <img
          src={
            post.image.startsWith("uploads/")
              ? `${post.image.replace(
                  /\\/g,
                  "/"
                )}`
              : `${post.image.replace(/\\/g, "/")}`
          }
          alt="Post"
          className="w-full rounded-lg mb-3"
        />
      )}

      <div className="flex border-b border-gray-300  py-2 mb-3 text-gray-500 text-md font-semibold">
        <button onClick={handleLike} className="flex items-center px-4 py-1">
          {isLiked ? (
            <>
              <Heart
                className="w-4 h-4 mr-1 text-red-500"
                fill="currentColor"
              />
              {likeCount} <p className="hidden md:block ml-1"> Liked</p>
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 mr-1 text-gray-500" />
              {likeCount} <p className="hidden md:block ml-1"> Like</p>
            </>
          )}
        </button>

        <button className="flex items-center px-4 py-1 ">
          <MessageCircle className="w-4 h-4 mr-1" />
          {comments.length}<p className="hidden md:block ml-1">Comment</p>
        </button>

        <button className="flex items-center px-4 py-1 ">
          <Share2 className="w-4 h-4 mr-1" />
          <p className="hidden md:block"> Share</p>
        </button>
      </div>

      <div className="space-y-2">
        {visibleComments.map((comment, index) => {
          console.log("ttt",comment?.user?.onboarding?.profileImage)
          const commentUserImg = (
            comment?.user?.onboarding?.profileImage,
            comment?.user?.name
          );

          return (
            <div key={index} className="flex items-start gap-2 mb-2">
              <img
                src={comment?.user?.onboarding?.profileImage}
                alt={comment?.user?.name || "User"}
                className="w-8 h-8 rounded-full mt-1"
              />
              <div className="bg-gray-100 rounded-lg p-2 flex-1">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {comment.user?.name || "User"}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {getFormattedTime(comment.createdAt)}
                  </p>
                </div>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            </div>
          );
        })}

        {comments.length > 1 && (
          <button
            onClick={() => setShowAllComments((prev) => !prev)}
            className="text-sm text-blue-600 hover:underline mt-1 ml-10"
          >
            {showAllComments
              ? "Hide comments"
              : `See all ${comments.length} comments`}
          </button>
        )}

        <div className="flex gap-2 mt-3 relative">
          <img
            src={profile.onboarding.profileImage}
            alt={profile?.name || "You"}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-gray-100 rounded-full px-4 py-2 outline-none pr-10"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-10 top-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              onClick={handleComment}
              className="absolute right-2 top-1.5 text-blue-500"
            >
              <SendHorizonal />
            </button>
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-full right-0 z-50"
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={320}
                  height={350}
                  theme="light"
                  previewConfig={{ showPreview: false }}
                  frequentlyUsedEmoji={[]}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
