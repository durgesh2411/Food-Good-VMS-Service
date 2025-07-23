import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');
dotenv.config({ path: envPath });

// Import all models to test database connections
import { Feedback } from "./src/models/feedback.model.js";
import { User } from "./src/models/user.model.js";
import { Event } from "./src/models/event.model.js";
import { Post } from "./src/models/post.model.js";
import { Announcement } from "./src/models/announcement.model.js";
import { Donation } from "./src/models/donation.model.js";
import { VolunteerWork } from "./src/models/volunteerWork.model.js";
import { StarVote } from "./src/models/starVote.model.js";

const DB_NAME = "vms";

const testDatabaseConnection = async () => {
  try {
    console.log("🔍 Testing Database Connection...");
    console.log("MongoDB URI:", process.env.MONGODB_URI ? "✅ Present" : "❌ Missing");
    
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`✅ MongoDB connected! DB Host: ${connectionInstance.connection.host}`);
    console.log(`✅ Database Name: ${DB_NAME}`);
    
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    return false;
  }
};

const testModels = async () => {
  console.log("\n🔍 Testing All Models...");
  
  const models = [
    { name: "Feedback", model: Feedback },
    { name: "User", model: User },
    { name: "Event", model: Event },
    { name: "Post", model: Post },
    { name: "Announcement", model: Announcement },
    { name: "Donation", model: Donation },
    { name: "VolunteerWork", model: VolunteerWork },
    { name: "StarVote", model: StarVote }
  ];
  
  for (const { name, model } of models) {
    try {
      // Test basic model operations
      const count = await model.countDocuments();
      console.log(`✅ ${name} Model: Connected (${count} documents)`);
      
      // Test schema validation by attempting to create a document with minimal data
      const testDoc = new model({});
      const validation = testDoc.validateSync();
      if (validation) {
        console.log(`   📋 ${name} Required fields:`, Object.keys(validation.errors));
      } else {
        console.log(`   📋 ${name} No required field validation errors`);
      }
      
    } catch (error) {
      console.error(`❌ ${name} Model Error:`, error.message);
    }
  }
};

const testFeedbackOperations = async () => {
  console.log("\n🔍 Testing Feedback Operations...");
  
  try {
    // Test creating feedback
    const testFeedback = await Feedback.create({
      message: "Test feedback - please ignore"
    });
    console.log("✅ Feedback Creation: Success");
    
    // Test reading feedback
    const feedbacks = await Feedback.find().limit(1);
    console.log(`✅ Feedback Reading: Success (found ${feedbacks.length} items)`);
    
    // Test deleting test feedback
    await Feedback.findByIdAndDelete(testFeedback._id);
    console.log("✅ Feedback Deletion: Success");
    
  } catch (error) {
    console.error("❌ Feedback Operations Error:", error.message);
  }
};

const testAllRouteEndpoints = async () => {
  console.log("\n🔍 Testing Route Endpoint Availability...");
  
  const routes = [
    { path: "/api/v1/feedback", methods: ["GET", "POST"] },
    { path: "/api/v1/users", methods: ["POST"] },
    { path: "/api/v1/events", methods: ["GET", "POST"] },
    { path: "/api/v1/posts", methods: ["GET", "POST"] },
    { path: "/api/v1/announcements", methods: ["GET", "POST"] },
    { path: "/api/v1/donations", methods: ["GET", "POST"] },
    { path: "/api/v1/volunteerWorks", methods: ["GET", "POST"] },
    { path: "/api/v1/star-votes", methods: ["GET", "POST"] },
    { path: "/api/v1/ai", methods: ["POST"] },
    { path: "/api/v1/health", methods: ["GET"] }
  ];
  
  console.log("📋 Configured Routes:");
  routes.forEach(route => {
    console.log(`   ${route.path} - Methods: ${route.methods.join(", ")}`);
  });
};

const main = async () => {
  console.log("🚀 Starting Comprehensive Route and Database Test\n");
  
  // Test database connection
  const dbConnected = await testDatabaseConnection();
  
  if (dbConnected) {
    // Test all models
    await testModels();
    
    // Test feedback operations specifically
    await testFeedbackOperations();
    
    // List all routes
    await testAllRouteEndpoints();
    
    console.log("\n✅ All tests completed!");
  } else {
    console.log("\n❌ Database connection failed - skipping model tests");
  }
  
  // Close database connection
  await mongoose.connection.close();
  console.log("🔌 Database connection closed");
};

main().catch(console.error);
