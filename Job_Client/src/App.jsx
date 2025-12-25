import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import ProtectedRoute from "./components/ProtectedRoute";

import LoginForm from "./components/LoginForm";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOtp from "./components/VerifyOtp";
import ResetPassword from "./components/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import Resumes from "./pages/Resumes";
import Companies from "./pages/Companies";
import ELearning from "./pages/ELearning";
import Network from "./pages/Network";
import JobApplicationForm from "./pages/JobApplicationForm";
import SubmitFormSucess from "./components/SubmitFormSucess";
import OnboardingForm from "./components/OnboardingForm";
import UserProfile from "./pages/UserProfile";
import JobBoard from "./pages/JobBoard";
import JobPostForm from "./components/JobPostForm";
import EmployerSideBar from "./components/EmployerSideBar";
import Footer from "./components/Footer";
import JobPostSucess from "./components/JobPostSucess";
import JobList from "./components/JobList";
import CompanyPostForm from "./components/CompanyPostForm";
import DeleteConfirmation from "./components/DeleteConfirmation";
import ExitConfirmation from "./components/ExitConfirmation";
import EmployerNavbar from "./components/EmployerNavbar";
import SignupForm from "./components/Signup";
import AutoCarousel from "./components/AutoCarousel";
import ApplicationListing from "./pages/ApplicationListing";
import AppliedJobs from "./components/AppliedJobs";
import LandingPage from "./pages/LandingPage";
import Profile from "./components/ProfileActivity";
import Feeds from "./pages/Feeds";
import Profile_Design from "./pages/profile/Profile_Design";
import NotificationPage from "./pages/NotificationPage";
import MainLayout from "./components/MainLayout";
import UserPublicProfile from "./pages/UserPublicProfile";
import Messages from "./pages/Messages";
import { ToastContainer } from "react-toastify";
import NotificationModal from "./pages/NotificationPage";
import InterviewPrepration from "./pages/InterviewPrepration";
import ScoreChecker from "./pages/ScoreChecker";
import Resume_Builder from "./components/ResumeSection/Resume_Builder";
import ScoreCheckerResult from "./components/ResumeSection/ScoreCheckerResult";

function App() {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.userId || decoded.id || null);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={1500} />
      <Routes>
        {/* PUBLIC ROUTES (NO TOKEN REQUIRED) */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/" element={<LandingPage />} />

        {/*PROTECTED ROUTES  */}
        <Route
          path="/onbordingform" 
          element={
            // <ProtectedRoute>
              <OnboardingForm />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/jobapplicationform"
          element={
            <ProtectedRoute>
              <JobApplicationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer-dashboard/*"
          element={
            <ProtectedRoute>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-post"
          element={
            <ProtectedRoute>
              <JobPostForm />
            </ProtectedRoute>
          }
        />
        <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

        {/* PROTECTED ROUTES (WITH NAVBAR VIA MAINLAYOUT)*/}
        {/* Protected routes make the navigate after closing and opening tabs if token expired navigate to main page */}
        <Route element={<MainLayout currentUserId={currentUserId} />}>
          
          <Route
            path="/employee-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resumes"
            element={
              <ProtectedRoute>
                <Resumes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <Companies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/e-learning"
            element={
              <ProtectedRoute>
                <ELearning />
              </ProtectedRoute>
            }
          />
          <Route
            path="/network"
            element={
              <ProtectedRoute>
                <Network />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submitsucess"
            element={
              <ProtectedRoute>
                <SubmitFormSucess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Employer-sidebar"
            element={
              <ProtectedRoute>
                <EmployerSideBar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/footer"
            element={
              <ProtectedRoute>
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-sucess"
            element={
              <ProtectedRoute>
                <JobPostSucess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-list"
            element={
              <ProtectedRoute>
                <JobList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company-post"
            element={
              <ProtectedRoute>
                <CompanyPostForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/delete-confirm"
            element={
              <ProtectedRoute>
                <DeleteConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exit-confirm"
            element={
              <ProtectedRoute>
                <ExitConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer-navbar"
            element={
              <ProtectedRoute>
                <EmployerNavbar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/curousel"
            element={
              <ProtectedRoute>
                <AutoCarousel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-application/:jobId"
            element={
              <ProtectedRoute>
                <ApplicationListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applied-jobs"
            element={
              <ProtectedRoute>
                <AppliedJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feeds"
            element={
              <ProtectedRoute>
                <Feeds />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-design"
            element={
              <ProtectedRoute>
                <Profile_Design />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationPage userId={currentUserId} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <UserPublicProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/*"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications_model"
            element={
              <ProtectedRoute>
                <NotificationModal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-prep"
            element={
              <ProtectedRoute>
                <InterviewPrepration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/score-checker"
            element={
              <ProtectedRoute>
                <ScoreChecker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-builder/:id"
            element={
              <ProtectedRoute>
                <Resume_Builder/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <ScoreCheckerResult/>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
