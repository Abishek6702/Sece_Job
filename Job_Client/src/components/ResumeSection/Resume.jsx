import React, { useState, useMemo, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";

const Resume = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/templates/`)
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
      })
      .catch((error) => {
        console.error("Error fetching templates:", error);
      });
  }, []);

  const handleTemplateSelect = (id) => {
    navigate(`/resume-builder/${id}`);
  };

  return (
    <div className="main_container">
      {/* Header */}
      <div className="header w-[50%] m-auto mt-4">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Resume Templates
        </h1>
        <p className="text-center mt-2 text-gray-800">
          Choose a template to start building your resume.
        </p>
      </div>

      {/* Gallery */}
      <div className="template_section  p-4 overflow-y-auto mt-2">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {templates.map((template) => (
            <div
              key={template.id}
              className="relative bg-white shadow-md rounded-2xl overflow-hidden border border-gray-300 cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-xl group"
              onClick={() => handleTemplateSelect(template.id)}
            >
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${template.previewImage}`}
                alt={`Resume Template ${template.id}`}
                className="w-full object-cover"
              />
              {/* Overlay on hover */}
              <div
                className="absolute bottom-0 left-0 w-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200
                bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3"
              >
                <div className="font-semibold text-lg">{template.name}</div>
                <div className="text-sm">{template.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resume;
