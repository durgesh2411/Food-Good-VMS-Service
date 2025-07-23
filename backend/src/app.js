import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import axios from "axios";
import feedbackRoutes from "./Routes/feedback.routes.js";
import userRouter from "./Routes/user.routes.js";
import eventRouter from "./Routes/event.routes.js";
import postRouter from "./Routes/post.routes.js";
import announcementRouter from "./Routes/announcement.routes.js";
import volunteerWorkRouter from "./Routes/volunteerWork.routes.js";
import donationRouter from "./Routes/donation.routes.js";
import dashboardRouter from "./Routes/dashboard.routes.js";
import starVoteRouter from "./Routes/starVote.routes.js";
import genAIRouter from "./Routes/genAI.route.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";

axios.defaults.withCredentials = true;

const app = express();

// Development and production CORS configuration
const isDevelopment = process.env.NODE_ENV !== "production";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5174",
];

// Add production origins
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Add common production domains
if (!isDevelopment) {
  allowedOrigins.push(
    "https://volunteer-management-frontend.onrender.com",
    "https://vms-frontend.netlify.app",
    "https://vms-frontend.vercel.app"
  );
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, postman, etc.)
      if (!origin) return callback(null, true);

      // In development, be more permissive with localhost origins
      if (isDevelopment) {
        if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
          return callback(null, true);
        }
      }

      // Check if origin is in allowed origins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

// --- FIX: Add express.json() and express.urlencoded() BEFORE routes ---
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));
app.use(cookieParser());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.path.includes("/api/")) {
    console.log("Headers:", {
      authorization: req.headers.authorization ? "Present" : "Missing",
      cookie: req.headers.cookie ? "Present" : "Missing",
    });
  }
  next();
});

// Register feedback route and other routes after middleware
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/users", userRouter); // tested
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/announcements", announcementRouter);
app.use("/api/v1/donations", donationRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/volunteerWorks", volunteerWorkRouter);
app.use("/api/v1/star-votes", starVoteRouter); // New star voting system
app.use("/api/v1/ai", genAIRouter); // AI chat functionality

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: "1.0.0"
  });
});

// Test authentication endpoint
app.get("/api/v1/test-auth", verifyJWT, (req, res) => {
  res.json({
    success: true,
    message: "Authentication successful",
    user: req.user.email,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Volunteer Management System API",
    documentation: "/api/v1/health",
    version: "1.0.0"
  });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Catch-all handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    timestamp: new Date().toISOString()
  });
});

export { app };
