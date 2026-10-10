import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function isTokenValid() {
  const token = localStorage.getItem("carvion-key");
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp > currentTime) {
      return true;
    }
    localStorage.removeItem("carvion-key");
    return false;
  } catch {
    localStorage.removeItem("carvion-key");
    return false;
  }
}

const ProtectedRoute = ({ children }) => {
  if (!isTokenValid()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
