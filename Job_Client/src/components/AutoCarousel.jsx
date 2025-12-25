import React, { useEffect, useState } from "react";

// Largest ring defines the container size
const RING_RADII = [80, 140, 200, 260];
const SIZE = RING_RADII[RING_RADII.length - 1] * 2;
const CENTER = SIZE / 2;

// Logos with assigned ring + angle
const logos = [
  // Ring 0 (innermost)
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", alt: "React", angle: 0, ring: 0 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg", alt: "Vue", angle: 120, ring: 0 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg", alt: "Angular", angle: 240, ring: 0 },

  // Ring 1
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", alt: "Node.js", angle: 45, ring: 1 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", alt: "Python", angle: 135, ring: 1 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg", alt: "PHP", angle: 225, ring: 1 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg", alt: "Ruby", angle: 315, ring: 1 },

  // Ring 2
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", alt: "Java", angle: 0, ring: 2 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg", alt: "C#", angle: 72, ring: 2 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", alt: "C++", angle: 144, ring: 2 },

  // Ring 3 (outermost)
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", alt: "Docker", angle: 0, ring: 3 },
  { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg", alt: "Kubernetes", angle: 60, ring: 3 },
  { src: "https://icongr.am/devicon/amazonwebservices-original.svg?size=128    ", alt: "AWS", angle: 120, ring: 3 },
   {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
    alt: 'Azure',
    angle: 180,
    ring: 3,
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    alt: 'Git',
    angle: 240,
    ring: 3,
  },
];


export default function OrbitCarousel() {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/first-time-login-count`
        );
        if (!res.ok) throw new Error("Failed to fetch visitor count");
        const data = await res.json();
        setVisitorCount(data.count);
      } catch (err) {
        console.error(err);
        setVisitorCount(0);
      }
    };

    fetchVisitorCount();
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full h-screen bg-white">
      {/* Container that holds everything */}
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* Center Image */}
        <div
          className="absolute bg-white border border-gray-300 shadow-lg rounded-full flex items-center justify-center"
          style={{
            width: 60,
            height: 60,
            left: CENTER - 30,
            top: CENTER - 24,
          }}
        >
          <img
            src="https://randomuser.me/api/portraits/women/65.jpg"
            alt="Center Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Rings */}
        {RING_RADII.map((radius, ringIndex) => (
          <div
            key={ringIndex}
            className="absolute rounded-full border-2 border-dashed border-gray-400"
            style={{
              width: radius * 2,
              height: radius * 2,
              top: CENTER - radius,
              left: CENTER - radius,
              animation: `${ringIndex % 2 === 0 ? "spinClock" : "spinAnti"} ${
                25 + ringIndex * 8
              }s linear infinite`,
            }}
          >
            {/* Logos on this ring */}
            {logos
              .filter((l) => l.ring === ringIndex)
              .map(({ src, alt, angle }, i) => {
                const theta = (angle * Math.PI) / 180;
                const logoSize = 50;
                const x = radius + radius * Math.cos(theta) - logoSize / 2;
                const y = radius + radius * Math.sin(theta) - logoSize / 2;

                return (
                  <div
                    key={i}
                    className="absolute bg-white border border-gray-300 shadow-md rounded-full flex items-center justify-center"
                    style={{
                      width: logoSize,
                      height: logoSize,
                      left: x,
                      top: y,
                    }}
                  >
                    <img
                      src={src}
                      alt={alt}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes spinClock {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spinAnti {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>

      {/* Visitor Count - bottom right */}
      {visitorCount !== null && (
        <p className="absolute bottom-6 right-6 font-medium text-lg text-gray-800">
         Total Number of Visitors:{" "}
          <span className="text-blue-700 font-bold">
            {visitorCount}
          </span>
        </p>
      )}
    </div>
  );
}
