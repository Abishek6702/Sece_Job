import React from "react";
import playstore from "../assets/playstore.svg";
import applestore from "../assets/applestore.svg";
import facebook from "../assets/facebook.svg";
import insta from "../assets/instagram.svg";
import linked from "../assets/linkedin.svg";
import twitter from "../assets/twitter.svg";
import copywright from "../assets/copywright.svg";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-sm text-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
         
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 flex-1">
            <div>
              <h4 className="font-semibold mb-3 text-[16px]">Company</h4>
              <ul className="space-y-2 text-[14px]">
                <li><a href="#">Blog</a></li>
                <li><a href="#">Career</a></li>
                <li><a href="#">News</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[16px]">Resources</h4>
              <ul className="space-y-2 text-[14px]">
                <li><a href="#">Accessibility</a></li>
                <li><a href="#">Partners</a></li>
                <li><a href="#">Employers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[16px]">Support</h4>
              <ul className="space-y-2 text-[14px]">
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms Of Use</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[16px]">About Us</h4>
              <ul className="space-y-2 text-[14px]">
                <li><a href="#">About Jobior</a></li>
                <li><a href="#">Work for Jobior</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6 ">
            <button className="flex items-center  gap-2 border rounded-full px-6 py-2 font-semibold justify-center">
              <img src={playstore} alt="Google Play" className="w-6 h-6" />
              Google Play
            </button>
            <button className="flex items-center gap-2 border rounded-full px-6 py-2  font-semibold justify-center">
              <img src={applestore} alt="App Store" className="w-6 h-6" />
              App Store
            </button>
          </div>
        </div>

        <div className="border-t pt-4 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-4">
            <img
              src={facebook}
              alt="Facebook"
              className="border rounded-full p-2 w-10 h-10 cursor-pointer"
            />
            <img
              src={insta}
              alt="Instagram"
              className="border rounded-full p-1 w-10 h-10 cursor-pointer"
            />
            <img
              src={twitter}
              alt="Twitter"
              className="border rounded-full p-2 w-10 h-10 cursor-pointer"
            />
            <img
              src={linked}
              alt="LinkedIn"
              className="border rounded-full p-1 w-10 h-10 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1 text-center">
           
            <img src={copywright} alt="Copyright" className="w-4 h-4" />
            <span className="text-gray-700 font-medium">2025 Jobior. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;