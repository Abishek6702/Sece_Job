const User = require("../models/User");
const path = require("path");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.getDashboardStats = async (req, res) => {
    try {
      const totalEmployees = await User.countDocuments({
        role: "employee",
      });
  
      const totalEmployers = await User.countDocuments({
        role: "employer",
      });
  
      const pendingEmployers = await User.countDocuments({
        role: "employer",
        isApproved: false,
      });
  
      const approvedEmployers = await User.countDocuments({
        role: "employer",
        isApproved: true,
      });
  
      res.json({
        success: true,
        data: {
          totalEmployees,
          totalEmployers,
          pendingEmployers,
          approvedEmployers,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  exports.getDashboardCharts = async (req, res) => {
    try {
      const employees = await User.countDocuments({
        role: "employee",
      });
  
      const approvedEmployers = await User.countDocuments({
        role: "employer",
        isApproved: true,
      });
  
      const pendingEmployers = await User.countDocuments({
        role: "employer",
        isApproved: false,
      });
  
      const cityChart = await User.aggregate([
        {
          $match: {
            role: "employee",
          },
        },
        {
          $group: {
            _id: "$onboarding.currentCity",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            city: "$_id",
            count: 1,
            _id: 0,
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        {
          $limit: 6,
        },
      ]);
  
      res.json({
        success: true,
        pieChart: {
          employees,
          approvedEmployers,
          pendingEmployers,
        },
        cityChart,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };