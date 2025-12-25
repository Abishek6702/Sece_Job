import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Paperclip, Smile, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const FeedsPost = ({ onClose, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [connectionType, setConnectionType] = useState("everyone"); 

  const textareaRef = useRef(null);
  const pickerRef = useRef(null);

  // Image preview logic
  useEffect(() => {
    if (image) {
      setImagePreview(URL.createObjectURL(image));
    } else {
      setImagePreview(null);
    }
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
    
  }, [image]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        !textareaRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiData) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText =
      content.substring(0, start) + emojiData.emoji + content.substring(end);
    setContent(newText);
    setShowEmojiPicker(false);
    setTimeout(() => textarea.focus(), 0);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("content", content);
      if (image) formData.append("image", image);
      formData.append("visibility", connectionType); 

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onPostCreated(res.data);
      setContent("");
      removeImage();
      setConnectionType("everyone");
    } catch (err) {
      console.error("Post creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md mx-auto relative">
      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="w-full outline-none rounded-lg p-3 mb-4 resize-none"
          placeholder="What's on your mind ?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          required
        />

        {imagePreview && (
          <div className="relative mb-4 w-fit">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-40 rounded-lg border"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-1 right-1 bg-white bg-opacity-70 rounded-full p-1 hover:bg-red-100"
              aria-label="Remove image"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2 mb-2 relative">
          <div className="border rounded-full p-1.5 border-gray-300">
            <label className="cursor-pointer">
              <Paperclip className="text-gray-500 w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="border rounded-full p-1.5 border-gray-300 relative">
            <button
              type="button"
              className="rounded-full hover:bg-gray-200"
              tabIndex={-1}
              onClick={() => setShowEmojiPicker((v) => !v)}
            >
              <Smile className="text-gray-500 w-5 h-5" />
            </button>
            {showEmojiPicker && (
              <div
                ref={pickerRef}
                className="absolute z-50 -top-40 left-100"
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

        <div className="border-t border-gray-300 mb-2 w-full"></div>

        <div className=" flex items-center justify-between">
          <div>
            <label className="mr-2 font-medium text-gray-800">Posting to</label>
            <select
              className="border border-gray-300 text-gray-600 rounded-lg px-2 py-1 outline-none"
              value={connectionType}
              onChange={e => setConnectionType(e.target.value)}
            >
              <option value="everyone">Everyone</option>
              <option value="connections">Connections</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 border rounded-lg border-gray-300 text-gray-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FeedsPost;
