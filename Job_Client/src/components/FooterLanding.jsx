import React from "react";

const FooterLanding = () => {
  return (
    <footer className="bg-[#2b7fff] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
  
  {/* Brand Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white text-[#2b7fff] font-bold text-lg flex items-center justify-center rounded-full shadow-md">
              Q
            </div>
            <span className="text-2xl font-semibold">Sri Eshwar|Carrer Connect</span>
          </div>
          <p className="text-sm max-w-xs leading-relaxed opacity-90">
            Launch your own Software As A Service Application with QuantumPulse Technologies.
          </p>
        </div>

        {/* Newsletter Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
          <p className="text-sm mb-4 opacity-90">
            Subscribe to our newsletter to get the latest updates.
          </p>
          <form className="flex bg-white rounded-full overflow-hidden shadow-md">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 text-black text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-[#1a5ed2] text-white px-5 py-2 text-sm font-medium hover:bg-[#144db0] transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>


      {/* Footer Bottom */}
      <div className="mt-12 border-t border-white/30 pt-6 text-center text-sm opacity-90">
        © {new Date().getFullYear()} QuantumPulse Technologies Pvt. Ltd. All Rights Reserved.
      </div>
    </footer>
  );
};

export default FooterLanding;