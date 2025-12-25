import React from "react";
import Navbar from "../components/Navbar";

const UserDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="main_container grid grid-cols-4 p-4">
        <div className="welcome_card border border-gray-600 rounded-lg">
          <p className="w-[100%] p-4 font-bold text-2xl flex justify-center items-center">Welcome User !!!</p>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
