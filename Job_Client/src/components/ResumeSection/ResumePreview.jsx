import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";

const ResumePreview = ({previewTrigger }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewHTML, setPreviewHTML] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/templates/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch templates");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched templates:", data);
        setTemplates(data);
      })
      .catch((e) => {
        console.error("Error fetching templates:", e);
      });
  }, []);

  useEffect(() => {
    if (!id || !templates.length) return;

    console.log("Decoded param id (templatePath):", id);

    const found = templates.find((t) => t.id === id);
    if (!found) {
      console.warn("Template not found for path:", decodedPath);
      setSelectedTemplate(null);
    } else {
      setSelectedTemplate(found);
      console.log("Selected template:", found);
    }
  }, [id, templates]);

  useEffect(() => {
    if (!selectedTemplate) {
      setPreviewHTML("");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    if (!token) {
      console.error("No token found in localStorage.");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
      console.log("Decoded JWT token:", decoded);
    } catch (error) {
      console.error("Error decoding token:", error);
      return;
    }

    const userId = decoded?.userId || decoded?.id;
    if (!userId) {
      console.error("User ID not found in decoded token.");
      return;
    }
    console.log("Extracted user ID:", userId);

    if (!selectedTemplate.path) {
      console.error("Selected template has no path.");
      return;
    }
    const templatePath = selectedTemplate.path;
    console.log("Encoded template path:", templatePath);

    const fetchUrl = `http://localhost:3000/api/resumes/preview?userId=${userId}&templatePath=${templatePath}`;
    console.log("Fetching resume preview from URL:", fetchUrl);

    setLoadingPreview(true);
    fetch(fetchUrl)
      .then((res) => {
        console.log("Preview fetch response status:", res.status);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then((html) => {
        console.log("Received preview HTML length:", html.length);
        setPreviewHTML(html);
        setLoadingPreview(false);
      })
      .catch((err) => {
        console.error("Error loading resume preview:", err);
        setLoadingPreview(false);
      });
  }, [selectedTemplate, previewTrigger  ]);

  return (
    <div className="bg-gray-400 w-full h-full overflow-auto rounded-lg  ">
      {loadingPreview ? (
        <p className="text-center text-white mt-12">Loading Preview...</p>
      ) : previewHTML ? (
        <div
          dangerouslySetInnerHTML={{ __html: previewHTML }}
          className="rounded-lg overflow-auto"
        />
      ) : selectedTemplate?.previewImage ? (
        <div className="">
          <img
            src={`http://localhost:3000${selectedTemplate.previewImage}`}
            alt={selectedTemplate.name}
            className="rounded"
          />
        </div>
      ) : (
        <p className="text-center text-white mt-12">No template available</p>
      )}
    </div>
  );
};

export default ResumePreview;
