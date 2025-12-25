const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  position: { type: String, required: true },
  location: String,
  workplace: String,
  interviewProcess: String,
  jobDescription: [{ title: String, content: [String] }],
  requirements: [{ title: String, content: [String] }],
  salaryRange: String,
  additionalBenefits: [String],
  deadlineToApply: { type: Date },
  postedAt: { type: Date, default: Date.now },
  additionalInfo: [String],
});
module.exports = mongoose.model("Job", jobSchema);
