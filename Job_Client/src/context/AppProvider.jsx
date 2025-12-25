import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [resetEmail, setResetEmail] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  //  Get userId  from token
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        return decoded.id;
      }
    } catch (error) {
      console.error("Invalid token", error);
    }
    return null;
  };

  //  Fetch saved jobs
  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/jobs/saved`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const savedIds = res.data.savedJobs.map((job) => job._id);
      setSavedJobs(savedIds);
    } catch (err) {
      console.error("Error fetching saved jobs", err);
    }
  };

  // Fetch applied jobs using userId
  const fetchAppliedJobs = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/applications/${userId}/applied-jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppliedJobs(response.data.appliedJobs || []);
    } catch (error) {
      console.error("Error fetching applied jobs", error);
    }
  };

  // Toggle save job logic
  const toggleSaveJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/jobs/toggle-save-job`,
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSavedJobs((prev) =>
        prev.includes(jobId)
          ? prev.filter((id) => id !== jobId)
          : [...prev, jobId]
      );
    } catch (err) {
      console.error("Error saving job", err.response?.data || err.message);
    }
  };

  // Fetch jobs on component mount with valid user ID
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      fetchSavedJobs();
      fetchAppliedJobs(userId);
    }
  }, []);

  const value = {
    resetEmail,
    setResetEmail,
    savedJobs,
    toggleSaveJob,
    appliedJobs,
    fetchAppliedJobs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
