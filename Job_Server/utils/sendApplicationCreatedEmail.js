const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const sendEmail = require('./sendEmail');
const Job = require('../models/job');
const Company = require('../models/company');
const normalizeLogoPath = require("../utils/normalizeLogoPath");
function isValidObjectId(id){
  if(mongoose.Types.ObjectId.isValid(id)){
    if(String(new mongoose.Types.ObjectId(id)) === id){
      return true;
    }
    return false;
  }
  return false;
}

const sendApplicationCreatedEmail = async (to, name, jobId, companyId) => {
  if (!isValidObjectId(jobId) || !isValidObjectId(companyId)) {
    console.warn('Invalid jobId or companyId passed to sendApplicationCreatedEmail');
    return;
  }

  const [job, company] = await Promise.all([Job.findById(jobId), Company.findById(companyId)]);
  if (!job || !company) {
    console.warn('Job or company not found');
    return;
  }

  const companyLogoPath = normalizeLogoPath(company.company_logo);

  if (!fs.existsSync(companyLogoPath)) {
    console.warn('Company logo file does not exist:', companyLogoPath);
  }

  const context = {
    applicantName: name,
    jobTitle: job.position,
    companyName: company.company_name,
    careersPage: "https://yourcompany.com/careers",
  };

  const attachments = company.company_logo ? [{
    filename: 'company-logo.png',
    path: companyLogoPath,
    cid: 'companyLogo'
  }] : [];

  try {
    await sendEmail(to, `Application Received for ${job.position}`, "application-created", context, attachments);
    console.log(`Application created email sent to ${to}`);
  } catch (error) {
    console.error('Error sending application created email:', error);
  }
};

module.exports = sendApplicationCreatedEmail;
