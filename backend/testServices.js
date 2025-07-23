import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of the current module and load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log("🧪 Testing All External Services");
console.log("================================");

// Test 1: Environment Variables Loading
console.log("\n1. 📋 Environment Variables Check:");
console.log("   CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Present" : "❌ Missing");
console.log("   CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ Present" : "❌ Missing");
console.log("   CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Present" : "❌ Missing");
console.log("   TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID ? "✅ Present" : "❌ Missing");
console.log("   TWILIO_AUTH_TOKEN:", process.env.TWILIO_AUTH_TOKEN ? "✅ Present" : "❌ Missing");
console.log("   TWILIO_PHONE_NUMBER:", process.env.TWILIO_PHONE_NUMBER ? "✅ Present" : "❌ Missing");
console.log("   GMAIL_USERNAME:", process.env.GMAIL_USERNAME ? "✅ Present" : "❌ Missing");
console.log("   GMAIL_PASSWORD:", process.env.GMAIL_PASSWORD ? "✅ Present" : "❌ Missing");

// Test 2: Cloudinary
console.log("\n2. ☁️  Testing Cloudinary:");
try {
  const { v2: cloudinary } = await import("cloudinary");
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Test cloudinary connection
  const result = await cloudinary.api.ping();
  console.log("   ✅ Cloudinary connection successful:", result.status);
  
  // Test upload with a simple text file
  try {
    const fs = await import("fs");
    const path = await import("path");
    
    // Create a test file
    const testFilePath = path.join(__dirname, '../public/temp/test.txt');
    fs.writeFileSync(testFilePath, 'This is a test file for Cloudinary upload');
    
    const uploadResult = await cloudinary.uploader.upload(testFilePath, {
      resource_type: "auto",
      public_id: "test_upload_" + Date.now()
    });
    
    console.log("   ✅ Test upload successful:");
    console.log("      URL:", uploadResult.secure_url);
    console.log("      Public ID:", uploadResult.public_id);
    
    // Clean up: delete the uploaded file
    await cloudinary.uploader.destroy(uploadResult.public_id);
    fs.unlinkSync(testFilePath);
    console.log("   ✅ Test file cleaned up");
    
  } catch (uploadError) {
    console.log("   ❌ Upload test failed:", uploadError.message);
  }
  
} catch (error) {
  console.log("   ❌ Cloudinary test failed:", error.message);
}

// Test 3: Twilio
console.log("\n3. 📱 Testing Twilio:");
try {
  const twilio = await import("twilio");
  const client = twilio.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  // Test Twilio connection by fetching account info
  const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
  console.log("   ✅ Twilio connection successful");
  console.log("      Account SID:", account.sid);
  console.log("      Account Status:", account.status);
  
  // Note: We won't send an actual SMS to avoid charges, but we can validate the setup
  console.log("   ✅ Twilio SMS service ready");
  console.log("      From Number:", process.env.TWILIO_PHONE_NUMBER);
  
} catch (error) {
  console.log("   ❌ Twilio test failed:", error.message);
}

// Test 4: Nodemailer
console.log("\n4. 📧 Testing Nodemailer (Gmail):");
try {
  const nodemailer = await import("nodemailer");
  
  const transporter = nodemailer.default.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD
    }
  });
  
  // Verify the connection
  const verified = await transporter.verify();
  console.log("   ✅ Gmail SMTP connection successful:", verified);
  
  // Test email configuration (without sending)
  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: process.env.GMAIL_USERNAME, // Send to self for testing
    subject: 'VMS Test Email - ' + new Date().toISOString(),
    text: 'This is a test email from the Volunteer Management System.',
    html: '<h3>Test Email</h3><p>This is a test email from the Volunteer Management System.</p>'
  };
  
  console.log("   ✅ Email service configured and ready");
  console.log("      From:", mailOptions.from);
  console.log("      Test recipient:", mailOptions.to);
  
} catch (error) {
  console.log("   ❌ Nodemailer test failed:", error.message);
}

console.log("\n🎉 Service Testing Complete!");
console.log("================================");
