import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  User,
  Locate,
  BriefcaseBusiness,
} from "lucide-react";

const AboutTab = ({ profile }) => {
  const onboarding = profile.onboarding || {};
  const fullName =
    [onboarding.firstName, onboarding.lastName].filter(Boolean).join(" ") ||
    profile.name;

  return (
    <div className=" rounded-2xl p-8">
     

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-base">
        <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-4 ">
          <Mail size={20} className="text-blue-500" />
          <span className="text-gray-700">
            {onboarding.email || profile.email}
          </span>
        </div>

        <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-4">
          <Phone size={20} className="text-blue-500" />
          <span className="text-gray-700">
            {onboarding.phone || profile.phone || "Phone not provided"}
          </span>
        </div>
        <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-4">
          <Locate size={20} className="text-blue-500" />
          <span className="text-gray-700">
            {" "}
            {onboarding.location || "Location not specified"}
          </span>
        </div>
        <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-4">
          <BriefcaseBusiness size={20} className="text-blue-500" />
          <span className="text-gray-700">
            {onboarding.preferredRoles &&
            onboarding.preferredRoles.filter(Boolean).length > 0
              ? onboarding.preferredRoles.filter(Boolean)[0]
              : "Not specified"}
          </span>
        </div>

      </div>
    </div>
  );
};

export default AboutTab;
