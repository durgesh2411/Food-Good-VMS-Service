import mongoose from "mongoose";
import { Event } from "./src/models/event.model.js";
import { User } from "./src/models/user.model.js";
import connectDB from "./src/db/index.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const seedSampleData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to database for seeding...");

    // Create sample volunteers with hours
    const volunteers = [
      {
        fullName: "John Doe",
        email: "john@example.com",
        number: "1234567890",
        avatar: "https://via.placeholder.com/150/john",
        password: "password123",
        role: "volunteer",
        totalWorkedHours: 45,
        totalDonatedAmount: 100,
      },
      {
        fullName: "Jane Smith",
        email: "jane@example.com",
        number: "1234567891",
        avatar: "https://via.placeholder.com/150/jane",
        password: "password123",
        role: "volunteer",
        totalWorkedHours: 32,
        totalDonatedAmount: 150,
      },
      {
        fullName: "Mike Johnson",
        email: "mike@example.com",
        number: "1234567892",
        avatar: "https://via.placeholder.com/150/mike",
        password: "password123",
        role: "volunteer",
        totalWorkedHours: 28,
        totalDonatedAmount: 200,
      },
      {
        fullName: "Sarah Wilson",
        email: "sarah@example.com",
        number: "1234567893",
        avatar: "https://via.placeholder.com/150/sarah",
        password: "password123",
        role: "volunteer",
        totalWorkedHours: 55,
        totalDonatedAmount: 75,
      },
      {
        fullName: "Regular User",
        email: "user@example.com",
        number: "1234567894",
        avatar: "https://via.placeholder.com/150/user",
        password: "password123",
        role: "user",
        totalWorkedHours: 0,
        totalDonatedAmount: 50,
      },
    ];

    // Clear existing data
    await User.deleteMany({ email: { $in: volunteers.map((v) => v.email) } });
    await Event.deleteMany({});

    // Insert volunteers
    const createdVolunteers = await User.insertMany(volunteers);
    console.log(`Created ${createdVolunteers.length} sample users`);

    // Create sample events with participants
    const events = [
      {
        title: "Community Clean Up",
        description: "Help clean up the local park",
        date: "2025-02-01",
        time: "09:00",
        location: "Central Park",
        event_image: "cleanup.jpg",
        participants: [
          createdVolunteers[0]._id,
          createdVolunteers[1]._id,
          createdVolunteers[4]._id,
        ],
      },
      {
        title: "Food Drive",
        description: "Collect food for local families",
        date: "2025-02-15",
        time: "10:00",
        location: "Community Center",
        event_image: "fooddrive.jpg",
        participants: [
          createdVolunteers[1]._id,
          createdVolunteers[2]._id,
          createdVolunteers[3]._id,
          createdVolunteers[4]._id,
        ],
      },
      {
        title: "Elderly Care Visit",
        description: "Visit and assist elderly residents",
        date: "2025-03-01",
        time: "14:00",
        location: "Sunshine Senior Home",
        event_image: "elderly.jpg",
        participants: [createdVolunteers[0]._id, createdVolunteers[3]._id],
      },
      {
        title: "Tree Planting",
        description: "Plant trees in the community",
        date: "2025-03-15",
        time: "08:00",
        location: "Riverside Area",
        event_image: "trees.jpg",
        participants: [
          createdVolunteers[0]._id,
          createdVolunteers[1]._id,
          createdVolunteers[2]._id,
        ],
      },
      {
        title: "School Reading Program",
        description: "Read books to children",
        date: "2025-04-01",
        time: "15:00",
        location: "Elementary School",
        event_image: "reading.jpg",
        participants: [
          createdVolunteers[2]._id,
          createdVolunteers[3]._id,
          createdVolunteers[4]._id,
        ],
      },
      {
        title: "Hospital Volunteer",
        description: "Help at the local hospital",
        date: "2025-04-15",
        time: "09:00",
        location: "City Hospital",
        event_image: "hospital.jpg",
        participants: [
          createdVolunteers[0]._id,
          createdVolunteers[1]._id,
          createdVolunteers[2]._id,
          createdVolunteers[3]._id,
        ],
      },
    ];

    const createdEvents = await Event.insertMany(events);
    console.log(`Created ${createdEvents.length} sample events`);

    console.log("Sample data seeded successfully!");
    console.log("\nSample Data Summary:");
    console.log(`- ${createdVolunteers.length} users created`);
    console.log(`- ${createdEvents.length} events created`);
    console.log("- Volunteer hours: 45, 32, 28, 55");
    console.log("- Event participants range: 2-4 per event");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedSampleData();
