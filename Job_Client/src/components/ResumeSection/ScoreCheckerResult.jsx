import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ChevronLeft } from "lucide-react";

const ResumeResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    analysis,
    fileName = "Resume_Analysis",
    jobTitle,
  } = location.state || {};

  const pdfRef = useRef();

  if (!analysis) {
    navigate("/");
    return null;
  }

  const {
    atsScore,
    skills = { matched: [], missing: [] },
    analysis: detail = {},
    suggestions = [],
  } = analysis;
  // console.log("ak",detail)
  const totalSkills = skills.matched.length + skills.missing.length || 1;
  const matchedPercent = (skills.matched.length / totalSkills) * 100;
  const missingPercent = (skills.missing.length / totalSkills) * 100;

  // Helper: Convert SVG element to PNG Data URL for sharp PDF graph image
  const svgToPngDataUrl = (svgElement, width = 200, height = 200) => {
    return new Promise((resolve, reject) => {
      try {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);
        const image = new Image();

        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d");
          context.clearRect(0, 0, width, height);
          context.drawImage(image, 0, 0, width, height);
          URL.revokeObjectURL(blobURL);
          resolve(canvas.toDataURL("image/png"));
        };

        image.onerror = () => {
          reject(new Error("Failed to load SVG as image"));
        };

        image.src = blobURL;
      } catch (err) {
        reject(err);
      }
    });
  };

 const generatePDF = async () => {
  if (!pdfRef.current) return;

  try {
    const svgElement = pdfRef.current.querySelector("#atsScoreGraph");
    if (!svgElement) {
      alert("Graph element not found for PDF generation.");
      return;
    }

    const imgData = await svgToPngDataUrl(svgElement, 200, 200);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const bottomMargin = 30;
    let yPosition = 40;

    // Pagination helper
    const checkPageOverflow = (linesCount) => {
      const lineHeight = 16; // approx line height
      if (yPosition + linesCount * lineHeight + bottomMargin > pageHeight) {
        pdf.addPage();
        yPosition = 40; // reset for new page
      }
    };

    // Add heading
    pdf.setFontSize(22);
    pdf.setFont(undefined, "bold");
    pdf.setTextColor("#000");
    pdf.text("Resume Score Analysis Report", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 30;

    // Add filename and role detected
    pdf.setFontSize(14);
    pdf.setFont(undefined, "normal");
    const fileNameText = fileName.replace(/_/g, " ");
    const roleText = analysis.roleDetected || "N/A";
    pdf.text(`${fileNameText} - Role: ${roleText}`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 50;

    // Add graph image
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = 150;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    const xPos = (pageWidth - imgWidth) / 2;
    const yStart = yPosition;
    pdf.addImage(imgData, "PNG", xPos, yPosition, imgWidth, imgHeight);
    yPosition += imgHeight + 30;

    // Add centered score number
    pdf.setFontSize(28);
    pdf.setTextColor("#3B82F6");
    pdf.setFont(undefined, "bold");
    pdf.text(String(atsScore), pageWidth / 2, yStart + imgHeight / 2 + 8, { align: "center" });

    // ATS score label below graph
    pdf.setFontSize(14);
    pdf.setFont(undefined, "bold");
    pdf.setTextColor("#000");
    checkPageOverflow(1);
    pdf.text("ATS Score:", 40, yPosition);
    pdf.setFont(undefined, "normal");
    pdf.text(`${atsScore} / 100`, 130, yPosition);
    yPosition += 25;

    // Matched and Missing percentages
    pdf.setFont(undefined, "bold");
    pdf.setTextColor("#008000");
    checkPageOverflow(1);
    pdf.text("Matched Skills (%):", 40, yPosition);
    pdf.setTextColor("#000");
    pdf.text(`${matchedPercent.toFixed(1)}%`, 180, yPosition);
    yPosition += 20;

    pdf.setFont(undefined, "bold");
    pdf.setTextColor("#B00000");
    checkPageOverflow(1);
    pdf.text("Missing Skills (%):", 40, yPosition);
    pdf.setTextColor("#000");
    pdf.text(`${missingPercent.toFixed(1)}%`, 180, yPosition);
    yPosition += 30;

    // Detailed Analysis heading
    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    checkPageOverflow(1);
    pdf.text("Detailed Analysis:", 40, yPosition);
    yPosition += 20;
    pdf.setFont(undefined, "normal");

    const addLines = (text) => {
      const splitText = pdf.splitTextToSize(text, pageWidth - 80);
      checkPageOverflow(splitText.length);
      pdf.text(splitText, 40, yPosition);
      yPosition += splitText.length * 16 + 10;
    };

    // Suggestions
    if (suggestions.length) {
      checkPageOverflow(suggestions.length * 2);
      pdf.setFont(undefined, "bold");
      pdf.text("Suggestions to Improve", 40, yPosition);
      yPosition += 16;
      pdf.setFont(undefined, "normal");
      suggestions.forEach((sugg, i) => addLines(`${i + 1}. ${sugg}`));
    }
    // Summary
    if (detail.summary) {
      checkPageOverflow(3);
      pdf.setFont(undefined, "bold");
      pdf.text("Summary", 40, yPosition);
      yPosition += 16;
      pdf.setFont(undefined, "normal");
      addLines(detail.summary);
    }
    // Education
    if (detail.education) {
      checkPageOverflow(3);
      pdf.setFont(undefined, "bold");
      pdf.text("Education", 40, yPosition);
      yPosition += 16;
      pdf.setFont(undefined, "normal");
      addLines(detail.education);
    }
    // Experience
    if (detail.experience) {
      checkPageOverflow(3);
      pdf.setFont(undefined, "bold");
      pdf.text("Experience", 40, yPosition);
      yPosition += 16;
      pdf.setFont(undefined, "normal");
      addLines(detail.experience);
    }
    // Formatting
    if (detail.formatting) {
      checkPageOverflow(3);
      pdf.setFont(undefined, "bold");
      pdf.text("Formatting", 40, yPosition);
      yPosition += 16;
      pdf.setFont(undefined, "normal");
      addLines(detail.formatting);
    }
    // Projects
    if (detail.projects) {
      checkPageOverflow(3);
      pdf.setFont(undefined, "bold");
      pdf.text("Projects", 40, yPosition);
      yPosition += 16;
      pdf.setFont(undefined, "normal");
      addLines(detail.projects);
    }
    // Matched Skills
    if (skills.matched.length) {
      checkPageOverflow(3);
      pdf.setFont(undefined, "bold");
      pdf.text("Matched Skills", 40, yPosition);
      yPosition += 16;
      pdf.setFont(undefined, "normal");
      addLines(skills.matched.join(", "));
    }
    // Missing Skills
    if (skills.missing.length) {
      checkPageOverflow(3);
      pdf.setFont(undefined, "bold");
      pdf.text("Missing Skills", 40, yPosition);
      yPosition += 16;
      pdf.setFont(undefined, "normal");
      addLines(skills.missing.join(", "));
    }

    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Failed to generate PDF. See console for details.");
  }
};


  return (
    <div
      ref={pdfRef}
      className="max-w-7xl mx-auto font-sans text-gray-900 rounded h-[85vh] md:flex mt-6"
    >
      {/* Left fixed area */}
      <div className="md:w-[40%] bg-white rounded-l-xl px-8 flex flex-col items-center flex-shrink-0">
        <div className="self-start mb-6 lg:flex items-center gap-3 w-full">
          <button
            onClick={() => navigate(-1)}
            className="transition rounded-full p-2 bg-gray-200 hover:bg-gray-300 cursor-pointer"
            title="Back"
          >
            <ChevronLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-600 whitespace-nowrap m-auto">
            Resume Score Analysis Report
          </h1>
        </div>

        {/* Circular score */}
        <div className="relative w-48 h-48 mt-15">
          <svg
            id="atsScoreGraph"
            className="transform -rotate-90 w-48 h-48"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="60" r="54" stroke="#E5E7EB" strokeWidth="12" />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="#3B82F6"
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 54}
              strokeDashoffset={(1 - atsScore / 100) * 2 * Math.PI * 54}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-6xl font-bold text-blue-600">{atsScore}</span>
            <span className="text-lg font-semibold text-blue-500">
              Score / 100
            </span>
          </div>

          {/* Show matched and missing percentages below graph */}
          <div className="mt-4 text-center w-full space-y-2 hidden">
            <div>
              <span className="font-semibold text-green-700">
                Matched Skills:{" "}
              </span>
              <span>{matchedPercent.toFixed(1)}%</span>
            </div>
            <div>
              <span className="font-semibold text-red-700">
                Missing Skills:{" "}
              </span>
              <span>{missingPercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Download PDF button */}
        <button
          onClick={generatePDF}
          className="mt-10 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold bg-gradient-to-r cursor-pointer from-blue-500 via-indigo-500 to-purple-600"
        >
          Download PDF Report
        </button>
      </div>

      {/* Right scrollable content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto max-h-[85vh] rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-600">
          Detailed Analysis
        </h2>

        <section className="mb-6 bg-white px-6 py-4 rounded-2xl">
          <h3 className="font-semibold text-lg mb-1">Suggestions to Improve</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <section className="mb-6 bg-white px-6 py-4 rounded-2xl">
          <h3 className="font-semibold text-lg mb-1">Matched Skills</h3>
          <p className="text-green-700">
            {skills.matched.length > 0 ? skills.matched.join(", ") : "None"}
          </p>
        </section>

        <section className="mb-6 bg-white px-6 py-4 rounded-2xl">
          <h3 className="font-semibold text-lg mb-1">Missing Skills</h3>
          <p className="text-red-700">
            {skills.missing.length > 0 ? skills.missing.join(", ") : "None"}
          </p>
        </section>

        <section className="mb-4 bg-white px-6 py-4 rounded-2xl">
          <h3 className="font-semibold text-lg mb-1">Summary</h3>
          <p className="text-gray-800">{detail.summary || "N/A"}</p>
        </section>

        <section className="mb-4 bg-white px-6 py-4 rounded-2xl">
          <h3 className="font-semibold text-lg mb-1">Skills Section</h3>
          <p className="text-gray-800">{detail.skillsSection || "N/A"}</p>
        </section>

        <section className="mb-4 bg-white px-6 py-4 rounded-2xl">
          <h3 className="font-semibold text-lg mb-1">Experience</h3>
          <p className="text-gray-800">{detail.experience || "N/A"}</p>
        </section>

        <section className="mb-4 bg-white px-6 py-4 rounded-2xl">
          <h3 className="font-semibold text-lg mb-1">Projects</h3>
          <p className="text-gray-800">{detail.projects || "N/A"}</p>
        </section>

        <section className="mb-4 bg-white px-6 py-4 rounded-2xl">
          <h3 className="font-semibold text-lg mb-1">Education</h3>
          <p className="text-gray-800">{detail.education || "N/A"}</p>
        </section>

        <section className="mb-4 bg-white px-6 py-4 rounded-2xl">
          <h3 className="font-semibold text-lg mb-1">Formatting</h3>
          <p className="text-gray-800">{detail.formatting || "N/A"}</p>
        </section>
      </div>
    </div>
  );
};

export default ResumeResultPage;
