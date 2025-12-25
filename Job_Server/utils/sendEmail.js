const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars').default; // Use .default as needed

// Create transporter with your Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Path to your email templates folder
const templatePath = path.resolve(__dirname, '../emails/templates');

// Setup handlebars plugin with nodemailer transporter
transporter.use('compile', hbs({
  viewEngine: {
    extName: '.handlebars',
    partialsDir: templatePath, // If you use partials
    defaultLayout: false,
  },
  viewPath: templatePath,
  extName: '.handlebars',
}));

/**
 * Send an email using nodemailer + handlebars templates with inline attachments
 * 
 * @param {string} to Recipient email address
 * @param {string} subject Email subject line
 * @param {string} templateName Name of Handlebars template file without extension
 * @param {object} context Data object to pass to template (variables like name, otp etc)
 * @param {array} attachments Additional attachments array [{filename, path, cid}]
 */
const sendEmail = async (to, subject, templateName, context = {}, attachments = []) => {
  // Common footer social icons attachments - reuse for all emails
  const commonAttachments = [
    {
      filename: 'facebook.png',
      path: path.join(__dirname, '../emails/assets/facebook.png'),
      cid: 'iconFacebook',
    },
    {
      filename: 'instagram.png',
      path: path.join(__dirname, '../emails/assets/instagram.png'),
      cid: 'iconTwitter',
    },
    {
      filename: 'linkedin.png',
      path: path.join(__dirname, '../emails/assets/linkedin.png'),
      cid: 'iconLinkedin',
    },
  ];

  // Compose attachments: Add your template-specific logos + common footer icons
  const mailAttachments = [...attachments, ...commonAttachments];

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    template: templateName,
    context,
    attachments: mailAttachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email "${subject}" sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
