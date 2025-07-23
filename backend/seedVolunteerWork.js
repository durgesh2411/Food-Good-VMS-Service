import mongoose from "mongoose";
import { VolunteerWork } from "./src/models/volunteerWork.model.js";
import { User } from "./src/models/user.model.js";
import connectDB from "./src/db/index.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const seedVolunteerWork = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to database for volunteer work seeding...");

    // Get existing volunteers
    const volunteers = await User.find({ role: "volunteer" });
    if (volunteers.length === 0) {
      console.log(
        "No volunteers found! Please run the main seed script first."
      );
      process.exit(1);
    }

    console.log(`Found ${volunteers.length} volunteers`);

    // Clear existing volunteer work
    await VolunteerWork.deleteMany({});

    // Create sample volunteer work entries
    const volunteerWorks = [
      {
        title: "Community Garden Project",
        description:
          "Helped establish and maintain a community garden in the local neighborhood. Planted vegetables, installed irrigation system, and taught community members about sustainable gardening practices.",
        numberOfHours: 15,
        workFile: "https://via.placeholder.com/400/garden-report.pdf",
        owner: volunteers[0]._id,
        status: "approved",
      },
      {
        title: "Senior Center Reading Program",
        description:
          "Organized and conducted weekly reading sessions for elderly residents. Created a library system and helped seniors with technology to access digital books.",
        numberOfHours: 8,
        workFile: "https://via.placeholder.com/400/reading-report.pdf",
        owner: volunteers[0]._id,
        status: "approved",
      },
      {
        title: "Local School Tutoring",
        description:
          "Provided math and science tutoring to underprivileged students. Developed learning materials and helped improve test scores by an average of 20%.",
        numberOfHours: 12,
        workFile: "https://via.placeholder.com/400/tutoring-report.pdf",
        owner: volunteers[1]._id,
        status: "approved",
      },
      {
        title: "Food Bank Volunteer",
        description:
          "Sorted and distributed food packages to families in need. Organized inventory system and helped coordinate delivery routes for maximum efficiency.",
        numberOfHours: 10,
        workFile: "https://via.placeholder.com/400/foodbank-report.pdf",
        owner: volunteers[1]._id,
        status: "approved",
      },
      {
        title: "Environmental Cleanup Drive",
        description:
          "Led a team of 20 volunteers in cleaning up the riverside area. Removed 500 lbs of trash and planted 50 trees to prevent soil erosion.",
        numberOfHours: 6,
        workFile: "https://via.placeholder.com/400/cleanup-report.pdf",
        owner: volunteers[2]._id,
        status: "approved",
      },
      {
        title: "Hospital Support Program",
        description:
          "Assisted hospital staff with patient care activities. Helped with meal distribution, comfort care, and family communication during visiting restrictions.",
        numberOfHours: 20,
        workFile: "https://via.placeholder.com/400/hospital-report.pdf",
        owner: volunteers[3]._id,
        status: "approved",
      },
      {
        title: "Youth Mentorship Program",
        description:
          "Mentored at-risk youth in career development and life skills. Conducted workshops on resume writing, interview skills, and financial literacy.",
        numberOfHours: 12,
        workFile: "https://via.placeholder.com/400/mentorship-report.pdf",
        owner: volunteers[2]._id,
        status: "pending",
      },
      {
        title: "Animal Shelter Assistance",
        description:
          "Helped care for rescued animals at the local shelter. Assisted with feeding, cleaning, socialization, and adoption events.",
        numberOfHours: 8,
        workFile: "https://via.placeholder.com/400/shelter-report.pdf",
        owner: volunteers[3]._id,
        status: "pending",
      },
    ];

    // Insert volunteer work records
    const createdWork = await VolunteerWork.insertMany(volunteerWorks);
    console.log(`Created ${createdWork.length} volunteer work entries`);

    // Update volunteer total hours (only for approved work)
    console.log("\nUpdating volunteer hours...");
    for (const work of createdWork) {
      if (work.status === "approved") {
        await User.findByIdAndUpdate(work.owner, {
          $inc: { totalWorkedHours: work.numberOfHours },
        });
        const volunteer = await User.findById(work.owner);
        console.log(
          `Updated ${volunteer.fullName}: +${work.numberOfHours} hours`
        );
      }
    }

    console.log("\nVolunteer Work Data Summary:");
    console.log(
      `- ${createdWork.filter((w) => w.status === "approved").length} approved works`
    );
    console.log(
      `- ${createdWork.filter((w) => w.status === "pending").length} pending works`
    );
    console.log("- Total hours distributed across volunteers");
    console.log("- Work files: Sample placeholder PDFs");

    console.log("\n✅ Volunteer work data seeded successfully!");
    console.log("\n📋 How to use the Volunteer Work System:");
    console.log("1. Volunteers submit work reports via frontend");
    console.log("2. Admin reviews and approves/rejects submissions");
    console.log("3. Approved hours are added to volunteer's total");
    console.log("4. Data appears in dashboard charts and leaderboard");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding volunteer work data:", error);
    process.exit(1);
  }
};

seedVolunteerWork();
