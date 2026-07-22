const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const { getDashboardStats, getDashboardCharts } = require('../controllers/adminDashboardController');


const router = express.Router();

router.get("/dashboard/stats",verifyToken, verifyAdmin, getDashboardStats);

router.get("/dashboard/charts",verifyToken ,verifyAdmin, getDashboardCharts);

module.exports = router;