require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const Application = require("./models/JobApplication");
const User = require("./models/User");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const onboardingRoutes = require("./routes/onboardingRoutes");
const applicationRoutes = require("./routes/jobApplicationRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const postRoutes = require("./routes/postRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const templateRoutes = require("./routes/templateRoutes");
const contactRoute = require("./routes/contact");
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://job-portal-client-eosin-chi.vercel.app",
  "https://job-portal-client-git-main-abisheks-projects-b2a0a1da.vercel.app",
  "https://job-client-seven.vercel.app"
];

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ✅ Updated CORS setup
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow requests with no origin (Postman, curl)
    const normalizedOrigin = origin.replace(/\/$/, ""); // remove trailing slash
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
// Explicitly handle OPTIONS preflight for all routes
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id || decoded._id;
      if (userId) {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
      }
    } catch (err) {
      console.error("Token verification failed:", err);
    }
  }

  socket.on("join-user", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room via explicit request`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  socket.on("typing", ({ recipientId, senderId }) => {
    socket.to(recipientId).emit("typing", { senderId });
  });

  socket.on("stop-typing", ({ recipientId }) => {
    socket.to(recipientId).emit("stop-typing");
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/contact", contactRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/templates/previews", express.static(path.join(__dirname, "templates", "previews")));

// Start server after DB connection
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    // Start cron job after DB connection
    cron.schedule("*/1 * * * *", async () => {
      try {
        const cutoffDate = new Date();
        cutoffDate.setMinutes(cutoffDate.getMinutes() - 1);

        const deletedApplications = await Application.find({
          status: "rejected",
          rejectedAt: { $lt: cutoffDate },
        });

        if (deletedApplications.length > 0) {
          const deleteResult = await Application.deleteMany({
            status: "rejected",
            rejectedAt: { $lt: cutoffDate },
          });

          console.log(`Deleted ${deleteResult.deletedCount} rejected applications`);

          for (const application of deletedApplications) {
            await User.updateOne(
              { _id: application.userId },
              { $pull: { appliedJobs: application.jobId } }
            );
            console.log(`Removed job ${application.jobId} from user ${application.userId}`);
          }
        } else {
          console.log("No rejected applications older than 1 minute to delete.");
        }
      } catch (err) {
        console.error("Error in scheduled job:", err);
      }
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running with Socket.IO on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
})();
