const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');

// Send connection request
router.post('/request', async (req, res) => {
  const { senderId, receiverId } = req.body;
  const io = req.io;

  try {
    // Update sender and receiver fr notification
    await User.findByIdAndUpdate(senderId, { 
      $addToSet: { sentRequests: receiverId } 
    });
    
    await User.findByIdAndUpdate(receiverId, { 
      $addToSet: { pendingRequests: senderId } 
    });

    // Create notification
    const notification = new Notification({
      userId: receiverId,
      senderId: senderId,
      message: "Sent you a connection request",
      type: "connection_request"
    });
    await notification.save();

    // Send real-time notification
    io.to(receiverId.toString()).emit("new-notification", notification);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept connection request
router.post('/accept', async (req, res) => {
  const { senderId, receiverId } = req.body;
  const io = req.io;

  try {
    // Update both users' connections
    await User.findByIdAndUpdate(senderId, {
      $addToSet: { connections: receiverId },
      $pull: { sentRequests: receiverId }
    });

    await User.findByIdAndUpdate(receiverId, {
      $addToSet: { connections: senderId },
      $pull: { pendingRequests: senderId }
    });

    // Create acceptance notification
    const notification = new Notification({
      userId: senderId,
      senderId: receiverId,
      message: "Accepted your connection request",
      type: "connection_accepted"
    });
    await notification.save();

    // Send real-time notification
    io.to(senderId.toString()).emit("new-notification", notification);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject (ignore) a connection request
router.post('/reject', async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    if (!senderId || !receiverId) {
      console.error('Missing senderId or receiverId:', req.body);
      return res.status(400).json({ error: 'Missing senderId or receiverId' });
    }

    const receiverUpdate = await User.findByIdAndUpdate(receiverId, {
      $pull: { pendingRequests: senderId }
    });
    const senderUpdate = await User.findByIdAndUpdate(senderId, {
      $pull: { sentRequests: receiverId }
    });

    if (!receiverUpdate || !senderUpdate) {
      console.error('User not found:', { senderId, receiverId });
      return res.status(404).json({ error: 'User not found' });
    }

    const notification = await Notification.create({
      userId: senderId,
      senderId: receiverId,
      message: "Rejected your connection request",
      type: "connection_rejected"
    });

    req.io.to(senderId.toString()).emit("new-notification", notification);

    res.json({ success: true, message: "Connection request rejected." });
  } catch (error) {
    console.error('Error in /reject route:', error); // LOG THE ERROR
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Unconnect (remove connection between two users)
router.post('/unconnect', async (req, res) => {
  const { userId1, userId2 } = req.body;
  const io = req.io;

  try {
    // Remove each from the other's connections
    await User.findByIdAndUpdate(userId1, {
      $pull: { connections: userId2 }
    });
    await User.findByIdAndUpdate(userId2, {
      $pull: { connections: userId1 }
    });

    // // Optional: Notify the other user
    // const notification = await Notification.create({
    //   userId: userId2,
    //   senderId: userId1,
    //   message: "Removed you from connections",
    //   type: "connection_removed"
    // });

    // io.to(userId2.toString()).emit("new-notification", notification);

    res.json({ success: true, message: "Users unconnected." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get a user's connections with full details
router.get('/:userId/connections', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId)
      .populate({
        path: 'connections',
        select: '-password -__v', 
        options: { lean: true }   
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ connections: user.connections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});






module.exports = router;
