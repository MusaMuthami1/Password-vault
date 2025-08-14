const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// GitHub OAuth Strategy (easier alternative to Google)
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/api/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this GitHub ID
    let user = await User.findOne({ githubId: profile.id });
    
    if (user) {
      return done(null, user);
    }
    
    // Get primary email from GitHub profile
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.local`;
    
    // Check if user exists with the same email
    user = await User.findOne({ email });
    
    if (user) {
      // Link GitHub account to existing user
      user.githubId = profile.id;
      user.isVerified = true;
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    user = await User.create({
      githubId: profile.id,
      email,
      isVerified: true,
      // Generate a random password for GitHub users (they won't use it)
      password: await require('bcrypt').hash(Math.random().toString(36), 12)
    });
    
    done(null, user);
  } catch (err) {
    console.error('GitHub OAuth error:', err);
    done(err, null);
  }
}));

// Google OAuth Strategy - Only initialize if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // Check if user exists with the same email
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.isVerified = true;
        await user.save();
        return done(null, user);
      }
      
      // Create new user
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        isVerified: true,
        // Generate a random password for Google users (they won't use it)
        password: await require('bcrypt').hash(Math.random().toString(36), 12)
      });
      
      done(null, user);
    } catch (err) {
      console.error('Google OAuth error:', err);
      done(err, null);
    }
  }));
} else {
  console.log('Google OAuth not configured - only GitHub OAuth will be available');
}

module.exports = passport;
