const mongoose = require("mongoose");
const Job = require("../models/job");
const Company = require("../models/company");
const Application = require("../models/JobApplication"); 
// Post job only by employee
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(403)
        .json({ message: "Only employers can create jobs" });
    }

    const parseJSON = (data, fallback = []) => {
      try {
        return typeof data === "string" ? JSON.parse(data) : data || fallback;
      } catch {
        return fallback;
      }
    };

    let {
      companyId,
      position,
      location,
      workplace,
      interviewProcess,
      jobDescription,
      requirements,
      salaryRange,
      additionalBenefits,
      additionalInfo,
      deadlineToApply,
    } = req.body;

    jobDescription = parseJSON(jobDescription);
    requirements = parseJSON(requirements);
    additionalBenefits = parseJSON(additionalBenefits);
    additionalInfo = parseJSON(additionalInfo);

    const job = await Job.create({
      companyId: new mongoose.Types.ObjectId(companyId),
      position,
      location,
      workplace,
      interviewProcess,
      jobDescription,
      requirements,
      salaryRange,
      additionalBenefits,
      additionalInfo,
      deadlineToApply,
      postedAt: new Date(),
    });

    await Company.findByIdAndUpdate(
      companyId,
      { $push: { jobs: job._id } },
      { new: true }
    );

    res.status(201).json(job);
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all the jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("companyId").lean();

    // Aggregate count of applications grouped by jobId
    const counts = await Application.aggregate([
      {
        $group: {
          _id: "$jobId",
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert counts array to a Map for easy lookup
    const countMap = counts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    // Add totalApplications to each job
    const jobsWithCounts = jobs.map(job => ({
      ...job,
      totalApplications: countMap[job._id.toString()] || 0
    }));

    res.status(200).json(jobsWithCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get job detils by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("companyId").lean();
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Count applications for this job
    const totalApplications = await Application.countDocuments({ jobId: job._id });

    res.status(200).json({
      ...job,
      totalApplications
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update particular job detils by their ID only by particular employer user and admin
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid job ID" });
    }

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const company = await Company.findById(job.companyId);
    if (!company) return res.status(404).json({ error: "Company not found" });

    if (
      req.user.role !== "admin" &&
      company.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const parseJSON = (data, fallback = []) => {
      try {
        return typeof data === "string" ? JSON.parse(data) : data || fallback;
      } catch {
        return fallback;
      }
    };

    let {
      position,
      location,
      workplace,
      interviewProcess,
      jobDescription,
      requirements,
      salaryRange,
      additionalBenefits,
      additionalInfo,
      deadlineToApply,
    } = req.body;

    jobDescription = parseJSON(jobDescription);
    requirements = parseJSON(requirements);
    additionalBenefits = parseJSON(additionalBenefits);
    additionalInfo = parseJSON(additionalInfo);

    const updateData = {
      position,
      location,
      workplace,
      interviewProcess,
      jobDescription,
      requirements,
      salaryRange,
      additionalBenefits,
      additionalInfo,
      deadlineToApply,
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    const updatedJob = await Job.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete the job by their ID only by particular employer user and admin
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const company = await Company.findById(job.companyId);
    if (!company) {
      return res.status(404).json({ message: "Associated company not found" });
    }

    if (
      req.user.role !== "admin" &&
      company.createdBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Job.findByIdAndDelete(req.params.id);

    company.jobs = company.jobs.filter(
      (jobId) => jobId.toString() !== req.params.id
    );
    await company.save();

    res
      .status(200)
      .json({ message: "Job deleted and reference removed from company" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
