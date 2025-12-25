import React from "react";
import {
  XCircle,
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
} from "lucide-react";

const ApplicationModal = ({ application, job, onClose }) => {
  if (!application || !job) return null;

  const statusStyles = {
    selected: "bg-green-100 text-green-700 border-green-300",
    "in progress": "bg-blue-100 text-blue-700 border-blue-300",
    rejected: "bg-red-100 text-red-700 border-red-300",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    default: "bg-gray-100 text-gray-700 border-gray-300",
  };
  const status = application.status || "default";
  const statusClass = statusStyles[status] || statusStyles.default;

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  return (
    <div className="fixed inset-0 tint flex items-center justify-center z-50 mt-14">
      <div className="relative w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-5 right-6 text-gray-400 cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          <XCircle className="w-7 h-7" />
        </button>

        <div className="px-8 pt-8 pb-4 flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100">
          <div className="">
            <div className="flex items-center gap-3 mb-1">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">
                {application.jobId?.position || "N/A"}
              </span>
              <span
              className={`inline-block border font-semibold px-4 py-1 rounded-full mt-4 md:mt-0 text-sm capitalize ${statusClass}`}
            >
              {application.status}
            </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <User className="w-4 h-4" />
              <span>{application.jobId.companyId.company_name || "N/A"}</span>
            </div>
            
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          <Section title="Candidate">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info
                icon={<User className="w-4 h-4" />}
                label="Name"
                value={application.name}
              />
              <Info
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={application.email}
              />
              <Info
                icon={<Phone className="w-4 h-4" />}
                label="Phone"
                value={application.phone}
              />
              <Info
                icon={<MapPin className="w-4 h-4" />}
                label="Location"
                value={application.location}
              />
              <Info
                icon={<Briefcase className="w-4 h-4" />}
                label="Experience"
                value={`${application.experience || 0} year(s)`}
              />
              <Info
                icon={<FileText className="w-4 h-4" />}
                label="Applied At"
                value={formatDate(application.createdAt)}
              />
            </div>
          </Section>

          {application.experienceDetails &&
            application.experienceDetails.length > 0 && (
              <Section title="Professional Experience">
                <ul className="divide-y divide-gray-100">
                  {application.experienceDetails.map((exp, idx) => (
                    <li key={idx} className="py-2">
                      <div className="font-semibold text-gray-900">
                        {exp.company}{" "}
                        <span className="text-gray-500 font-normal">
                          {exp.title && `- ${exp.title}`}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {exp.location && <span>{exp.location} | </span>}
                        {exp.yearFrom && exp.yearTo && (
                          <span>
                            {exp.yearFrom}-{exp.yearTo}
                          </span>
                        )}
                      </div>
                      {exp.description && (
                        <div className="text-gray-500 text-xs mt-1">
                          {exp.description}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

          {application.education && application.education.length > 0 && (
            <Section title="Education">
              <ul className="divide-y divide-gray-100">
                {application.education.map((edu, idx) => (
                  <li key={idx} className="py-2">
                    <div className="font-semibold text-gray-900">
                      {edu.level} in {edu.branch}
                    </div>
                    <div className="text-sm text-gray-600">
                      {edu.institution} ({edu.university})
                    </div>
                    <div className="text-xs text-gray-500">
                      {edu.yearFrom && edu.yearTo && (
                        <span>
                          {edu.yearFrom}-{edu.yearTo}
                        </span>
                      )}
                      {edu.marks && <span> | Marks: {edu.marks}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {application.questionsAndAnswers &&
            application.questionsAndAnswers.length > 0 && (
              <Section title="Additional Information">
                <ul className="space-y-2">
                  {application.questionsAndAnswers.map((qa, idx) => (
                    <li key={idx} className="bg-gray-50 rounded p-3">
                      <div className="font-semibold text-gray-800">
                        Q: {qa.question}
                      </div>
                      <div className="text-green-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> A: {qa.answer}
                      </div>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

          {application.resume && (
            <Section title="Resume">
              <a
                href={`${application.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:underline font-semibold"
              >
                <FileText className="w-5 h-5" />
                Download Resume
              </a>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

const Info = ({ icon, label, value }) => (
  <div className="flex items-start gap-2">
    <span className="mt-1">{icon}</span>
    <div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="font-medium text-gray-800">{value || "N/A"}</div>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <h4 className="font-semibold text-base mb-2 text-blue-600">{title}</h4>
    <div className="bg-white border border-gray-100 rounded-lg px-4 py-3">
      {children}
    </div>
  </div>
);

export default ApplicationModal;
