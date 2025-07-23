import mongoose from "mongoose";
import { User } from "./src/models/user.model.js";
import connectDB from "./src/db/index.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to database...");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin user
    const adminUser = new User({
      fullName: "Admin User",
      email: "admin@example.com",
      number: "9999999999",
      avatar: "https://via.placeholder.com/150/admin",
      password: hashedPassword,
      role: "volunteer",
      isAdmin: true,
      totalWorkedHours: 0,
      totalDonatedAmount: 0,
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();
