const mongoose = require("mongoose");
const dns = require("dns");
const connectDB = async () => {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`✅ MongoDB connected successfully!!!`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error; // Important so caller knows it failed
  }
};

module.exports = connectDB;