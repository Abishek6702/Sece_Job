const sendEmail = require('./sendEmail');
const Job = require('../models/job');
const Company = require('../models/company');
const path = require('path');
const fs = require('fs');
const normalizeLogoPath = require("../utils/normalizeLogoPath");
const sendApplicationDeletedEmail = async (to, applicantName, jobId, companyId) => {
  let jobTitle = 'the position';
  let companyName = 'the company';
  let companyLogoPath = path.resolve(__dirname, '../emails/assets/default-company-logo.png');

  try {
    const [job, company] = await Promise.all([
      Job.findById(jobId),
      Company.findById(companyId),
    ]);

    if (job) jobTitle = job.position;
    if (company) {
      companyName = company.company_name || company.name || companyName;
      if (company.company_logo) {
        companyLogoPath = normalizeLogoPath(company.company_logo);
        if (!fs.existsSync(companyLogoPath)) {
          console.warn('Company logo file does not exist, using default.');
          companyLogoPath = path.resolve(__dirname, '../emails/assets/default-company-logo.png');
        }
      }
    }
  } catch (err) {
    console.error('Error fetching job or company info for deletion email:', err.message);
  }

  const subject = `Application Deleted for ${jobTitle}`;
  const context = {
    applicantName,
    jobTitle,
    companyName,
    supportEmail: 'support@yourcompany.com', // Replace or make dynamic as needed
    careersPage: 'https://yourcompany.com/careers',
  };

  const attachments = [
    {
      filename: 'company-logo.png',
      path: companyLogoPath,
      cid: 'companyLogo',
    },
    // (Footer social icon attachments can be added in your general sendEmail utility)
  ];

  try {
    await sendEmail(to, subject, 'application-deleted', context, attachments);
    console.log(`Application deletion email sent to ${to}`);
  } catch (error) {
    console.error('Error sending application deletion email:', error);
  }
};

module.exports = sendApplicationDeletedEmail;
