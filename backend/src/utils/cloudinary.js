import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../../.env');
dotenv.config({ path: envPath });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config Check:");
console.log("  Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "✅" : "❌");
console.log("  API Key:", process.env.CLOUDINARY_API_KEY ? "✅" : "❌");
console.log("  API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅" : "❌");

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // uploading
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file uploaded
    // console.log("file uploaded", response);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temp file as upload got failed
    throw new Error("cloudinary upload failed " + error.message);
  }
};

const deleteFromCloudinary = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

export { uploadOnCloudinary, deleteFromCloudinary };
