const User = require('../models/User');
const Job = require("../models/job");

// Toggle save unsave job
exports.toggleSaveJob = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.savedJobs.findIndex(id => id.toString() === jobId);
    if (index === -1) {
      user.savedJobs.push(jobId);
      await user.save();
      return res.status(200).json({ message: 'Job saved successfully', savedJobs: user.savedJobs });
    } else {
      user.savedJobs.splice(index, 1);
      await user.save();
      return res.status(200).json({ message: 'Job unsaved successfully', savedJobs: user.savedJobs });
    }
  } catch (error) {
    console.error('Toggle Save Job Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all saved jobs of 
exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedJobs');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ savedJobs: user.savedJobs });
  } catch (error) {
    console.error('Get Saved Jobs Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
