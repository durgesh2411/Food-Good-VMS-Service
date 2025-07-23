import dotenv from "dotenv";
dotenv.config();

console.log("Starting server...");
console.log("Working directory:", process.cwd());
console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);

// Import the main app
import("./index.js")
  .then(() => {
    console.log("Server imported successfully");
  })
  .catch((err) => {
    console.error("Error importing server:", err);
  });
