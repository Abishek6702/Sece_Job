  const mongoose = require("mongoose");

  const companySchema = new mongoose.Schema({
    company_logo: String,
    company_name: String,
    company_type: String,
    location: String,
    founded: Number,  
    revenue: String,
    followers_count: Number,
    employee_count: Number,
    site_url: String,
    ratings: String,
    about: {
      content: String,
      contact_info: String,
      stock_value: String
    },
    jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    people: [{ content: String, category: String }],
    images: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  });

module.exports = mongoose.models.Company || mongoose.model("Company", companySchema);
