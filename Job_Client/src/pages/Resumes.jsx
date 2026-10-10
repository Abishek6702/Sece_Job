import React from "react";
import Resume from "../components/ResumeSection/Resume";
import SavedResume from "../components/ResumeSection/SavedResume";

const Resumes = () => {
  return (
    <>
      <div className="w-[98%]  m-auto mt-1 ">
        <SavedResume/>
      </div>
      <div className="w-[98%]  m-auto mt-1 ">
        <Resume />
      </div>
    </>
  );
};

export default Resumes;
