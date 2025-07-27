import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import dotenv from 'dotenv';

dotenv.config();

// Google OAuth Strategy - only configure if credentials are available and valid
const isValidOAuthCredentials = process.env.GOOGLE_CLIENT_ID &&
                               process.env.GOOGLE_CLIENT_SECRET &&
                               process.env.GOOGLE_CLIENT_ID !== 'placeholder-client-id' &&
                               process.env.GOOGLE_CLIENT_SECRET !== 'placeholder-client-secret';

if (isValidOAuthCredentials) {
  console.log('✅ Google OAuth credentials found, configuring strategy...');
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://food-good-vms-service.onrender.com/api/v1/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let existingUser = await User.findOne({ email: profile.emails[0].value });

    if (existingUser) {
      return done(null, existingUser);
    }

    // Create new user
    const newUser = new User({
      fullName: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value,
      number: '', // Will need to be filled later
      role: 'user',
      password: 'google-oauth-user', // Placeholder password for OAuth users
      isGoogleUser: true
    });

    await newUser.save();
    return done(null, newUser);
  } catch (error) {
    return done(error, null);
  }
}));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
} else {
  console.log('⚠️ Google OAuth credentials not found. OAuth functionality will be disabled.');
}

export default passport;
