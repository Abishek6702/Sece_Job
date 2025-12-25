import React, { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", to: "home" },
    { name: "About", to: "about" },
    // { name: "Blogs", to: "portfolio" },
    // { name: "Services", to: "services" },
    { name: "Contact", to: "contact" },
  ];

  return (
    <nav
      className={`w-full px-6 md:px-16 lg:px-24 py-5 fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between w-full h-[70px]">
        
        {/* Logo */}
        <h1 className=" lg:text-2xl text-1xl font-bold text-gray-900">Sri Eshwar <span className="text-[#155dfc]">Carrer Connect</span></h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <ScrollLink
              key={item.to}
              to={item.to}
              smooth={true}
              duration={500}
              offset={-70} // adjust for navbar height
              className="cursor-pointer text-gray-900 hover:text-blue-600 font-medium transition"
            >
              {item.name}
            </ScrollLink>
          ))}
          <Link
            to="/login"
            className="font-bold py-2 px-4 rounded-2xl bg-blue-700 hover:bg-blue-900 text-white transition"
          >
            Login / Signup
          </Link>
        </div>

        {/* Mobile - Login + Hamburger */}
        <div className="md:hidden flex items-center gap-4">
          <Link
            to="/login"
            className="font-bold py-2 px-4 rounded-xl bg-blue-600 text-white transition"
          >
            Login
          </Link>
          <button
            className="text-gray-900 focus:outline-none"
            onClick={() => setMenuOpen(true)}
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 border-b border-gray-300">
          <button onClick={() => setMenuOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Links */}
        <div className="flex flex-col gap-4 px-6 py-4">
          {navItems.map((item) => (
            <ScrollLink
              key={item.to}
              to={item.to}
              smooth={true}
              duration={500}
              offset={-70}
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer text-gray-900 text-lg"
            >
              {item.name}
            </ScrollLink>
          ))}
        </div>
      </div>

      {/* Overlay when menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}