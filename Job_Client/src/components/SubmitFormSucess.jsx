import React from "react";
import Submit from "../assets/submit.png";
import { Navigate, useNavigate } from "react-router-dom";
const Submitform = () => {
  const navigate = useNavigate();
  return (
    <div className="maincontainer flex justify-center items-center p-4 bg-white">
      <div className="container-1 w-full max-w-4xl rounded-xl ">
        <div className="container-logo flex justify-center">
          <img src={Submit} className="w-3/4 sm:w-1/2 md:w-2/5 lg:w-[60%] " alt="submit" />
        </div>

        <div className="container-content-1 text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            Your Application Has Been
          </h1>
          <h1 className="text-xl sm:text-2xl font-semibold text-blue-600 mt-2">
            Submitted!
          </h1>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-start sm:items-center gap-2 text-sm sm:text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="25"
              fill="green"
              className="bi bi-check-circle mt-1"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
            </svg>
            <p className="text-gray-700">
              You will get email confirmation at{" "}
              <span className="font-medium text-black">john@gmail.com</span>
            </p>
          </div>

          <div className="flex flex-wrap items-start sm:items-center gap-2 text-sm sm:text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="25"
              fill="green"
              className="bi bi-check-circle mt-1"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
            </svg>
            <p className="text-gray-700">
              This employer typically responds to applications within 1 day
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h1 className="font-semibold text-lg sm:text-xl mb-1">
            Keep track of your applications
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            You will receive a status update in an email from Jobior within a few weeks of submitting your application. In the meantime, you can view and track all your applications in the Jobior My Jobs section at any time.
          </p>
          <h1 className="text-sm sm:text-base underline font-semibold text-[#6532C1] mt-3 cursor-pointer">
            Check your applications on Recent Activities
          </h1>
        </div>

        <div className="flex justify-center items-center  bordrer m-auto  bg-black rounded-full py-4 px-4 mt-4 w-[30%]">
          <button onClick={()=>{
            navigate("/jobs");
          }} className="font-semibold text-white cursor-pointer">Return to job  search</button>
        </div>
      </div>
    </div>
  );
};

export default Submitform;