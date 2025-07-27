import mongoose from "mongoose";
import { User } from "./src/models/user.model.js";
import connectDB from "./src/db/index.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const testLeaderboardData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to database...");

    // Check all users
    const allUsers = await User.find({}, "fullName email role totalWorkedHours isAdmin");
    console.log("\n📊 All users in database:");
    allUsers.forEach(user => {
      console.log(`- ${user.fullName} (${user.email}) - Role: ${user.role}, Hours: ${user.totalWorkedHours}, Admin: ${user.isAdmin}`);
    });

    // Check volunteers specifically
    const volunteers = await User.find({ role: "volunteer" }, "fullName totalWorkedHours");
    console.log("\n👥 Volunteers:");
    volunteers.forEach(volunteer => {
      console.log(`- ${volunteer.fullName}: ${volunteer.totalWorkedHours} hours`);
    });

    // Check volunteers with hours > 0
    const volunteersWithHours = await User.find(
      { totalWorkedHours: { $gt: 0 }, role: "volunteer" },
      "fullName avatar totalWorkedHours"
    ).sort({ totalWorkedHours: -1 });

    console.log("\n⏰ Volunteers with hours > 0:");
    volunteersWithHours.forEach(volunteer => {
      console.log(`- ${volunteer.fullName}: ${volunteer.totalWorkedHours} hours`);
    });

    console.log(`\n✅ Total volunteers with hours: ${volunteersWithHours.length}`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit(0);
  }
};

testLeaderboardData();
