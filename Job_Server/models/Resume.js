const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    personal: {
      photo: { type: String, default: null },
      name: String,
      phone: String,
      email: String,
      address: String,
      socialLinks: [{ key: String, url: String }],
      summary: String,
    },
    education: [
      {
        courseName: String,
        college: String,
        branch: String,
        location: String,
        startDate: Date,
        endDate: Date,
        isPresent: Boolean,
        cgpa: String,
      },
    ],
    certifications: [
      {
        courseName: String,
        institution: String,
        startDate: Date,
        endDate: Date,
        present: Boolean,
        location: String,
      },
    ],
    experience: [
      {
        companyName: String,
        location: String,
        startDate: Date,
        endDate: String,
        present: Boolean,
        role: String,
        description: String,
      },
    ],
    skills: [String],
    languages: [String],
    projects: [
      {
        name: String,
        description: String,
        techStack: String,
        startDate: Date,
        endDate: String,
        present: Boolean,
        links: [{ key: String, url: String }],
      },
    ],
    roles: [String],

    // Extra fields
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    templateId: { type:String },
    templatePath:{type:String}
  },
  { timestamps: true }
);

// ✅ Model Name: "Resume", Collection: "resumes"
module.exports = mongoose.model("Resume", ResumeSchema);