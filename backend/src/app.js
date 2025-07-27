import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import axios from "axios";
import passport from "./config/passport.js";
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
import authRouter from "./Routes/auth.routes.js";
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
  console.log("Added FRONTEND_URL to CORS:", process.env.FRONTEND_URL);
}

// Add common production domains
if (!isDevelopment) {
  const productionDomains = [
    "https://volunteer-management-frontend.onrender.com",
    "https://food-good-vms-frontend.onrender.com",
    "https://vms-frontend.netlify.app",
    "https://vms-frontend.vercel.app"
  ];
  allowedOrigins.push(...productionDomains);
  console.log("Added production domains to CORS:", productionDomains);
}

console.log("All allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      console.log(`🌐 CORS Request from origin: ${origin}`);

      // Allow requests with no origin (mobile apps, curl, postman, etc.)
      if (!origin) {
        console.log("✅ CORS: Allowing request with no origin");
        return callback(null, true);
      }

      // In development, be more permissive with localhost origins
      if (isDevelopment) {
        if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
          console.log("✅ CORS: Allowing localhost origin in development");
          return callback(null, true);
        }
      }

      // Check if origin is in allowed origins
      if (allowedOrigins.includes(origin)) {
        console.log("✅ CORS: Origin allowed");
        callback(null, true);
      } else {
        console.log(`❌ CORS blocked origin: ${origin}`);
        console.log(`📋 Allowed origins: ${JSON.stringify(allowedOrigins, null, 2)}`);
        callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
  })
);

// --- FIX: Add express.json() and express.urlencoded() BEFORE routes ---
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));
app.use(cookieParser());

// Session middleware for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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
app.use("/api/v1/auth", authRouter); // Google OAuth authentication

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
