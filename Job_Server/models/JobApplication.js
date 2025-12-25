const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    level: String,
    institution: String,
    university: String,
    branch: String,
    yearFrom: Number,
    yearTo: Number,
    marks: String,
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    company: String,
    yearFrom: Number,
    yearTo: Number,
    title: String,
    location: String,
    description: String,
  },
  { _id: false }
);

const questionAnswerSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },

    experience: { type: Number, required: true },
    resume: { type: String, required: true },

    education: [educationSchema],
    experienceDetails: [experienceSchema],
    questionsAndAnswers: [questionAnswerSchema],

    status: { type: String, default: "pending" },
    rejectedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
