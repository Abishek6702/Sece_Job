import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Trash2,
  StickyNote,
  Smile,
  SendHorizonal,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { formatDistanceToNow, format } from "date-fns";
import ConfirmModal from "../ConfirmModal";
import nodata from "../../assets/cuate.svg";
import { toast } from "react-toastify";

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

const getFormattedTime = (createdAt) => {
  const date = new Date(createdAt);
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  if (now - date < oneDay * 3) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else {
    return format(date, "MMM d, yyyy");
  }
};

const MyPostsTab = ({ token, userId, profile }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [openMenuPostId, setOpenMenuPostId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const [postStates, setPostStates] = useState({});

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/posts/my-posts`,
          { userId },
          { headers: { "Content-Type": "application/json" } }
        );
        const postsFetched = response.data || [];
        setPosts(postsFetched);
        const states = {};
        for (const post of postsFetched) {
          const myId = profile?._id;
          states[post._id] = {
            isLiked:
              Array.isArray(post.likes) &&
              post.likes.some((like) =>
                typeof like === "string"
                  ? like === myId
                  : like && (like._id === myId || like.toString() === myId)
              ),
            likeCount: (post.likes || []).length,
            comments: post.comments || [],
            newComment: "",
            showEmojiPicker: false,
            showAllComments: false,
          };
        }
        setPostStates(states);
      } catch (error) {
        setPosts([]);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [userId]);

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPostStates((prev) => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          isLiked: !prev[postId].isLiked,
          likeCount: res.data.likes
            ? res.data.likes.length
            : prev[postId].likeCount + (prev[postId].isLiked ? -1 : 1),
        },
      }));
    } catch (err) {
      toast.error("Failed to like/unlike post");
    }
  };

  const handleComment = async (postId) => {
    if (!postStates[postId].newComment.trim()) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/${postId}/comment`,
        { content: postStates[postId].newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPostStates((prev) => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          comments: res.data,
          newComment: "",
        },
      }));
    } catch (err) {
      toast.error("Failed to comment");
    }
  };

  const emojiPickerRefs = useRef({});
  const inputRefs = useRef({});

  const handleEmojiClick = (emojiData, postId) => {
    const input = inputRefs.current[postId];
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const updated =
      postStates[postId].newComment.substring(0, start) +
      emojiData.emoji +
      postStates[postId].newComment.substring(end);
    setPostStates((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        newComment: updated,
        showEmojiPicker: false,
      },
    }));
    setTimeout(() => input.focus(), 0);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      Object.entries(emojiPickerRefs.current).forEach(([postId, ref]) => {
        if (
          ref &&
          !ref.contains(e.target) &&
          inputRefs.current[postId] &&
          !inputRefs.current[postId].contains(e.target)
        ) {
          setPostStates((prev) => ({
            ...prev,
            [postId]: {
              ...prev[postId],
              showEmojiPicker: false,
            },
          }));
        }
      });
    };
    const isAnyOpen = Object.values(postStates).some(
      (st) => st.showEmojiPicker
    );
    if (isAnyOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [postStates]);

  const handleToggleComments = (postId) => {
    setPostStates((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        showAllComments: !prev[postId].showAllComments,
      },
    }));
  };

  const toggleMenu = (postId) =>
    setOpenMenuPostId((prev) => (prev === postId ? null : postId));
  const confirmDelete = (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };
  const handleDeleteConfirmed = async () => {
    if (!postToDelete) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts/${postToDelete}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) => prev.filter((p) => p._id !== postToDelete));
      setPostStates((prev) => {
        const newStates = { ...prev };
        delete newStates[postToDelete];
        return newStates;
      });
      toast.info("Post deleted successfully");
    } catch (err) {
      toast.error("Failed to delete post");
    } finally {
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  if (loading) return <div>Loading your posts...</div>;
  if (!posts.length)
    return (
      <div className="text-gray-500 text-center m-auto ">
        <h3 className="font-bold text-xl  flex items-center gap-3 text-blue-800 mb-4">
          <StickyNote size={26} /> My Posts
        </h3>
        <img src={nodata} alt="" className="w-50 h-50 m-auto" />
        <p>No Data Found</p>
      </div>
    );
  return (
    <div>
      <h3 className="font-bold text-xl  flex items-center gap-3 text-blue-800 mb-4">
        <StickyNote size={26} /> My Posts
      </h3>
      <ul className="space-y-6">
        {posts.map((post) => {
          const st = postStates[post._id];
          if (!st) return null;
          const sortedComments = [...(st.comments || [])].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          const visibleComments = st.showAllComments
            ? sortedComments
            : sortedComments.slice(0, 1);

          const isOwnPost = token && post.author?._id === userId;

          return (
            <li
              key={post._id}
              className="bg-white rounded-2xl shadow p-5 relative"
            >
              {isOwnPost && (
                <div className="absolute top-3 right-3">
                  <button onClick={() => toggleMenu(post._id)}>
                    <MoreHorizontal className="w-5 h-5 text-gray-600 hover:text-black" />
                  </button>
                  {openMenuPostId === post._id && (
                    <div className="absolute right-0 mt-2 bg-white rounded shadow w-32 z-50">
                      <button
                        className="w-full px-4 py-2 text-sm text-red-600 cursor-pointer flex items-center gap-2"
                        onClick={() => confirmDelete(post._id)}
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <img
                  src={
                    post.author?.onboarding?.profileImage
                  }
                  alt={post.author?.name || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">
                    {post.author?.name || "You"}
                  </h3>
                  <div className="text-xs text-gray-400">
                    {getFormattedTime(post.createdAt)}
                  </div>
                </div>
              </div>

              <h3 className="font-semibold mb-1">{post.title}</h3>
              <p className="text-gray-700 mb-3">{post.content}</p>
              {post.image && (
                <img
                  src={
                    post.image.startsWith("uploads/")
                      ? `${post.image.replace(/\\/g, "/")}`
                      : `${post.image.replace(/\\/g, "/")}`
                  }
                  alt="Post"
                  className="w-full rounded-lg mb-3"
                />
              )}

              <div className="flex border-b border-gray-200 py-2 mb-3 text-gray-500 text-md font-semibold">
                <button
                  className="flex items-center px-4 py-1"
                  onClick={() => handleLike(post._id)}
                >
                  {st.isLiked ? (
                    <>
                      <Heart
                        className="w-4 h-4 mr-1 text-red-500"
                        fill="currentColor"
                      />
                      {st.likeCount} Liked
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-1 text-gray-500" />
                      {st.likeCount} Like
                    </>
                  )}
                </button>

                <button className="flex items-center px-4 py-1" type="button">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {st.comments.length} Comment
                </button>

                <button className="flex items-center px-4 py-1" type="button">
                  <Share2 className="w-4 h-4 mr-1" /> Share
                </button>
              </div>

              <div className="space-y-2">
                {visibleComments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-start gap-2 mb-2 "
                  >
                    <img
                      src={
                        comment.user?.onboarding?.profileImage
                       }
                      alt={comment.user?.name || "User"}
                      className="w-8 h-8 rounded-full mt-1 "
                    />
                    <div className="bg-gray-100 rounded-lg p-2 flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {comment.user?.name || "User"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {getFormattedTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {comment.text || comment.content}
                      </p>
                    </div>
                  </div>
                ))}

                {st.comments.length > 1 && (
                  <button
                    className="text-blue-600 hover:underline text-sm mt-2 ml-10"
                    onClick={() => handleToggleComments(post._id)}
                  >
                    {st.showAllComments
                      ? "Hide comments"
                      : `See all ${st.comments.length} comments`}
                  </button>
                )}

                <div className="flex gap-2 mt-3 relative ">
                  <img
                    src={
                     ""
                      }
                    alt={profile?.name || "You"}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 relative">
                    <input
                      ref={(el) => (inputRefs.current[post._id] = el)}
                      type="text"
                      className="w-full bg-gray-100 rounded-full px-4 py-2 outline-none pr-10"
                      placeholder="Write a comment..."
                      value={st.newComment}
                      onChange={(e) =>
                        setPostStates((prev) => ({
                          ...prev,
                          [post._id]: {
                            ...prev[post._id],
                            newComment: e.target.value,
                          },
                        }))
                      }
                      onFocus={() =>
                        setPostStates((prev) => ({
                          ...prev,
                          [post._id]: {
                            ...prev[post._id],
                            showEmojiPicker: false,
                          },
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleComment(post._id);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-10 top-2 text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        setPostStates((prev) => ({
                          ...prev,
                          [post._id]: {
                            ...prev[post._id],
                            showEmojiPicker: !prev[post._id].showEmojiPicker,
                          },
                        }))
                      }
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleComment(post._id)}
                      className="absolute right-2 top-1.5 text-blue-500"
                    >
                      <SendHorizonal />
                    </button>
                    {st.showEmojiPicker && (
                      <div
                        ref={(el) => (emojiPickerRefs.current[post._id] = el)}
                        className="absolute bottom-full right-0 z-50"
                      >
                        <EmojiPicker
                          onEmojiClick={(emoji) =>
                            handleEmojiClick(emoji, post._id)
                          }
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
            </li>
          );
        })}
      </ul>

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirmed}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
};

export default MyPostsTab;
