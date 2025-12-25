import React, { useState, useEffect } from "react";
import img1 from "../assets/scroll_1.jpg";
import img2 from "../assets/scroll_2.jpg";
import img3 from "../assets/scroll_3.jpg";

import loginimg from "../assets/login.jpg";
// const slides = [
//   {
//     image: img1,
//     title: "Login to your account",
//     subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et",
//   },
//   {
//     image: img2,
//     title: "Explore our services",
//     subtitle: "Discover solutions tailored to your business needs and goals.",
//   },
//   {
//     image: img3,
//     title: "Join our community",
//     subtitle: "Be part of a network that values innovation and growth.",
//   },
// ];

const AutoCarousel1 = () => {
  // const [current, setCurrent] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrent((prev) => prev + 1);
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, []);

  // const displayIndex = current % slides.length;

  return (
    <>
      {" "}
      <div className="w-[100%] h-[100vh] relative overflow-hidden">
        {/* <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${displayIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-[100vh] relative">
            <img src={slide.image} alt={`Slide ${index}`} className="w-full h-full object-cover" />
            <div className="  absolute bottom-[10%] left-0 right-0  p-6 text-white">
              <h2 className="text-3xl font-semibold mb-2">{slide.title}</h2>
              <p className="text-lg">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              displayIndex === index ? "bg-blue-600" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div> */}
        <img src={loginimg} className="w-[100%] h-[100%] relative" />
        <div className="absolute top-26 left-30 text-white font-bold text-xl leading-relaxed w-[73%] ">
          <p className="text-3xl ">
            Your career starts here — sign in to explore opportunities
          </p>
          <p className="text-lg font-semibold text-gray-100 mt-4">
            Lorem Ipsum has been the industry's standard dummy text ever since
          </p>
        </div>
        <div className=" absolute bottom-6 right-4 font-bold text-white leading-relaxed ">
          {" "}
          <p>© 2025 QuantumPulse Technologies Pvt. Ltd. All Rights Reserved</p>
        </div>
      </div>
    </>
  );
};

export default AutoCarousel1;