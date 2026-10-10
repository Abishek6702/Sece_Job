 
import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  Paperclip,
  SendHorizontal,
  Smile,
  X,
  FileText,
} from "lucide-react";

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
  const emojiButtonRef = useRef(null);

  // Handle clicks outside the emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        !emojiButtonRef.current?.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Create and clean up image preview URLs
  useEffect(() => {
    if (!imageFile || !imageFile.type?.startsWith("image/")) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const handleEmojiClick = (emojiData) => {
    onChange({
      target: {
        value: (value || "") + emojiData.emoji,
      },
    });

    setShowPicker(false);
    inputRef.current?.focus();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setImageFile(file);
    }

    // Allow selecting the same file again
    event.target.value = "";
  };

  const handleRemoveImage = () => {
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!loading) {
        onSend();
      }
    }
  };

  return (
    <div className="relative w-full min-w-0 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-2 sm:p-3 shadow-sm">
      {/* Attachment preview */}
      {imageFile && (
        <div className="mb-3 flex min-w-0 items-start gap-3 px-1 sm:px-2">
          <div className="relative min-w-0 max-w-[75%]">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Attachment preview"
                className="max-h-24 max-w-full rounded-lg border border-gray-200 object-contain sm:max-h-32"
              />
            ) : (
              <div className="flex min-w-0 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2 sm:p-3">
                <FileText className="h-5 w-5 shrink-0 text-[#4361EE] sm:h-6 sm:w-6" />

                <span className="max-w-[180px] truncate text-xs font-medium text-gray-700 sm:text-sm">
                  {imageFile.name}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleRemoveImage}
              aria-label="Remove attachment"
              className="absolute -right-2 -top-2 rounded-full bg-red-100 p-1 text-red-500 shadow-sm transition hover:bg-red-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Message input and actions */}
      <div className="flex w-full min-w-0 items-center gap-1 sm:gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value || ""}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="h-10 min-w-0 flex-1 border-none bg-transparent px-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:ring-0 sm:h-12 sm:px-3 sm:text-base"
        />

        <div className="relative flex shrink-0 items-center gap-0.5 sm:gap-1">
          {/* Emoji picker */}
          <button
            ref={emojiButtonRef}
            type="button"
            onClick={() => setShowPicker((prev) => !prev)}
            aria-label="Toggle emoji picker"
            aria-expanded={showPicker}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 sm:h-10 sm:w-10"
          >
            <Smile className="h-5 w-5" />
          </button>

          {showPicker && (
            <div
              ref={pickerRef}
              className="absolute bottom-12 right-0 z-50 w-[min(320px,calc(100vw-32px))] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:bottom-14 sm:right-0"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width="100%"
                height={350}
                theme="light"
                previewConfig={{ showPreview: false }}
                lazyLoadEmojis
              />
            </div>
          )}

          {/* File attachment */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach a file"
            title="Attach a file"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 sm:h-10 sm:w-10"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Send button */}
          <button
            type="button"
            onClick={() => {
              if (!loading) onSend();
            }}
            disabled={loading}
            aria-label={loading ? "Sending message" : "Send message"}
            className={`ml-1 flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-3 text-white shadow-sm transition sm:ml-2 sm:h-11 sm:px-5 ${
              loading
                ? "cursor-not-allowed opacity-70"
                : "hover:shadow-md"
            } btn-grad`}
          >
            <span className="hidden text-sm font-semibold tracking-wide sm:inline">
              {loading ? "Sending..." : "Send"}
            </span>

            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <SendHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmojiInput;