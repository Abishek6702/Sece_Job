import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { Paperclip, SendHorizonal, Smile, X, FileText } from "lucide-react";

const EmojiInput = ({
  value,
  onChange,
  onSend,
  placeholder = "Type a message...",
  imageFile,
  setImageFile,
  loading = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const inputRef = useRef(null);
  const pickerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };
    if (showPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  // Show image preview
  useEffect(() => {
    if (imageFile) {
      setImagePreview(URL.createObjectURL(imageFile));
    } else {
      setImagePreview(null);
    }
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imageFile]);

  const handleEmojiClick = (emojiData) => {
    onChange({ target: { value: (value || "") + emojiData.emoji } });
    setShowPicker(false);
    inputRef.current?.focus();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="relative flex flex-col w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
      {(imageFile || imagePreview) && (
        <div className="mb-2 flex items-center relative pl-4">
          {imageFile?.type?.startsWith("image/") || !imageFile ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-32 rounded shadow mr-2"
            />
          ) : (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <FileText className="w-6 h-6 text-[#4361EE]" />
              <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                {imageFile.name}
              </span>
            </div>
          )}
          <button
            onClick={handleRemoveImage}
            className={`absolute -top-2 text-red-500 hover:underline bg-red-100 p-1 rounded-full ${
              imageFile?.type?.startsWith("image/") || !imageFile ? "left-32" : "left-44"
            }`}
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          value={value || ""}
          onChange={onChange}
          placeholder="Send a message..."
          className="flex-1 p-3 bg-transparent outline-none border-none text-gray-700"
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          autoComplete="off"
        />
        <div className="flex items-center gap-2 pr-2">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition rounded-full"
            onClick={() => setShowPicker((v) => !v)}
            aria-label="Toggle emoji picker"
            tabIndex={-1}
          >
            <Smile className="w-5 h-5" />
          </button>

          {showPicker && (
            <div
              ref={pickerRef}
              className="absolute bottom-16 right-10 z-50 shadow-lg rounded-lg border border-gray-300 bg-white"
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

          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition rounded-full"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            title="Attach image"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <button
            onClick={loading ? undefined : onSend}
            disabled={loading}
            className={`btn-grad text-white flex items-center justify-center gap-2 px-5 py-2 rounded-full transition font-medium ml-2 ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            type="button"
          >
            <span className="hidden lg:block text-sm">{loading ? "Sending..." : "Send"}</span>
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <SendHorizonal className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmojiInput;
