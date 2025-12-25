import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = ({ currentUserId }) => (
  <>
    <Navbar currentUserId={currentUserId} />
    <Outlet />
  </>
);

export default MainLayout;
