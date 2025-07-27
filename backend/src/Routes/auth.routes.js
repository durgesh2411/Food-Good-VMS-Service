import { Router } from "express";
import passport from "../config/passport.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const router = Router();

// Check if OAuth is configured
const isOAuthConfigured = process.env.GOOGLE_CLIENT_ID && 
                         process.env.GOOGLE_CLIENT_SECRET && 
                         process.env.GOOGLE_CLIENT_ID !== 'placeholder-client-id' &&
                         process.env.GOOGLE_CLIENT_SECRET !== 'placeholder-client-secret';

// Google OAuth routes
router.get('/google', (req, res, next) => {
  if (!isOAuthConfigured) {
    return res.status(503).json({
      success: false,
      message: 'Google OAuth is not configured. Please contact administrator.'
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!isOAuthConfigured) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}?oauth=error&message=${encodeURIComponent('Google OAuth is not configured')}`);
  }
  
  passport.authenticate('google', { session: false }, async (err, user) => {
    try {
      if (err) {
        console.error('OAuth authentication error:', err);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}?oauth=error&message=${encodeURIComponent('Authentication failed')}`);
      }

      if (!user) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}?oauth=error&message=${encodeURIComponent('User not found')}`);
      }

      // Generate tokens
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      // Save refresh token
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      // Set cookies
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      };

      res.cookie("accessToken", accessToken, options);
      res.cookie("refreshToken", refreshToken, options);

      // Redirect to frontend with success
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}?oauth=success&user=${encodeURIComponent(JSON.stringify({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }))}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}?oauth=error&message=${encodeURIComponent('Authentication failed')}`);
    }
  })(req, res, next);
});

// Get current user (for OAuth flow verification)
router.get('/user', async (req, res) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    res.status(200).json(
      new ApiResponse(200, req.user, "User fetched successfully")
    );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export default router;
