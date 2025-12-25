import React, { useState } from "react";
import { UserPlus, MessageCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import Profile_Design_Tabs from "./Profile_Design_Tabs";

const mainTabs = [
  {
    key: "account",
    label: "Account Preferences",
    children: [
      "Personal Information",
      "Education",
      "Experience",
      "Resumes"
    ]
  },
  { key: "saved", label: "Saved Jobs" },
  { key: "applied", label: "Applied Jobs" },
  { key: "logout", label: "Logout" }
];

const Profile_Design = () => {
  const [activeMain, setActiveMain] = useState("account");
  const [activeSub, setActiveSub] = useState("Personal Information");

  const renderDetail = () => {
    if (activeMain === "account") {
      switch (activeSub) {
        case "Personal Information":
          return <div className="p-6">Personal Information Content</div>;
        case "Education":
          return <div className="p-6">Education Content</div>;
        case "Experience":
          return <div className="p-6">Experience Content</div>;
        case "Resumes":
          return <div className="p-6">Resumes Content</div>;
        default:
          return null;
      }
    }
    if (activeMain === "saved") {
      return <div className="p-6">Saved Jobs Content</div>;
    }
    if (activeMain === "applied") {
      return <div className="p-6">Applied Jobs Content</div>;
    }
    
    return null;
  };

  return (
    <>
      <Navbar />
      <div className="w-[80%] h-[100vh] m-auto mb-20 bg-white rounded-2xl mt-6 overflow-hidden border border-gray-300">
        <div>
          <div className="relative h-32 sm:h-40 bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
              alt="Cover"
              className="w-full h-full object-cover rounded-t-2xl"
            />
            <div className="absolute -bottom-20 left-6">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Profile"
                className="w-30 h-30 rounded-full border-4 border-white object-cover shadow"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center px-16 pt-4 pb-6">
            <div className="flex items-center">
              <div className="ml-24">
                <div className="font-semibold text-lg">Ben Goro</div>
                <div className="text-gray-500 text-sm">367 friends</div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <button className="bg-blue-600 text-white px-5 py-1.5 rounded-full font-medium flex items-center gap-2 ">
                <UserPlus size={18} />
                Follow
              </button>
              <button className="border border-blue-600 text-blue-600 px-5 py-1.5 rounded-full font-medium flex items-center gap-2 ">
                <MessageCircle size={18} />
                Message
              </button>
            </div>
          </div>
        </div>

        <div className="w-[95%] m-auto mt-6 flex gap-6 h-full ">
          <Profile_Design_Tabs
            activeMain={activeMain}
            setActiveMain={setActiveMain}
            activeSub={activeSub}
            setActiveSub={setActiveSub}
          />
          <div className="w-full shadow rounded-2xl bg-gray-50 min-h-[300px]">
            {renderDetail()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile_Design;
