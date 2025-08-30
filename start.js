const mongoose = require("mongoose");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

connectDB();

// Ensure session folder exists
const sessionPath = path.join(__dirname, process.env.SESSION_FOLDER || "auth");
if (!fs.existsSync(sessionPath)) {
  fs.mkdirSync(sessionPath);
  console.log("📂 Session folder created:", sessionPath);
} else {
  console.log("📂 Session folder exists:", sessionPath);
}

// Example server (for Koyeb)
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("✅ ELSA-2.0 Bot Running with MongoDB & Pairing Code System!");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
