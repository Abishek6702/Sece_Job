import React, { useState, useRef } from "react";
import { CloudUpload, X } from "lucide-react";

export default function UploadsStep({ formData, setFormData, errors, setFormError }) {
  const profileImageInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [dragActiveProfile, setDragActiveProfile] = useState(false);
  const [dragActiveResume, setDragActiveResume] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 50MB in bytes
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

  const handleFile = (name, file) => {
    // File size check
    if (file.size > MAX_FILE_SIZE) {
      alert("File size should not exceed 50 MB");
      return;
    }

    // Image type check
    if (name === "profileImage" && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert("Only JPEG, JPG, or PNG images are allowed");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: file }));

    if (name === "profileImage") {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(file ? URL.createObjectURL(file) : null);
    }
  };

  const removeFile = (name) => {
    setFormData((prev) => ({ ...prev, [name]: null }));
    if (name === "profileImage" && imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleDrag = (setDragActive) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (setDragActive, name) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(name, e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = (inputRef) => {
    inputRef.current.click();
  };

  const handleInputChange = (name) => (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(name, e.target.files[0]);
    }
  };

  const displayFileName = (file) => (file ? file.name : "No file selected");

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Uploads</h2>
      <p className="mb-4 text-gray-700">Upload your profile image and resume</p>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Image */}
        <div className="flex flex-col gap-1">
          <label className="font-bold">
            Profile Image<span className="text-red-500">*</span>
          </label>
          <div
            onDragEnter={handleDrag(setDragActiveProfile)}
            onDragLeave={handleDrag(setDragActiveProfile)}
            onDragOver={handleDrag(setDragActiveProfile)}
            onDrop={handleDrop(setDragActiveProfile, "profileImage")}
            onClick={() => triggerFileInput(profileImageInputRef)}
            className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 hover:border-blue-400 transition cursor-pointer ${
              dragActiveProfile
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <CloudUpload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">
              Drag & drop image or{" "}
              <span className="text-blue-600 underline">Browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Allowed: jpg, jpeg, png — Max size: 5MB
            </p>
          </div>
          <input
            type="file"
            ref={profileImageInputRef}
            accept=".jpg,.jpeg,.png"
            onChange={handleInputChange("profileImage")}
            className="hidden"
          />
          {formData.profileImage && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-14 h-14 object-cover rounded border"
                />
              )}
              <span>Selected: {displayFileName(formData.profileImage)}</span>
              <button
                onClick={() => removeFile("profileImage")}
                className="text-red-500 hover:text-red-700"
                type="button"
              >
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            </div>
          )}
          {errors?.profileImage && (
            <p className="text-red-500 text-sm">{errors.profileImage}</p>
          )}
        </div>

        {/* Resume */}
        <div className="flex flex-col gap-1">
          <label className="font-bold">
            Resume<span className="text-red-500">*</span>
          </label>
          <div
            onDragEnter={handleDrag(setDragActiveResume)}
            onDragLeave={handleDrag(setDragActiveResume)}
            onDragOver={handleDrag(setDragActiveResume)}
            onDrop={handleDrop(setDragActiveResume, "resume")}
            onClick={() => triggerFileInput(resumeInputRef)}
            className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 hover:border-blue-400 transition cursor-pointer ${
              dragActiveResume
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <CloudUpload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">
              Drag & drop resume or{" "}
              <span className="text-blue-600 underline">Browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Max size: 15MB</p>
          </div>
          <input
            type="file"
            ref={resumeInputRef}
            accept=".pdf,.doc,.docx"
            onChange={handleInputChange("resume")}
            className="hidden"
          />
          {formData.resume && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>Selected: {displayFileName(formData.resume)}</span>
              <button
                onClick={() => removeFile("resume")}
                className="text-red-500 hover:text-red-700"
                type="button"
              >
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            </div>
          )}
          {errors?.resume && (
            <p className="text-red-500 text-sm">{errors.resume}</p>
          )}
        </div>
      </div>
    </div>
  );
}