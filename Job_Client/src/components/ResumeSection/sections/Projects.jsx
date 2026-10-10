import React, { useState, useEffect } from "react";

const Projects = ({ data, updateData, nextStep, prevStep, isFirst, isLast }) => {
  // Local copy of parent data
  const [fields, setFields] = useState([]);

  // Manage temporary link inputs per project
  const [linkInputs, setLinkInputs] = useState([]);

  // Sync local state whenever parent data changes
  useEffect(() => {
    if (data.length > 0) {
      setFields(data);
      setLinkInputs(data.map(() => ({ newKey: "", newUrl: "" })));
    } else {
      setFields([
        {
          name: "",
          description: "",
          techStack: "",
          startDate: "",
          endDate: "",
          present: false,
          links: [],
        },
      ]);
      setLinkInputs([{ newKey: "", newUrl: "" }]);
    }
  }, [data]);

  const handleChange = (idx, e) => {
    const { name, value, type, checked } = e.target;
    const newFields = fields.map((entry, i) =>
      i === idx ? { ...entry, [name]: type === "checkbox" ? checked : value } : entry
    );
    setFields(newFields);
  };

  const addEntry = () => {
    setFields([
      ...fields,
      {
        name: "",
        description: "",
        techStack: "",
        startDate: "",
        endDate: "",
        present: false,
        links: [],
      },
    ]);
    setLinkInputs([...linkInputs, { newKey: "", newUrl: "" }]);
  };

  const removeEntry = (index) => {
    const newFields = fields.filter((_, idx) => idx !== index);
    setFields(newFields);

    const newLinkInputs = linkInputs.filter((_, idx) => idx !== index);
    setLinkInputs(newLinkInputs);
  };

  const addLink = (idx, key, url) => {
    if (!key.trim() || !url.trim()) return;
    const newFields = [...fields];
    newFields[idx].links.push({ key: key.trim(), url: url.trim() });
    setFields(newFields);
  };

  const removeLink = (pIdx, lIdx) => {
    const newFields = [...fields];
    newFields[pIdx].links.splice(lIdx, 1);
    setFields(newFields);
  };

  const handleSaveAndNext = () => {
    updateData(fields); // ✅ only push changes once
    nextStep();
  };

  return (
    <div className="rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold  text-gray-700">
          Personal & Professional Projects
        </h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          onClick={addEntry}
          type="button"
        >
          Add Project<span className="hidden md:block"></span>
        </button>
      </div>

      {fields.map((entry, idx) => (
        <div key={idx} className="mb-6 border-b border-gray-300 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Name */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                name="name"
                value={entry.name}
                onChange={(e) => handleChange(idx, e)}
                placeholder="Enter Project Name"
                className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Tech Stack
              </label>
              <input
                type="text"
                name="techStack"
                value={entry.techStack}
                onChange={(e) => handleChange(idx, e)}
                placeholder="Enter Tech Stack"
                className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={entry.startDate}
                onChange={(e) => handleChange(idx, e)}
                className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
              />
            </div>

            {/* End Date / Present */}
            <div>
              {!entry.present && (
                <>
                  <label className="block mb-1 font-semibold text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={entry.endDate}
                    onChange={(e) => handleChange(idx, e)}
                    className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
                  />
                </>
              )}
              <label
                className={`flex items-center space-x-2 font-semibold text-gray-700 ${
                  entry.present ? "mt-9" : "mt-1"
                }`}
              >
                <input
                  type="checkbox"
                  name="present"
                  checked={entry.present}
                  onChange={(e) => handleChange(idx, e)}
                />
                <span>On-Going Project</span>
              </label>
            </div>

            {/* Project Links */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold text-gray-700">
                Project Links
              </label>
              <div className="flex flex-col md:flex-row gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Link Key (e.g. GitHub)"
                  value={linkInputs[idx]?.newKey || ""}
                  onChange={(e) => {
                    const newLinks = [...linkInputs];
                    newLinks[idx].newKey = e.target.value;
                    setLinkInputs(newLinks);
                  }}
                  className="flex-1 border border-gray-300 bg-gray-50 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  placeholder="Link URL"
                  value={linkInputs[idx]?.newUrl || ""}
                  onChange={(e) => {
                    const newLinks = [...linkInputs];
                    newLinks[idx].newUrl = e.target.value;
                    setLinkInputs(newLinks);
                  }}
                  className="flex-1 border border-gray-300 bg-gray-50 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    addLink(idx, linkInputs[idx].newKey, linkInputs[idx].newUrl);
                    const newLinks = [...linkInputs];
                    newLinks[idx] = { newKey: "", newUrl: "" };
                    setLinkInputs(newLinks);
                  }}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {entry.links.map((link, lIdx) => (
                  <div
                    key={lIdx}
                    className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-sm border border-gray-300 text-sm"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-600 hover:underline cursor-pointer"
                    >
                      {link.key}
                    </a>
                    <button
                      onClick={() => removeLink(idx, lIdx)}
                      className="ml-1 text-red-500 hover:text-red-700 font-bold"
                      type="button"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold text-gray-700">
                Project Description
              </label>
              <textarea
                name="description"
                value={entry.description}
                onChange={(e) => handleChange(idx, e)}
                placeholder="Enter Project Description"
                className="w-full border border-gray-300 bg-gray-50 focus:border-blue-500 outline-none focus:border-2 p-2 rounded-lg"
                rows={3}
              />
            </div>
          </div>

          {fields.length > 1 && (
            <button
              className="text-red-500 mt-2"
              onClick={() => removeEntry(idx)}
              type="button"
            >
              Remove Project
            </button>
          )}
        </div>
      ))}

      {/* Navigation */}
      <div className="flex items-center justify-between space-x-2 mt-6">
        {!isFirst && (
          <button
            onClick={prevStep}
            className="px-5 py-2 rounded bg-gray-200 cursor-pointer font-semibold text-gray-500"
            type="button"
          >
            Previous
          </button>
        )}
        <button
          onClick={handleSaveAndNext}
          className="px-6 py-2 rounded bg-blue-600 text-white cursor-pointer font-semibold"
          type="button"
        >
          Save & Next
        </button>
      </div>
    </div>
  );
};

export default Projects;
