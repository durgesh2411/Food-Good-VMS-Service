import mongoose from 'mongoose';
import { User } from './src/models/user.model.js';
import { VolunteerWork } from './src/models/volunteerWork.model.js';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://durge8999:H1u4Pt5GgOjQ6O9i@cluster0.ub8cf.mongodb.net/food_good';

async function createTestData() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Create test users with volunteer role
    const testUsers = [
      {
        email: 'volunteer1@test.com',
        fullName: 'John Volunteer',
        number: '1234567890',
        avatar: 'https://res.cloudinary.com/demo/image/upload/v1/john.jpg',
        role: 'volunteer',
        password: '$2a$10$hashedpassword',
        totalWorkedHours: 25
      },
      {
        email: 'volunteer2@test.com',
        fullName: 'Jane Helper',
        number: '1234567891',
        avatar: 'https://res.cloudinary.com/demo/image/upload/v1/jane.jpg',
        role: 'volunteer',
        password: '$2a$10$hashedpassword',
        totalWorkedHours: 40
      },
      {
        email: 'volunteer3@test.com',
        fullName: 'Mike Worker',
        number: '1234567892',
        avatar: 'https://res.cloudinary.com/demo/image/upload/v1/mike.jpg',
        role: 'volunteer',
        password: '$2a$10$hashedpassword',
        totalWorkedHours: 15
      }
    ];

    // Insert test users (if they don't exist)
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`Created test user: ${userData.fullName}`);
      } else {
        // Update existing user to have volunteer role and worked hours
        await User.findByIdAndUpdate(existingUser._id, {
          role: 'volunteer',
          totalWorkedHours: userData.totalWorkedHours
        });
        console.log(`Updated existing user: ${existingUser.fullName}`);
      }
    }

    console.log('Test data created successfully!');
    
    // Check the results
    const volunteers = await User.find(
      { totalWorkedHours: { $gt: 0 }, role: "volunteer" },
      "fullName email totalWorkedHours"
    ).sort({ totalWorkedHours: -1 });
    
    console.log('Volunteers with hours:', volunteers);
    
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestData();
