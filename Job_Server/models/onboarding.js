const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    level: String,
    institution: String,
    university: String,
    branch: String,
    yearFrom: Date,
    yearTo: Date,
    marks: String,
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    company: String,
    yearFrom: Date,
    yearTo: Date,
    title: String,
    location: String,
    description: String,
  },
  { _id: false }
);

const onboardingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    location: { type: String, required: true },
    education: [educationSchema],
    experience: [experienceSchema],
    preferredRoles: [{ type: String }],
    salaryExpectation: { type: Number },
    profileImage: { type: String },
    resume: { type: String },
    banner: { type: String },
    skills: [{ type: String }],
   
    careerGapEnd: {
  type: Date,
  default: null,
  set: v => (v === "" ? null : v),
},
careerGapStart: {
  type: Date,
  default: null,
  set: v => (v === "" ? null : v),
},


  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Onboarding || mongoose.model("Onboarding", onboardingSchema);
