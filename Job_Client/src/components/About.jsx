import React from "react";
import team from "../assets/about_team.svg";
const About = () => {
  return (
    <section id="about" className="id:about flex flex-col mt-[-50px]  md:flex-row items-center bg-white rounded-2xl shadow-md px-8 md:px-12 max-w-5xl mx-auto mb-10 relative overflow-hidden">
    
      <div className="md:w-1/2 z-10">
        <p className="text-blue-600 font-semibold mb-2 text-2xl">About Us</p>
        <h2 className="text-3xl font-bold mb-4">
          Boost Your <br /> Career With US
        </h2>
        <p className="text-gray-600 mb-6">
          We connect job seekers with top employers, offering smarter 
          opportunities for growth. Our platform makes job searching simple, 
          efficient, and rewarding, helping you achieve career success with the right match.
        </p>
        <button className="bg-blue-500  text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200 flex items-center gap-2">
          Know More
          <svg
            width="16"
            height="14"
            viewBox="0 0 16 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className=""
          >
            <path
              d="M8.39011 0.549296C8.11973 0.815871 8.09437 1.2371 8.31601 1.53265L8.38259 1.60993L12.9583 6.25004L1.25 6.25004C0.835787 6.25004 0.5 6.58583 0.5 7.00004C0.5 7.38239 0.786114 7.69792 1.15592 7.7442L1.25 7.75004H12.9583L8.38259 12.3902C8.11601 12.6605 8.09663 13.0821 8.32245 13.3745L8.39011 13.4508C8.66049 13.7174 9.08204 13.7367 9.37442 13.5109L9.45074 13.4433L15.2841 7.5266C15.548 7.25892 15.57 6.84245 15.3501 6.54997L15.2841 6.47348L9.45074 0.556818C9.15994 0.261855 8.68507 0.258488 8.39011 0.549296Z"
              fill="white"
            />
          </svg>
        </button>
      </div>

      <div className="md:w-1/2 flex justify-center mt-8 md:mt-0 ">
        <img
          src={team}
          alt="Team working"
          className="rounded w-full max-w-md object-cover shadow-lg "
        />
      </div>
    </section>
  );
};

export default About;