import mongoose from "mongoose";
import { User } from "./src/models/user.model.js";
import connectDB from "./src/db/index.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const createTestAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to database...");

    // Delete existing test admin
    await User.deleteOne({ email: "testadmin@test.com" });

    // Create test admin user with known password
    const testAdmin = new User({
      fullName: "Test Admin",
      email: "testadmin@test.com",
      number: "1111111111",
      avatar: "https://via.placeholder.com/150/testadmin",
      password: "test123", // This will be hashed by the pre-save hook
      role: "volunteer",
      isAdmin: true,
      totalWorkedHours: 0,
      totalDonatedAmount: 0,
    });

    await testAdmin.save();
    console.log("Test admin user created successfully!");
    console.log("Email: testadmin@test.com");
    console.log("Password: test123");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit(0);
  }
};

createTestAdmin();
