import React from "react";
import { GraduationCap } from "lucide-react";

const EducationTab = ({ education }) => (
  <div className=" rounded-2xl">
    <h3 className="font-bold text-xl mb-8 flex items-center gap-3 text-blue-800">
      <GraduationCap size={28} /> Education Timeline
    </h3>

    {(!education || education.length === 0) && (
      <div className="text-gray-500 text-center py-8">
        No education details found.
      </div>
    )}

    <div className="relative">
      <div
        className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"
        style={{
          height: education.length > 0 ? "calc(100% - 2rem)" : "0",
          top: "1.5rem",
        }}
      ></div>

      <ol className="space-y-10">
        {education.map((edu, idx) => (
          <li key={idx} className="relative pl-10">
            <div className="absolute left-0 top-1.5 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ring-4 ring-white shadow">
              <GraduationCap size={20} className="text-blue-600" />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 transition hover:shadow-lg">
              <div className="md:flex flex-col md:flex-row md:justify-between md:items-center">
                <span className="font-semibold text-blue-700 text-lg">
                  {edu.level}
                </span>
                <span className="text-sm text-gray-400 mt-1 md:mt-0">
                  {new Date(edu.yearFrom).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}{" "}
                  –{" "}
                  {new Date(edu.yearTo).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </span>
              </div>

              <div className="text-gray-800 mt-2 font-medium">
                {edu.institution}
                {edu.university ? `, ${edu.university}` : ""}
              </div>

              <div className="text-gray-500 text-sm mt-1">
                <span className="mr-4">
                  <b>Branch:</b> {edu.branch || "N/A"}
                </span>
                <span>
                  <b>Marks:</b> {edu.marks || "N/A"}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </div>
);

export default EducationTab;
