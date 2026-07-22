import React from "react";
import {
  X,
  Mail,
  Phone,
  Calendar,
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  DollarSign,
  FileText,
} from "lucide-react";

const EmployerDrawer = ({ isOpen, employer, onClose }) => {
  if (!isOpen || !employer) return null;

  const company = employer.company;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full max-w-xl bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
          <div className="flex items-center gap-4">
            {company?.company_logo ? (
              <img
                src={company.company_logo}
                alt={company.company_name}
                className=" w-16 rounded-xl object-fit"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-green-500 text-2xl font-bold text-white">
                {employer.name?.charAt(0)}
              </div>
            )}

            <div>
              <h2 className="text-xl text-gray-700 font-bold">
                {company?.company_name || employer.name}
              </h2>

              <p className="text-sm text-gray-500">
                {company?.company_type || "Employer"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 bg-gray-100 cursor-pointer"
          >
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="h-[calc(100vh-88px)] overflow-y-auto p-6 space-y-8">
        

          {/* Company */}
          <section>
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Company Information</h3>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex items-center gap-3">
                <Building2 size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Company</p>

                  <p>{company?.company_name || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <span>{employer.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <span>{employer.phone}</span>
              </div>



              <div className="flex items-center gap-3">
                <Briefcase size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Type</p>

                  <p>{company?.company_type || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>

                  <p>{company?.location || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Founded</p>

                  <p>{company?.founded || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Employees</p>

                  <p>{company?.employee_count || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Followers</p>

                  <p>{company?.followers_count || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Revenue</p>

                  <p>{company?.revenue || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Website</p>

                  {company?.site_url ? (
                    <a
                      href={company.site_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* About */}
          {company?.about?.content && (
            <section>
              <h3 className="mb-3 text-lg font-semibold text-gray-700">About Company</h3>

              <p className="leading-7 text-gray-600">{company.about.content}</p>
            </section>
          )}

          {/* Images */}
          {company?.images?.length > 0 && (
            <section>
              <h3 className="mb-3 text-lg font-semibold text-gray-700">Company Images</h3>

              <div className="grid grid-cols-2 gap-4">
                {company.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt=""
                    className="h-40 w-full rounded-xl  object-cover"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployerDrawer;
