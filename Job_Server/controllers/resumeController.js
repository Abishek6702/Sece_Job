const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const Resume = require("../models/Resume"); // 👈 FIX: use Resume instead of ResumeSchema

exports.postResume = async (req, res) => {
  try {
    const { userId, templatePath, ...resumeData } = req.body;

    if (!userId || !templatePath) {
      return res.status(400).json({
        success: false,
        message: "userId and templatePath are required",
      });
    }

    // ✅ Check if resume exists for this user + templatePath
    let resume = await Resume.findOne({ userId, templatePath });

    if (resume) {
      // ✅ Update existing resume
      resume.set(resumeData);
      await resume.save();
      res.status(200).json({
        success: true,
        message: "Resume updated successfully",
        data: resume,
      });
    } else {
      // ✅ Create new resume since templatePath is different
      resume = new Resume({ userId, templatePath, ...resumeData });
      await resume.save();
      res.status(201).json({
        success: true,
        message: "New resume created successfully",
        data: resume,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving resume",
      error: error.message,
    });
  }
};

// ✅ Preview Resume (by userId and templatePath)
exports.previewResume = async (req, res) => {
  try {
    const { userId, templatePath } = req.query;

    if (!userId || !templatePath) {
      return res.status(400).json({
        success: false,
        message: "userId and templatePath are required",
      });
    }

    // Find resume by userId + templatePath
    const resume = await Resume.findOne({ userId, templatePath }); // 👈 FIX
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found for given userId and templatePath",
      });
    }

    // Resolve absolute path
    const absoluteTemplatePath = path.join(
      __dirname,
      "..",
      templatePath.replace(/^\//, "")
    ); // 👈 strip leading /

    if (!fs.existsSync(absoluteTemplatePath)) {
      return res.status(404).json({
        success: false,
        message: "Template file not found",
      });
    }

    // Load HTML template
    const templateSource = fs.readFileSync(absoluteTemplatePath, "utf-8");

    // Compile with Handlebars
    const template = handlebars.compile(templateSource);

    // Convert Mongoose object to plain JS (so Handlebars can use it)
    const resumeData = resume.toObject();

    // Render final HTML with data
    const renderedHtml = template(resumeData);

    res.send(renderedHtml);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error previewing resume",
      error: error.message,
    });
  }
};

exports.downloadResume = async (req, res) => {
  try {
    const { userId, templatePath } = req.query;

    if (!userId || !templatePath) {
      return res.status(400).json({
        success: false,
        message: "userId and templatePath are required",
      });
    }

    const resume = await Resume.findOne({ userId, templatePath });
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found for given userId and templatePath",
      });
    }

    // Resolve absolute path
    const absoluteTemplatePath = path.join(
      __dirname,
      "..",
      templatePath.replace(/^\//, "")
    );

    if (!fs.existsSync(absoluteTemplatePath)) {
      return res.status(404).json({
        success: false,
        message: "Template file not found",
      });
    }

    // Load and compile Handlebars template
    const templateSource = fs.readFileSync(absoluteTemplatePath, "utf-8");
    const template = handlebars.compile(templateSource);
    const resumeData = resume.toObject();
    const renderedHtml = template(resumeData);

    // Generate PDF using Puppeteer
    const puppeteer = require("puppeteer");
    console.log(puppeteer.executablePath());
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // for linux/servers
    });

    const page = await browser.newPage();
    await page.setContent(renderedHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // ✅ Send PDF response properly
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=resume-${userId}.pdf`
    );
    res.end(pdfBuffer); // 👈 use res.end instead of res.send to avoid corruption
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating resume PDF",
      error: error.message,
    });
  }
};
