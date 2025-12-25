const express = require('express');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/dashboard', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({ message: `Welcome to the Admin Dashboard, ${req.user.id}` });
});

module.exports = router;
