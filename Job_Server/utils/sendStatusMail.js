const sendEmail = require('./sendEmail');
const Job = require('../models/job');
const Company = require('../models/company');
const path = require('path');
const normalizeLogoPath = require("../utils/normalizeLogoPath");
const statusMessages = {
  selected: {
    subject: (jobTitle) => `🎉 Congratulations! You've been selected for ${jobTitle}`,
    body: (jobTitle) => `
      <p>We are pleased to inform you that you've been <strong>selected</strong> for the position of <strong>${jobTitle}</strong>.</p>
      <p>We'll follow up shortly with the next steps.</p>
      <p>Thank you for your interest in joining us.</p>
    `,
  },
  rejected: {
    subject: (jobTitle) => `Application Update: Rejected for ${jobTitle}`,
    body: (jobTitle) => `
      <p>Thank you for applying for the <strong>${jobTitle}</strong> role.</p>
      <p>After review, we regret to inform you that your application has been rejected.</p>
      <p>We encourage you to apply for future openings.</p>
    `,
  },
  'not selected': {
    subject: (jobTitle) => `Application Status: Not Selected for ${jobTitle}`,
    body: (jobTitle) => `
      <p>We appreciate your interest in the <strong>${jobTitle}</strong> position.</p>
      <p>At this time, you have not been selected.</p>
      <p>Thank you, and we wish you the best moving forward.</p>
    `,
  },
};

const sendStatusEmail = async (to, status, applicantName = 'Applicant', jobId, companyId) => {
  if (!statusMessages[status]) {
    console.warn(`No email template for status: ${status}`);
    return;
  }

  // Fetch job and company details
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
      }
    }
  } catch (error) {
    console.error('Error fetching job or company for status email:', error.message);
  }

  const subject = statusMessages[status].subject(jobTitle);
  const bodyContent = statusMessages[status].body(jobTitle);

  const context = {
    applicantName,
    companyName,
    bodyContent,
  };

  const attachments = [
    {
      filename: 'company-logo.png',
      path: companyLogoPath,
      cid: 'companyLogo',
    },
  ];

  try {
    await sendEmail(to, subject, 'application-status', context, attachments);
    console.log(`Status update email sent to: ${to}`);
  } catch (err) {
    console.error(`Failed to send status email to ${to}:`, err.message);
  }
};

module.exports = sendStatusEmail;
