const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail"); // your helper

router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Please fill all required fields" });
  }

  try {
    // Send to admin
    await sendEmail(
      process.env.EMAIL_USER,
      `New Contact Message from ${name}`,
      "contact",
      { name, email, phone: phone || "N/A", message },
      [
        {
          filename: "top-logo.png",
          path: require("path").join(__dirname, "../emails/assets/top-logo.png"),
          cid: "topLogo",
        },
      ]
    );

    // Send confirmation to user
    await sendEmail(
      email,
      "We received your message",
      "contact",
      { name, email, phone: phone || "N/A", message },
      [
        {
          filename: "top-logo.png",
          path: require("path").join(__dirname, "../emails/assets/top-logo.png"),
          cid: "topLogo",
        },
      ]
    );

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
