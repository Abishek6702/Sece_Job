import React from "react";

const Preview = ({ fullFormData, prevStep }) => {
  const {
    personal,
    education,
    experience,
    projects,
    certifications,
    skills,
    languages,
    roles,
  } = fullFormData;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border w-full max-w-4xl mx-auto mt-9">
      {/* Header */}
      <div className="border-b pb-4 mb-6 text-center">
        {personal?.photo && (
          <img
            src={URL.createObjectURL(personal.photo)}
            alt="Profile"
            className="w-24 h-24 object-cover rounded-full mx-auto mb-3"
          />
        )}
        <h1 className="text-2xl font-bold text-gray-800">{personal?.name}</h1>
        <p className="text-gray-600">{personal?.email} | {personal?.phone}</p>
        <p className="text-gray-600">{personal?.address}</p>
        {personal?.socialLinks?.map((link, i) => (
  <a
    key={i}
    href={link.url}
    className="text-blue-600 text-sm underline"
    target="_blank"
    rel="noreferrer"
  >
    {link.key || link.url}
  </a>
))}

      </div>

      {/* Summary */}
      {personal?.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{personal.summary}</p>
        </section>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Education</h2>
          <ul className="space-y-2">
            {education.map((edu, i) => (
              <li key={i} className="text-gray-700">
                <p className="font-semibold">{edu.degree} - {edu.institution}</p>
                <p className="text-sm">{edu.start} - {edu.end}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Experience</h2>
          <ul className="space-y-3">
            {experience.map((exp, i) => (
              <li key={i}>
                <p className="font-semibold">{exp.title} @ {exp.company}</p>
                <p className="text-sm text-gray-600">{exp.start} - {exp.end}</p>
                <p className="text-gray-700">{exp.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Projects</h2>
          <ul className="space-y-2">
            {projects.map((proj, i) => (
              <li key={i}>
                <p className="font-semibold">{proj.name}</p>
                <p className="text-gray-700 text-sm">{proj.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Certifications</h2>
          <ul className="list-disc list-inside text-gray-700">
            {certifications.map((cert, i) => (
              <li key={i}>{cert}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Languages</h2>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                {lang}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Roles & Responsibilities */}
      {roles?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Roles & Responsibilities</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-1">
            {roles.map((role, i) => (
              <li key={i}>{role}</li>
            ))}
          </ol>
        </section>
      )}

      {/* Footer Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={prevStep}
          className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={() => alert("Submit functionality to be implemented")}
          className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Preview;
