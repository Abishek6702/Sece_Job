import React from "react";
import Manimage from "../assets/Pic.png";
// import Manimage from '../assets/pi'
import RoundedImage from "../assets/Pattern.png"; // Use this for geometric background
// import { useMediaQuery } from 'react-responsive';
// import { Group } from "lucide-react";
import Group from "../assets/Group (1).png";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const isMobile = window.innerWidth < 640; // Or use useMediaQuery from react-responsive package for a robust solution

  return (
    <section id="home" className="relative id:home flex flex-col-reverse md:flex-row items-center justify-between w-full min-h-[60vh] bg-[#F8F8FD] overflow-hidden  ">
      {/* Left Section: Text */}
      <div className="relative w-full md:w-1/2 flex flex-col justify-center items-center space-y-5 px-4 md:px-16 lg:px-24 mt-16 text-center mb-10 md:mb-0">
      {/* Main headline with underline/striker */}
      <h1 className="text-2xl xs:text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 leading-snug mb-4 relative">
        Discover
        more than{" "}
        <span className="relative z-10">
          5000+ Jobs
          <img src={Group} className="mt-4 hidden md:block mx-auto" />
        </span>
      </h1>

      <p className="text-md md:text-lg text-gray-600 max-w-[380px] mb-6">
        Discover opportunities that match your skills, passion, and ambition. Your career growth starts here.
      </p>

      {/* Buttons row */}
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div className="flex flex-row items-center gap-3 justify-center bg-blue-600 text-white w-[194px] h-[50px] rounded-4xl">
          <button className="text-xl">Contact</button>
          <button className="mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 
                .708-.708l4 4a.5.5 0 0 1 
                0 .708l-4 4a.5.5 0 0 1 
                -.708-.708L13.293 8.5H1.5A.5.5 0 
                0 1 1 8"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-row items-center gap-2">
          <h6 className="text-xl font-medium">See Live Demo</h6>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="blue"
            className="bi bi-play-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 
            16 0M6.79 5.093A.5.5 0 0 0 6 
            5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 
            0 0 0 0-.814z" />
          </svg>
        </div>
      </div>
    </div>


      {/* Right Section: Image and background design (desktop only) */}
      {!isMobile && (
        <div className="w-[80%] flex justify-end items-center relative z-0 ">
          {/* Geometric background pattern/lines */}
          <img
            src={RoundedImage}
            alt="background lines"
            className="absolute right-0 top-0 w-[150%] h-full object-cover z-0 pointer-events-none  "
            // style={{ opacity: 0.22 }}
          />
          {/* Main person image */}
          <img
            src={Manimage}
            alt="Person hero"
            className="relative w-[300px] h-auto z-10 "
            style={{ marginRight: '84px', marginTop: '92px' }}
          />
        </div>
      )}
    </section>
  );
}