const mongoose = require("mongoose");
const Application = require("../models/JobApplication");
const User = require("../models/User");
const Job = require("../models/job");
const Company = require("../models/company");

const Onboarding = require("../models/onboarding");
const sendStatusEmail = require("../utils/sendStatusMail");
const fs = require("fs");
const path = require("path");
const Notification = require("../models/Notification");
const sendApplicationDeletedEmail = require("../utils/sendApplicationDeletedEmail");
const sendApplicationCreatedEmail = require("../utils/sendApplicationCreatedEmail");
const normalizeLogoPath = require("../utils/normalizeLogoPath");



// Post Job application only by employee user
exports.createApplication = async (req, res) => {
  try {
    const {
      jobId,
      companyId,
      name,
      email,
      phone,
      experience,
      location,
      questionsAndAnswers,
    } = req.body;

    let resume;
    if (req.file) {
      resume = req.file.filename;
    } else if (req.body.resumePath) {
      resume = req.body.resumePath;
    } else {
      return res.status(400).json({ message: "Resume is required." });
    }
    const existingApplication = await Application.findOne({
      userId: req.user._id,
      jobId,
    });
    if (existingApplication) {
      return res
        .status(409)
        .json({ message: "You have already applied for this job." });
    }

    const onboarding = await Onboarding.findOne({
      userId: req.user._id,
    }).select("education experience");
    if (!onboarding) {
      return res.status(404).json({ message: "Onboarding data not found." });
    }

    const newApp = new Application({
      userId: req.user._id,
      jobId,
      companyId,
      name,
      email,
      phone,
      location,
      experience,
      resume,
      education: onboarding.education,
      experienceDetails: onboarding.experience,
      questionsAndAnswers: JSON.parse(questionsAndAnswers || "[]"),
    });

    const savedApp = await newApp.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { appliedJobs: jobId },
    });
    const [job, company] = await Promise.all([
      Job.findById(jobId),
      Company.findById(companyId),
    ]);

    if (!job) return res.status(404).json({ message: "Job not found" });
    if (!company) return res.status(404).json({ message: "Company not found" });

    // Prepare company logo path (fallback to default)
    const companyLogoPath = normalizeLogoPath(company.company_logo);

    // Send application created email with dynamic data
    await sendApplicationCreatedEmail(
      email,
      name,
      job._id.toString(),
      company._id.toString(),
      companyLogoPath
    );

    res.status(201).json(savedApp);
  } catch (err) {
    console.error("Application creation error:", err);
    res.status(500).json({ error: err.message });
  }
};

// To get all the applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("userId")
      .populate({
        path: "jobId",
        populate: {
          path: "companyId",
        },
      });
    const applicationsWithDownloadLink = applications.map((app) => {
      const resumeDownloadLink = `http://localhost:3000/download/${app._id}`;
      return {
        ...app.toObject(),

        resumeDownloadLink,
      };
    });
    res.status(200).json(applicationsWithDownloadLink);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get details of each application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).populate(
      "userId jobId companyId"
    );
    if (!app) return res.status(404).json({ message: "Application not found" });
    res.status(200).json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete application and associated details
exports.deleteApplication = async (req, res) => {
  try {
    const app = await Application.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    await User.findByIdAndUpdate(app.userId, {
      $pull: { appliedJobs: app.jobId },
    });

    const [job, company] = await Promise.all([
      Job.findById(app.jobId),
      Company.findById(app.companyId),
    ]);

    const companyLogoPath = normalizeLogoPath(company.company_logo);

    await sendApplicationDeletedEmail(
      app.email,
      app.name,
      app.jobId.toString(),
      app.companyId.toString(),
      companyLogoPath
    );

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error('Error in deleteApplication controller:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all applications of particular job with jobID
exports.getApplicationsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId).populate("companyId");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!job.companyId || !job.companyId.createdBy) {
      return res.status(403).json({ message: "Company or owner info missing" });
    }

    if (job.companyId.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view applications for this job" });
    }

    const applications = await Application.find({ jobId }).populate("userId");
    res.status(200).json(applications);
  } catch (err) {
    console.error("🔥 Error in getApplicationsForJob:", err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch the applied jobs of particular user by ID
exports.getAppliedJobs = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("appliedJobs");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ appliedJobs: user.appliedJobs });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// To download resume of job applications
exports.downloadResume = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    // console.log("application:", application);
    // console.log("application resume:", application.resume);

    if (!application || !application.resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const resumeRaw = application.resume;
    // Always just the file name, cleans any directory info
    const resumeFileName = path.basename(resumeRaw.replace(/\\/g, "/"));

    // console.log("Resume from DB:", resumeRaw);
    // console.log("Sanitized filename:", resumeFileName);

    // Three possible places to check (in order)
    const possiblePaths = [
      path.join(__dirname, "../uploads", resumeFileName),
      path.join(__dirname, "../uploads/resumes", resumeFileName),
      path.join(__dirname, "../uploads/resumes/uploads", resumeFileName),
    ];

    // Find the first path that exists
    let foundPath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        foundPath = p;
        break;
      }
    }

    if (!foundPath) {
      console.error("Resume file not found at any path.");
      return res.status(404).json({ message: "Resume file not found" });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="resume-${application._id}.pdf"`
    );
    res.sendFile(foundPath);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update the status of job applications by their ID from pending to (rejected, selected, not selected, in progress)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const { id } = req.params;

    if (
      !["in progress", "rejected", "selected", "not selected"].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;

    if (typeof notes === "string") {
      application.notes = notes;
    }

    if (status === "rejected") {
      application.rejectedAt = new Date();
    } else {
      application.rejectedAt = null;
    }

    const job = await Job.findById(application.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const jobTitle = job.position;

    await application.save();

    try {
      if (
        ["selected", "rejected", "not selected", "in progress"].includes(status)
      ) {
        await Notification.create({
          userId: application.userId,
          senderId: req.user?._id || null,
          message: `Your application for "${jobTitle}" has been ${status}.`,
          type: "application_status",
        });
      }
    } catch (notifErr) {
      console.error("Notification creation failed:", notifErr.message);
    }

    try {
      if (["selected", "rejected", "not selected"].includes(status)) {
        console.log("controller application email", application.email);
        await sendStatusEmail(
          application.email,
          status,
          application.name,
          application.jobId,
          application.companyId
        );
        console.log("EMAIL TO SEND:", application.email);
      }
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr.message);
    }

    res
      .status(200)
      .json({ message: "Status updated successfully", application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update the status of job applications in bulk by list of application ID's from pending to (rejected, selected, not selected, in progress)
exports.bulkUpdateApplicationStatus = async (req, res) => {
  try {
    const { ids, status, notes } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "IDs should be a non-empty array" });
    }

    const areValidObjectIds = ids.every((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (!areValidObjectIds) {
      return res.status(400).json({ message: "One or more IDs are invalid" });
    }

    const validStatuses = [
      "in progress",
      "rejected",
      "selected",
      "not selected",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updateData = {
      status,
      rejectedAt: status === "rejected" ? new Date() : null,
    };
    if (typeof notes === "string") {
      updateData.notes = notes;
    }

    const applications = await Application.find({ _id: { $in: ids } });

    if (applications.length === 0) {
      return res
        .status(404)
        .json({ message: "No applications found to update" });
    }

    const jobTitles = await Job.find({
      _id: { $in: applications.map((app) => app.jobId) },
    })
      .lean()
      .then((jobs) =>
        jobs.reduce((acc, job) => {
          acc[job._id] = job.position;
          return acc;
        }, {})
      );

    await Application.updateMany({ _id: { $in: ids } }, { $set: updateData });

    try {
      const notificationPromises = applications.map((app) => {
        if (
          ["selected", "rejected", "not selected", "in progress"].includes(
            status
          )
        ) {
          const jobTitle = jobTitles[app.jobId];
          return Notification.create({
            userId: app.userId,
            senderId: req.user?._id || null,
            message: `Your application for "${jobTitle}" has been ${status}.`,
            type: "application_status",
          });
        }
        return Promise.resolve();
      });
      await Promise.all(notificationPromises);
    } catch (notifErr) {
      console.error("Bulk notification creation failed:", notifErr.message);
    }

    const emailPromises = applications.map(async (app) => {
      try {
        const jobTitle = jobTitles[app.jobId];
        if (
          jobTitle &&
          ["selected", "rejected", "not selected"].includes(status)
        ) {
          await sendStatusEmail(
            app.email,
            status,
            app.name,
            app.jobTitle,
            app.companyId
          );
        }
      } catch (emailErr) {
        console.error(`Error sending email to ${app.email}:`, emailErr.message);
      }
    });

    await Promise.all(emailPromises);

    res.status(200).json({
      message: "Bulk status update completed and emails sent",
      matchedCount: applications.length,
      modifiedCount: applications.length,
    });
  } catch (err) {
    console.error("Bulk status update error:", err);
    res.status(500).json({ error: err.message });
  }
};
