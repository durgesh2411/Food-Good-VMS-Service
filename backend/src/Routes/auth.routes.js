import { Router } from "express";
import passport from "../config/passport.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const router = Router();

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      
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
  }
);

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
