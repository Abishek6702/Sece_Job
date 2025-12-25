import React, { useEffect, useState } from "react";
import EmployerSideBar from "../components/EmployerSideBar";
import JobList from "../components/JobList";
import { Route, Routes, useNavigate } from "react-router-dom";
import EmployerNavbar from "../components/EmployerNavbar";
import { jwtDecode } from "jwt-decode";
import EmployerProfile from "./EmployerProfile";
import CandidatesApplications from "../components/CandidatesApplications";
import ApplicationListing from "../pages/ApplicationListing";
import Interviews from "./Interviews";
import InProgressApplicationsPage from "../components/InProgressApplicationsPage";
import SelectedNotSelected from "./SelectedNotSelected";
import SelectedApplications from "../components/SelectedApplications";
import EmployerMessagePage from "./EmployerMessagePage";
const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [firstTimeLogin, setFirstTimeLogin] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setFirstTimeLogin(decoded.firstTimeLogin === true);
        setEmail(decoded.email || "User");
        console.log("firstTimeLogin:", decoded.firstTimeLogin);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <EmployerSideBar />
      <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100 border">
        <EmployerNavbar />
        <div className="flex-1 p-6">
          {firstTimeLogin ? (
            <div className="bg-white shadow-md rounded p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">
                👋 Welcome, {email}!
              </h2>
              <p className="mb-4 text-gray-600">
                To start posting jobs, you need to complete your company
                profile.
              </p>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => navigate("/company-post")}
              >
                Complete Company Profile
              </button>
            </div>
          ) : (
            <Routes>
              <Route index element={<JobList />} />
              <Route path="/employer-profile" element={<EmployerProfile />} />
              <Route
                path="/candidates-application"
                element={<CandidatesApplications />}
              />
              <Route
                path="/job-application/:jobId"
                element={<ApplicationListing />}
              />
              <Route path="/interviews" element={<Interviews />} />
              <Route
                path="/in-progress-application/:jobId"
                element={<InProgressApplicationsPage />}
              />
              <Route
                path="/selected-application/:jobId"
                element={<SelectedApplications />}
              />
              <Route
                path="/selectednotselected"
                element={<SelectedNotSelected />}
              />
              <Route path="employermessages/*" element={<EmployerMessagePage />} />


            </Routes>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
