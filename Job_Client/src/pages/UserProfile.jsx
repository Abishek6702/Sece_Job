import React, { useEffect, useRef, useState } from "react";
import ProfileSidebarTabs from "./ProfileSidebarTabs.jsx";
import AboutTab from "../components/tabs/AboutTab";
import EducationTab from "../components/tabs/EducationTab";
import ExperienceTab from "../components/tabs/ExperienceTab";
import ResumeTab from "../components/tabs/ResumeTab";
import JobsTab from "../components/tabs/JobsTab";
import AppliedJobsTab from "../components/tabs/AppliedJobsTab";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useAppContext } from "../context/AppProvider";
import {
  MessageCircle,
  Pen,
  SquarePen,
  UserPlus,
  Power,
  X,
} from "lucide-react";
import OnboardingEditForm from "../components/OnboardingEditForm.jsx";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal.jsx";
import SkillsTab from "../components/tabs/SkillsTab.jsx";
import MyPostsTab from "../components/tabs/MyPostsTab.jsx";
import MySettingsTab from "../components/tabs/MySettingsTab.jsx";
import Loader from "../components/Loader.jsx";
const ALL_TABS = ["About", "Education", "Experience", "Resumes", "Skills"];

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId: routeUserId } = useParams(); // If you use route params for profile
  const [profile, setProfile] = useState(null);
  const [appliedJob, setAppliedJob] = useState([]);
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState(null);
  const { savedJobs, toggleSaveJob, appliedJobs } = useAppContext();
  const bannerImageInputRef = useRef(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [activeMain, setActiveMain] = useState("account");
  const [activeSub, setActiveSub] = useState("About");
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const profileImageInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  // Responsiveness (true if < md)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Get logged-in user ID
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  // Fetch profile and applied jobs (same as before)
  useEffect(() => {
    const fetchProfile = async () => {
      const fetchId = routeUserId || userId;
      if (!fetchId) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/${fetchId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [userId, token, routeUserId]);

  useEffect(() => {
    if (!userId || !token) return;
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/applications/${userId}/applied-jobs`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const applications = Array.isArray(response.data.appliedJobs)
          ? response.data.appliedJobs
          : [];
        if (applications.length === 0) {
          setAppliedJob([]);
          return;
        }
        const jobDetails = await Promise.all(
          applications.map(async (app) => {
            const jobRes = await axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/api/jobs/${app}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { ...jobRes.data, applicationData: app };
          })
        );
        const validJobs = jobDetails.filter((job) => job && job._id);
        setAppliedJob(validJobs);
      } catch (error) {
        console.error("Error fetching applied jobs", error);
      }
    };
    fetchAppliedJobs();
  }, [userId, token, setAppliedJob]);

  // ...same as before: image handlers, logout, etc

  if (!profile) {
    return (
      <div className="flex flex-col justify-center items-center text-gray-500 py-20 w-full h-full">
        <Loader />
        <p className="mt-4">Loading Profile...</p>
      </div>
    );
  }

  // Safe check for onboarding
  const onboarding = profile.onboarding || {};
  const fullName = onboarding.firstName
    ? `${onboarding.firstName} ${onboarding.lastName}`
    : profile.name;

  const isOwnProfile = userId && profile && userId === profile._id;

  // Main tab content unchanged
  const renderDetail = () => {
    if (activeMain === "account") {
      switch (activeSub) {
        case "About":
          return <AboutTab profile={profile} />;
        case "Education":
          return (
            <EducationTab education={profile.onboarding?.education || []} />
          );
        case "Experience":
          return (
            <ExperienceTab experience={profile.onboarding?.experience || []} />
          );
        case "Resumes":
          return <ResumeTab onboarding={profile.onboarding} />;
        case "Skills":
          return <SkillsTab onboarding={profile.onboarding} />;
        default:
          return null;
      }
    }
    if (activeMain === "saved" && isOwnProfile) {
      return (
        <JobsTab
          jobs={profile.savedJobs || []}
          savedJobs={savedJobs || []}
          appliedJobs={appliedJobs || []}
          toggleSaveJob={toggleSaveJob}
          onApply={() => {}}
        />
      );
    }
    if (activeMain === "applied" && isOwnProfile) {
      return (
        <AppliedJobsTab
          jobs={appliedJob || []}
          savedJobs={savedJobs || []}
          toggleSaveJob={toggleSaveJob}
        />
      );
    }
    if (activeMain === "myPosts" && isOwnProfile) {
      return <MyPostsTab userId={userId} token={token} profile={profile} />;
    }
    if (activeMain === "settings" && isOwnProfile) {
      return <MySettingsTab userId={userId} token={token} />;
    }
    return null;
  };

  const handleLogout = () => {
    toast.info("Logout Successful");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const ACCOUNT_SUBTAB_CONTENT = [
    { label: "About", content: <AboutTab profile={profile} /> },
    {
      label: "Education",
      content: <EducationTab education={profile.onboarding?.education || []} />,
    },
    {
      label: "Experience",
      content: (
        <ExperienceTab experience={profile.onboarding?.experience || []} />
      ),
    },
    {
      label: "Resumes",
      content: <ResumeTab onboarding={profile.onboarding} />,
    },
    { label: "Skills", content: <SkillsTab onboarding={profile.onboarding} /> },
  ];

  // ---- PROFILE RENDER (responsive layout) ----
  return (
    <div className="main_container bg-[#f8fafc] min-h-[100vh]">
      <div className="w-full sm:w-[95%] md:w-[80%] min-h-[90vh] m-auto mb-20 bg-white rounded-2xl mt-6 overflow-hidden border border-gray-300 shadow-md">
        {/* Banner */}
        <div className="relative h-40 bg-gray-100 rounded-t-2xl overflow-hidden">
          {profile.onboarding?.banner ? (
            <img
              src={`${
                profile.onboarding.banner
              }`}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No banner image</span>
            </div>
          )}
          {isOwnProfile && (
            <>
              <button
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                onClick={() => bannerImageInputRef.current?.click()}
                title="Change banner image"
              >
                <SquarePen />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={bannerImageInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("banner", file);
                  axios
                    .put(
                      `${
                        import.meta.env.VITE_API_BASE_URL
                      }/api/onboarding/banner-image`,
                      formData,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    )
                    .then(() => window.location.reload())
                    .catch(() => alert("Failed to upload banner image."));
                }}
              />
            </>
          )}
        </div>
        {/* Profile Info Row */}
        <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 pt-4 pb-6 gap-3 md:gap-0">
          {/* Left: profile pic + info */}
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative">
              <img
                src={
                  profile.onboarding?.profileImage
                    ? `${
                        profile.onboarding.profileImage
                      }`
                    : undefined
                }
                alt="Profile"
                className="w-24 md:w-28 h-24 md:h-28 rounded-full border-4 border-white object-cover shadow -mt-12 md:-mt-14"
              />
              <input
                type="file"
                accept="image/*"
                ref={profileImageInputRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("profileImage", file);
                  axios
                    .put(
                      `${
                        import.meta.env.VITE_API_BASE_URL
                      }/api/onboarding/profile-image`,
                      formData,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    )
                    .then(() => window.location.reload())
                    .catch(() => alert("Failed to upload profile image."));
                }}
              />
              {isOwnProfile && (
                <button
                  className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                  onClick={() => profileImageInputRef.current?.click()}
                  title="Change profile photo"
                >
                  <SquarePen />
                </button>
              )}
            </div>
            <div className="ml-0 md:ml-4 mt-3 md:mt-0 text-center md:text-left">
              <p className="font-semibold text-lg md:text-xl">{fullName}</p>
              <p className="text-gray-500 mt-1">
                {onboarding.preferredRoles?.[0] || "Professional"}
              </p>
              <button
                onClick={() => navigate("/network?tab=connections")}
                className="text-blue-500 font-bold hover:underline"
              >
                {profile.connections.length} Connections
              </button>
            </div>
          </div>
          {/* Right: buttons */}
          <div className="flex gap-2 mt-4 md:mt-0">
            {!isOwnProfile && (
              <>
                <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full font-medium flex items-center gap-2 hover:bg-blue-700 transition">
                  <UserPlus size={18} />
                  Follow
                </button>
                <button className="border border-blue-600 text-blue-600 px-4 py-1.5 rounded-full font-medium flex items-center gap-2 hover:bg-blue-50 transition">
                  <MessageCircle size={18} />
                  Message
                </button>
                <button
                  className="flex items-center h-12 px-6 border rounded-full text-red-600 font-semibold text-lg cursor-pointer hover:bg-red-100 transition"
                  onClick={() => setShowModal(true)}
                >
                  <Power className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </>
            )}
            {isOwnProfile && (
              <>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="text-white bg-blue-600 px-4 py-1.5 rounded-full font-medium flex items-center gap-2 hover:bg-blue-700 transition"
                >
                  <Pen size={18} />
                  Update
                </button>
                <button
                  className="flex items-center h-12 px-6 border rounded-full text-red-600 font-semibold text-lg cursor-pointer hover:bg-red-100 transition"
                  onClick={() => setShowModal(true)}
                >
                  <Power className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
        {/* Modal for confirm logout */}
        {showModal && (
          <ConfirmModal
            title="Confirm Logout"
            message="Are you sure you want to logout?"
            onConfirm={() => {
              setShowModal(false);
              handleLogout();
            }}
            onCancel={() => setShowModal(false)}
          />
        )}
        {/* Modal for Edit Form */}
        {showEditForm && (
          <div
            className="fixed inset-0 tint flex items-center justify-center z-50 bg-black/20"
            onClick={() => setShowCloseConfirm(true)}
          >
            <div
              className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative border h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setShowCloseConfirm(true)}
                aria-label="Close modal"
              >
                <X />
              </button>
              <OnboardingEditForm
                initialData={profile.onboarding}
                onClose={() => setShowEditForm(false)}
              />
              {showCloseConfirm && (
                <ConfirmModal
                  title="Discard Changes?"
                  message="Are you sure you want to close? Any unsaved changes will be lost."
                  onConfirm={() => {
                    setShowEditForm(false);
                    setShowCloseConfirm(false);
                  }}
                  onCancel={() => setShowCloseConfirm(false)}
                  confirmLabel="Close"
                />
              )}
            </div>
          </div>
        )}
        {/* --- RESPONISVE TABS & CONTENT --- */}
        <div className="w-full px-0 sm:px-2 md:px-6 py-0 md:py-2">
          <div className="block md:flex md:gap-6 w-full">
            <div className="w-full md:w-64 sticky top-20 z-20 ">
              {/* Horizontal mobile, vertical desktop */}
              <div className="block md:hidden ">
                <ProfileSidebarTabs
                  activeMain={activeMain}
                  setActiveMain={setActiveMain}
                  activeSub={activeSub}
                  setActiveSub={setActiveSub}
                  isOwnProfile={true}
                  tabs={ALL_TABS}
                  orientation="horizontal"
                  showOnlyMainTabs={false}
                  subTabContents={ACCOUNT_SUBTAB_CONTENT}
                />
              </div>
              <div className="hidden md:block">
                <ProfileSidebarTabs
                  activeMain={activeMain}
                  setActiveMain={setActiveMain}
                  activeSub={activeSub}
                  setActiveSub={setActiveSub}
                  isOwnProfile={true}
                  tabs={ALL_TABS}
                  showOnlyMainTabs={false}
                  orientation="vertical"
                  subTabContents={[]}
                />
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 w-full bg-gray-50 rounded-2xl min-h-[300px] p-2 sm:p-4 md:p-6 shadow-inner">
              {(activeMain !== "account" || !isMobile) && renderDetail()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
