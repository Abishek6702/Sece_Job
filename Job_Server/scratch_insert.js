require('dotenv').config();
const connectDB = require('./config/db');
const Job = require('./models/job.js');
const Company = require('./models/company.js');

connectDB().then(async () => {
  const lastJob = await Job.findOne({ position: 'Full Stack Developer' }).sort({postedAt: -1});
  const companyId = lastJob ? lastJob.companyId : (await Company.findOne())._id;
  console.log('Company ID:', companyId);

  // Delete jobs that have missing data (my previous bad inserts)
  await Job.deleteMany({ location: { $exists: false } });

  const jobs = [
    {
      companyId,
      position: 'Data Engineer',
      location: 'Salem, India',
      workplace: 'Full Time',
      interviewProcess: 'Online',
      jobDescription: [{ title: 'Overview', content: ['Build and maintain data pipelines.', 'Ensure data quality and availability.'] }],
      requirements: [{ title: 'Skills', content: ['Python', 'SQL', 'ETL', 'AWS/GCP'] }],
      salaryRange: '90000',
      additionalBenefits: ['Health Insurance', 'Stock Options', 'Flexible Hours'],
      deadlineToApply: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      additionalInfo: ['How many years of experience you have in Data Engineering?']
    },
    {
      companyId,
      position: 'Backend Developer',
      location: 'New York, NY',
      workplace: 'Full Time',
      interviewProcess: 'Walk In',
      jobDescription: [{ title: 'Role', content: ['Develop robust backend APIs', 'Optimize database performance'] }],
      requirements: [{ title: 'Requirements', content: ['Node.js', 'Express', 'MongoDB', 'REST APIs'] }],
      salaryRange: '100000',
      additionalBenefits: ['401k', 'Gym Membership'],
      deadlineToApply: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      additionalInfo: ['How many years of backend experience do you have?']
    },
    {
      companyId,
      position: 'Security Engineer',
      location: 'San Francisco, CA',
      workplace: 'Full Time',
      interviewProcess: 'Online',
      jobDescription: [{ title: 'Responsibilities', content: ['Identify vulnerabilities', 'Implement security protocols'] }],
      requirements: [{ title: 'Qualifications', content: ['Cybersecurity experience', 'Network security', 'Penetration testing'] }],
      salaryRange: '120000',
      additionalBenefits: ['Catered lunches', 'Full Health Coverage'],
      deadlineToApply: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      additionalInfo: ['Do you have a security certification?']
    },
    {
      companyId,
      position: 'NestJS Developer',
      location: 'Chennai, India',
      workplace: 'Full Time',
      interviewProcess: 'Online',
      jobDescription: [{ title: 'Job Details', content: ['Build scalable enterprise services using NestJS'] }],
      requirements: [{ title: 'Skills Needed', content: ['TypeScript', 'NestJS', 'Microservices', 'PostgreSQL'] }],
      salaryRange: '110000',
      additionalBenefits: ['Home office stipend', 'Unlimited PTO'],
      deadlineToApply: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      additionalInfo: ['What is your notice period?']
    },
    {
      companyId,
      position: 'DevOps Engineer',
      location: 'Austin, TX',
      workplace: 'Hybrid',
      interviewProcess: 'Online',
      jobDescription: [{ title: 'Overview', content: ['Manage CI/CD pipelines', 'Monitor system health'] }],
      requirements: [{ title: 'Requirements', content: ['Docker', 'Kubernetes', 'AWS', 'Terraform'] }],
      salaryRange: '115000',
      additionalBenefits: ['Learning & Development Budget'],
      deadlineToApply: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      additionalInfo: ['Experience with AWS or GCP?']
    },
    {
      companyId,
      position: 'Frontend Developer',
      location: 'Remote',
      workplace: 'Full Time',
      interviewProcess: 'Online',
      jobDescription: [{ title: 'About', content: ['Create beautiful and responsive user interfaces'] }],
      requirements: [{ title: 'Skills', content: ['React', 'Tailwind CSS', 'JavaScript', 'HTML/CSS'] }],
      salaryRange: '90000',
      additionalBenefits: ['Internet Allowance', 'Flexible Schedule'],
      deadlineToApply: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      additionalInfo: ['Can you share your portfolio link?']
    },
    {
      companyId,
      position: 'Cloud Architect',
      location: 'Seattle, WA',
      workplace: 'Hybrid',
      interviewProcess: 'Walk In',
      jobDescription: [{ title: 'Overview', content: ['Design and implement cloud infrastructure.', 'Optimize for scalability and security.'] }],
      requirements: [{ title: 'Requirements', content: ['AWS Certified Solutions Architect', 'Terraform', 'Kubernetes'] }],
      salaryRange: '150000',
      additionalBenefits: ['Stock Options', 'Comprehensive Health Care'],
      deadlineToApply: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      additionalInfo: ['What is your primary cloud platform?']
    },
    {
      companyId,
      position: 'Machine Learning Engineer',
      location: 'Boston, MA',
      workplace: 'Full Time',
      interviewProcess: 'Online',
      jobDescription: [{ title: 'Role', content: ['Develop predictive models', 'Deploy AI solutions to production'] }],
      requirements: [{ title: 'Skills', content: ['Python', 'TensorFlow', 'PyTorch', 'Data Science'] }],
      salaryRange: '135000',
      additionalBenefits: ['Remote Work Options', 'Gym Membership'],
      deadlineToApply: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      additionalInfo: ['Do you have experience deploying models?']
    },
    {
      companyId,
      position: 'UI/UX Designer',
      location: 'Remote',
      workplace: 'Part Time',
      interviewProcess: 'Online',
      jobDescription: [{ title: 'Responsibilities', content: ['Design user-centric interfaces', 'Conduct user research'] }],
      requirements: [{ title: 'Qualifications', content: ['Figma', 'Adobe XD', 'Prototyping', 'Wireframing'] }],
      salaryRange: '80000',
      additionalBenefits: ['Flexible Hours', 'Creative Budget'],
      deadlineToApply: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      additionalInfo: ['Please provide a link to your design portfolio.']
    },
    {
      companyId,
      position: 'Database Administrator',
      location: 'Chicago, IL',
      workplace: 'On-site',
      interviewProcess: 'Walk In',
      jobDescription: [{ title: 'Job Details', content: ['Manage and optimize enterprise databases', 'Ensure data integrity'] }],
      requirements: [{ title: 'Skills Needed', content: ['PostgreSQL', 'MongoDB', 'SQL Server', 'Database Tuning'] }],
      salaryRange: '105000',
      additionalBenefits: ['401k Matching', 'Paid Time Off'],
      deadlineToApply: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      additionalInfo: ['Are you comfortable with on-call rotations?']
    }
  ];

  await Job.insertMany(jobs);
  console.log('Successfully re-inserted detailed jobs');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
