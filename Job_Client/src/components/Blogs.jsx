import React from "react";

const blogs = [
  {
    id: 1,
    title: "Lorem ipsum dolor sit amet",
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    excerpt:
      "Excepteur sint occaecat cupidatat non proident. Sunt in culpa qui officia deserunt.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor sit amet",
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    excerpt:
      "Excepteur sint occaecat cupidatat non proident. Sunt in culpa qui officia deserunt.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor sit amet",
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    excerpt:
      "Excepteur sint occaecat cupidatat non proident. Sunt in culpa qui officia deserunt.",
  },
];

const Blogs = () => (
  <section id="portfolio" className="bg-blue-50 py-16 relative overflow-hidden">

    <div className="relative z-10 max-w-6xl mx-auto px-4">
      <p className="text-[#078bf7] font-semibold text-3xl">Blogs</p>
      <h2 className="text-3xl font-bold mb-2">Our Latest News</h2>
      <p className="text-gray-500 mb-8">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="rounded-xl overflow-hidden shadow-md bg-white relative group"
          >
            <div className="relative h-56">
              <img
                src={blog.image}
                alt={blog.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <span className="absolute left-4 top-4 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                {blog.category}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 w-full px-6 pb-6 pt-16 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <h3 className="text-white font-semibold text-lg mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-200 text-sm mb-3">{blog.excerpt}</p>
              <button className="text-blue-200 font-bold flex items-center ">
                Know More{" "}
                <span className="ml-1">
                  <svg
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.39011 0.549418C8.11973 0.815993 8.09437 1.23722 8.31601 1.53277L8.38259 1.61005L12.9583 6.25016L1.25 6.25016C0.835787 6.25016 0.5 6.58595 0.5 7.00016C0.5 7.38251 0.786114 7.69804 1.15592 7.74432L1.25 7.75016H12.9583L8.38259 12.3903C8.11601 12.6607 8.09663 13.0822 8.32245 13.3746L8.39011 13.4509C8.66049 13.7175 9.08204 13.7369 9.37442 13.511L9.45074 13.4434L15.2841 7.52672C15.548 7.25904 15.57 6.84257 15.3501 6.55009L15.2841 6.47361L9.45074 0.556941C9.15994 0.261977 8.68507 0.25861 8.39011 0.549418Z"
                      fill="white"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 py-3 font-semibold shadow transition flex items-center gap-2">
          Read All Blogs{" "}
          <svg
            width="16"
            height="14"
            viewBox="0 0 16 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.39011 0.549418C8.11973 0.815993 8.09437 1.23722 8.31601 1.53277L8.38259 1.61005L12.9583 6.25016L1.25 6.25016C0.835787 6.25016 0.5 6.58595 0.5 7.00016C0.5 7.38251 0.786114 7.69804 1.15592 7.74432L1.25 7.75016H12.9583L8.38259 12.3903C8.11601 12.6607 8.09663 13.0822 8.32245 13.3746L8.39011 13.4509C8.66049 13.7175 9.08204 13.7369 9.37442 13.511L9.45074 13.4434L15.2841 7.52672C15.548 7.25904 15.57 6.84257 15.3501 6.55009L15.2841 6.47361L9.45074 0.556941C9.15994 0.261977 8.68507 0.25861 8.39011 0.549418Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </div>
  </section>
);

export default Blogs;