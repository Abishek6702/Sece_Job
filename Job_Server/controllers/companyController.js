const mongoose = require("mongoose");
const Company = require("../models/company");
const Job = require("../models/job");
const User = require("../models/User");

// To create company profile only employer user can have access
exports.createCompany = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(403)
        .json({ message: "Only employers can create companies" });
    }

    let { about, people, jobs } = req.body;
    if (typeof about === "string") about = JSON.parse(about);
    if (typeof people === "string") people = JSON.parse(people);
    if (typeof jobs === "string") jobs = JSON.parse(jobs);

    jobs = jobs?.map((jobId) => new mongoose.Types.ObjectId(jobId)) || [];

    const company_logo = req.files?.["company_logo"]?.[0]?.path || null;
    const images = req.files?.["images"]?.map((file) => file.path) || [];

    const company = await Company.create({
      company_logo,
      company_name: req.body.company_name,
      company_type: req.body.company_type,
      location: req.body.location,
      founded: req.body.founded,
      revenue: req.body.revenue,
      followers_count: req.body.followers_count,
      employee_count: req.body.employee_count,
      site_url: req.body.site_url,
      ratings: req.body.ratings,
      about,
      jobs,
      people,
      images,
      createdBy: req.user._id,
    });
    const user = await User.findById(req.user._id);
    if (user) {
      user.firstTimeLogin = false;
      await user.save();
    }

    await Job.updateMany({ _id: { $in: jobs } }, { companyId: company._id });

    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// To fetch all companies 
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("jobs");
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get company details by their ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate("jobs");
    if (!company) return res.status(404).json({ message: "Company not found" });

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Company profile but the login will be existing
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }


    if (!company.createdBy.equals(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobs = await Job.find({ companyId: company._id });
    const jobIds = jobs.map((job) => job._id);

    await User.updateMany(
      { savedJobs: { $in: jobIds } },
      { $pull: { savedJobs: { $in: jobIds } } }
    );

    await Job.deleteMany({ companyId: company._id });
    await User.findByIdAndUpdate(company.createdBy, { firstTimeLogin: true });

    await Company.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({
        message:
          "Company and related jobs deleted successfully, and savedJobs cleaned up",
      });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update the company details with ID 
exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    let { about, people, jobs } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid company ID" });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    if (
      req.user.role !== "admin" &&
      company.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Access denied. Unauthorized to update this company." });
    }

    const parseJSON = (data, key) => {
      try {
        return typeof data === "string" ? JSON.parse(data) : data;
      } catch (error) {
        throw new Error(`Invalid JSON in ${key}`);
      }
    };

    about = about ? parseJSON(about, "about") : undefined;
    people = people ? parseJSON(people, "people") : undefined;
    jobs = jobs ? parseJSON(jobs, "jobs") : undefined;

    const company_logo = req.files?.["company_logo"]?.[0]?.path || null;
    const images = req.files?.["images"]?.map((file) => file.path) || [];

    const updateData = {
      company_name: req.body.company_name,
      company_type: req.body.company_type,
      location: req.body.location,
      founded: req.body.founded,
      revenue: req.body.revenue,
      followers_count: req.body.followers_count,

      employee_count: req.body.employee_count,
      site_url: req.body.site_url,
      ratings: req.body.ratings,
      about,
      people,
    };

    if (company_logo) updateData.company_logo = company_logo;
    if (images.length) updateData.images = images;

    if (jobs) {
      jobs = jobs.map((jobId) => new mongoose.Types.ObjectId(jobId));
      await Job.updateMany({ _id: { $in: jobs } }, { companyId: id });
      updateData.jobs = jobs;
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    const updatedCompany = await Company.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error("Update error:", error.stack || error.message);
    res.status(500).json({ error: error.message });
  }
};
