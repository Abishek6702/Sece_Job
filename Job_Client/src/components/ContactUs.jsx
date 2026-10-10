import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Globe,
  FacebookIcon,
  Github,
} from "lucide-react";
import axios from "axios";

const icons = [
  { component: FacebookIcon, href: "#" },
  { component: Globe, href: "#" },
  { component: Instagram, href: "#" },
  { component: Github, href: "#" },
  { component: Twitter, href: "#" },
];

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState(null); // success or error message
  const [loading, setLoading] = useState(false); // button loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true); // start loading

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/contact`,
        formData
      );
      if (res.data.success) {
        setStatus({ type: "success", text: "Message sent successfully!" });
        setFormData({ name: "", phone: "", email: "", message: "" });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", text: "Failed to send message. Try again." });
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <section id="contact" className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto my-16 px-8 rounded-2xl shadow-md">
      {/* Left side */}
      <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10 px-4">
        <p className="text-blue-600 font-semibold text-2xl mb-2">Contact Us</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-snug">
          We’d Love to  <br /> Hear From You
        </h2>
        <p className="text-gray-600 mb-6">
          Have questions, feedback, or need support? Our team is always ready to assist you. 
          Whether you’re a job seeker looking for guidance or an employer searching for talent, we’d love to hear from you.
        </p>

        <div className="flex items-center space-x-4 mb-6">
          {icons.map(({ component: Icon, href }, i) => (
            <a
              key={i}
              href={href}
              className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full text-blue-600"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full flex items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.1117 12.259C12.4658 10.9047 14.5977 10.7799 16.0152 11.9717L17.0395 12.8346C18.2085 13.8183 18.3273 15.5917 17.303 16.7944C16.7444 17.4407 15.9581 17.8466 15.1078 17.9278C11.8348 18.3686 8.40133 16.7914 4.80538 13.1952C1.20943 9.59895 -0.368634 6.16419 0.0721925 2.89191C0.0951002 2.63587 0.148305 2.38346 0.230692 2.13996C0.42132 1.5806 0.757833 1.08229 1.20546 0.696514C2.40907 -0.32688 4.18129 -0.208987 5.16497 0.961031L6.02681 1.98541C7.22051 3.40113 7.09668 5.5341 5.74251 6.88839L5.00746 7.6225C4.81149 7.81883 4.74733 8.11109 4.84302 8.37147C5.11049 9.10261 5.79303 10.016 6.88865 11.1117C7.98527 12.2085 8.89862 12.8901 9.62871 13.1585C9.88926 13.254 10.1815 13.1894 10.3776 12.9931L11.1117 12.259Z"
              fill="white"
            />
          </svg>
          Call Us: 1234567890
        </button>
      </div>

      {/* Right side */}
      <div className="md:w-1/2 w-full bg-white/10 backdrop-blur-lg p-10 rounded-3xl border-white/20">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="mb-2 text-md font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="p-3 rounded-xl bg-white/90 text-black border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-md font-semibold">
                Contact Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="p-3 rounded-xl bg-white/90 text-black border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-md font-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="p-3 rounded-xl bg-white/90 text-black border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-md font-semibold">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message..."
              rows={5}
              className="p-3 rounded-xl bg-white/90 text-black border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              required
            />
          </div>

          {status && (
            <p
              className={`text-sm ${
                status.type === "success"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {status.text}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={"bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16z"
                  ></path>
                </svg>
                Sending...
              </div>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;