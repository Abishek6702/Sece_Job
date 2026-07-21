import { X, FileText } from "lucide-react";

const EmployeeDrawer = ({ isOpen, onClose, employee }) => {
  if (!employee) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 visible backdrop-blur-xs"
            : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[30%] bg-white shadow-2xl z-50 transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-50">
          <h2 className="text-xl font-semibold text-gray-700">
            Employee Details
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 transition-colors duration-200 text-gray-700 cursor-pointer"
          >
            <X />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Banner */}
          <div className="relative">
            <img
              src={
                employee?.onboarding?.banner ||
                "https://placehold.co/600x180/e5e7eb/6b7280?text=No+Banner"
              }
              alt="Banner"
              className="h-36 w-full rounded-xl object-cover"
            />

            <img
              src={
                employee?.onboarding?.profileImage ||
                `https://ui-avatars.com/api/?name=${employee.name}&background=2563eb&color=fff`
              }
              alt={employee.name}
              className="absolute -bottom-10 left-6 h-20 w-20 rounded-full border-4 border-white object-cover shadow-md"
            />
          </div>

          {/* Basic Details */}
          <div className="pt-10 flex justify-between items-start">
            <div className="">
              <h2 className="text-2xl font-bold text-gray-800">
                {employee.name}
              </h2>

              <p className="text-gray-600">
                {employee?.onboarding?.preferredRoles?.join(", ") ||
                  "No preferred role"}
              </p>

              <div className="mt-2 space-y-1 text-sm text-gray-500">
                <p>{employee.email}</p>
                <p>{employee.phone}</p>

                {employee?.onboarding?.location && (
                  <p>{employee.onboarding.location}</p>
                )}
              </div>
            </div>
            <div className="">
              {employee?.onboarding?.resume && (
                <button
                  onClick={() =>
                    window.open(employee.onboarding.resume, "_blank")
                  }
                  className="flex w-full items-center cursor-pointer justify-center gap-2 rounded-lg bg-blue-600 p-3 font-medium text-white transition hover:bg-blue-700"
                >
                  Resume
                  <FileText size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Skills */}
          {employee?.onboarding?.skills?.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {employee.onboarding.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {employee?.onboarding?.experience?.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                Experience
              </h3>

              <div className="space-y-4">
                {employee.onboarding.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <h4 className="font-semibold text-gray-800">{exp.title}</h4>

                    <p className="text-sm font-medium text-blue-600">
                      {exp.company}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(exp.yearFrom).getFullYear()} -{" "}
                      {exp.yearTo
                        ? new Date(exp.yearTo).getFullYear()
                        : "Present"}
                    </p>

                    <p className="text-sm text-gray-500">{exp.location}</p>

                    {exp.description && (
                      <p className="mt-2 text-sm text-gray-700">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {employee?.onboarding?.education?.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                Education
              </h3>

              <div className="space-y-4">
                {employee.onboarding.education.map((edu, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <h4 className="font-semibold text-gray-800">
                      {edu.level} - {edu.branch}
                    </h4>

                    <p className="text-sm text-blue-600">{edu.institution}</p>

                    <p className="text-sm text-gray-500">
                      {new Date(edu.yearFrom).getFullYear()} -{" "}
                      {new Date(edu.yearTo).getFullYear()}
                    </p>

                    <p className="text-sm text-gray-500">Marks: {edu.marks}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeDrawer;
