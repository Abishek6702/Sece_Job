import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { Paperclip, SendHorizonal, Smile, X } from "lucide-react";

const EmojiInput = ({
  value,
  onChange,
  onSend,
  placeholder = "Type a message...",
  imageFile,
  setImageFile,
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
    <div className="relative flex flex-col w-full">
      {imagePreview && (
        <div className="mb-2 flex items-center relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-32 rounded shadow  mr-2"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 left-44 text-red-500 hover:underline bg-red-100 p-1 rounded-full"
            type="button"
          >
            <X/> 
          </button>
        </div>
      )}
      <div className="flex items-center">
        <div className="relative  w-full">
          <input
            ref={inputRef}
            type="text"
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full flex-1 p-3 border rounded-xl border-gray-300 outline-none"
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            autoComplete="off"
          />
          <button
            type="button"
            className="absolute right-14 top-1 p-2 bg-gray-100  rounded-full text-gray-500"
            onClick={() => setShowPicker((v) => !v)}
            aria-label="Toggle emoji picker"
            tabIndex={-1}
          >
            <Smile />
          </button>
          <button
            type="button"
            className=" absolute right-2 top-1 ml-2 p-2 bg-gray-100 rounded-full text-gray-500"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            title="Attach image"
          >
            <Paperclip />
          </button>
        </div>

        {showPicker && (
          <div
            ref={pickerRef}
            className="absolute bottom-14 right-0 z-50 shadow-lg rounded-lg border border-gray-300 bg-white"
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
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          onClick={onSend}
          className="bg-blue-500 w-[14%] md:w-[10%] text-white p-2.5 rounded-xl hover:bg-blue-600 transition ml-4 font-semibold text-lg "
          type="button"
        >
          <SendHorizonal className="lg:hidden "/>
          <p className="hidden lg:block">Send</p>
        </button>
      </div>
    </div>
  );
};

export default EmojiInput;
