import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { app } from "./src/app.js";
import connectDB from "./src/db/index.js";
import path from "path";
import fs from "fs";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, ".env") });

// Ensure temp directory exists for file uploads
const tempDir = path.join(__dirname, "public", "temp");
if (!fs.existsSync(tempDir)) {
  console.log("Creating temp directory:", tempDir);
  fs.mkdirSync(tempDir, { recursive: true });
} else {
  console.log("Temp directory exists:", tempDir);
}

console.log("Environment check:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("PORT:", process.env.PORT || 8000);

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Connect to database and start server
connectDB()
  .then(() => {
    console.log("Database connected successfully");

    app.on("error", (error) => {
      console.error("Express error:", error);
    });

    const PORT = process.env.PORT || 8000;
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error('Server error:', error);
      }
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
