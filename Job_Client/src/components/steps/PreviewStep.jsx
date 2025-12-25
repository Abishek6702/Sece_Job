import React from "react";

export default function PreviewStep({ formData }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Preview Your Details</h2>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-2 mb-4
"
      >
        <div className="font-semibold text-gray-700">Name:</div>
        <div>
          {formData.firstName} {formData.lastName}
        </div>

        <div className="font-semibold text-gray-700">Location:</div>
        <div>{formData.location}</div>

        {/* <div className="font-semibold text-gray-700">Salary Expectation:</div>
        <div>{formData.salaryExpectation}</div> */}

        <div className="font-semibold text-gray-700">Preferred Roles:</div>
        <div>
          {formData.preferredRoles && formData.preferredRoles.length ? (
            formData.preferredRoles.map((role) => (
              <span
                key={role}
                className="inline-block  px-2 py-1 text-xs rounded mr-1 mb-1 text-gray-700"
              >
                {role}
              </span>
            ))
          ) : (
            <span className="text-gray-500">---</span>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2 mt-5">Education</h3>
      <div className="space-y-4 mb-4">
        {formData.education.length === 0 && (
          <div className="text-gray-500 italic">No education added.</div>
        )}
        {formData.education.map((edu, i) => (
          <div key={i} className=" ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
              <div className="font-semibold text-gray-600">
                Education Level:
              </div>
              <div>{edu.level || <span className="text-gray-400">-</span>}</div>
              <div className="font-semibold text-gray-600">Institution:</div>
              <div>
                {edu.institution || <span className="text-gray-400">-</span>}
              </div>
              <div className="font-semibold text-gray-600">University:</div>
              <div>
                {edu.university || <span className="text-gray-400">-</span>}
              </div>
              <div className="font-semibold text-gray-600">Branch:</div>
              <div>
                {edu.branch || <span className="text-gray-400">-</span>}
              </div>
              <div className="font-semibold text-gray-600">Year From:</div>
              <div>
                {edu.yearFrom || <span className="text-gray-400">-</span>}
              </div>
              <div className="font-semibold text-gray-600">Year To:</div>
              <div>
                {edu.yearTo || <span className="text-gray-400">-</span>}
              </div>
              <div className="font-semibold text-gray-600">Marks:</div>
              <div>{edu.marks || <span className="text-gray-400">-</span>}</div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold ">Experience</h3>
      <div className="space-y-4 mb-4">
        {formData.experience.length === 0 && (
          <div className="text-gray-500 italic">No experience added.</div>
        )}
        {formData.experience.map((exp, i) => (
          <div key={i} className=" ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
              <div className="font-semibold text-gray-600">Company:</div>
              <div>
                {exp.company || <span className="text-gray-400">-</span>}
              </div>
              <div className="font-semibold text-gray-600">Title:</div>
              <div>{exp.title || <span className="text-gray-400">-</span>}</div>
              <div className="font-semibold text-gray-600">Location:</div>
              <div>
                {exp.location || <span className="text-gray-400">-</span>}
              </div>
              <div className="font-semibold text-gray-600">Year From:</div>
              <div>
                {exp.yearFrom || <span className="text-gray-400">-</span>}
              </div>
              <div className="font-semibold text-gray-600">Year To:</div>
              <div>
                {exp.yearTo || <span className="text-gray-400">-</span>}
              </div>
              <div className="font-semibold text-gray-600">Description:</div>
              <div>
                {exp.description || <span className="text-gray-400">-</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 items-center">
        <div className="font-semibold text-gray-600">Career Gap:</div>
        <div>
          {formData.careerGap.gapDisplay || (
            <span className="text-gray-400">-</span>
          )}
        </div>
        <div className="font-semibold text-gray-600">Gap Start:</div>
        <div>
          {formData.careerGap.yearFrom || (
            <span className="text-gray-400">-</span>
          )}
        </div>
        <div className="font-semibold text-gray-600">Gap End:</div>
        <div>
          {formData.careerGap.yearTo || (
            <span className="text-gray-400">-</span>
          )}
        </div>
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 items-center">
        <div className="font-semibold text-gray-700">Profile Image:</div>
        <div>
          {formData.profileImage ? (
            <span>{formData.profileImage.name}</span>
          ) : (
            <span className="italic text-gray-400">Not uploaded</span>
          )}
        </div>
        <div className="font-semibold text-gray-700">Resume:</div>
        <div>
          {formData.resume ? (
            <span>{formData.resume.name}</span>
          ) : (
            <span className="italic text-gray-400">Not uploaded</span>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-6">
        Please review all details before submitting. Use Back to edit any
        section.
      </div>
    </div>
  );
}