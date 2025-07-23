# Star Volunteer Voting System - Complete Guide

## Overview
The Star Volunteer Voting System allows regular users to vote for outstanding volunteers, which directly impacts the leaderboard rankings. This creates a community-driven recognition system.

## Features Implemented

### 1. **Star Voting Page** (`/vote-stars`)
- **Access**: Only regular users (role: "user") can access this page
- **Functionality**:
  - Browse all volunteers with search and filtering
  - Vote for volunteers with optional reason
  - Remove existing votes
  - Real-time vote count updates
  - Comprehensive volunteer information (hours, posts, total score)

### 2. **Home Page Star Voting Preview**
- **Display**: Shows top 3 star volunteers
- **Call-to-Action**: Links to full voting page
- **Only visible to regular users**

### 3. **Leaderboard Integration**
- **Priority Ranking**: Hours Worked → Star Votes → Posts Created
- **Dynamic Scoring**: (Hours × 100) + (Star Votes × 10) + Posts
- **Real-time Updates**: Reflects voting changes immediately
- **Top 3 Volunteers Showcase**: Only visible to volunteers and admins
- **Admin Feedback Panel**: Only visible to admins for taking actions
- **Feedback Dismissal**: Admins can dismiss/close feedback items once resolved

### 4. **Navigation Integration**
- **"Vote Stars" menu item**: Only visible to regular users
- **Role-based access control**: Prevents volunteers/admins from voting

### 5. **Role-Based Features**
- **Regular Users**: Can vote, see home page preview
- **Volunteers**: Can see top 3 showcase on leaderboard, cannot vote
- **Admins**: Can see top 3 showcase + feedback panel on leaderboard, cannot vote
- **Feedback Management**: Admins can dismiss resolved feedback items with X button

## Technical Architecture

### Backend Components
1. **StarVote Model** (`/backend/src/models/starVote.model.js`)
   - Unique voter-volunteer constraint
   - Optional reason field
   - Timestamps for tracking

2. **Star Vote Controller** (`/backend/src/Controllers/starVote.controller.js`)
   - `castStarVote`: Create new vote (users only)
   - `getVolunteerStarVotes`: Get vote details for volunteer
   - `getAllVolunteersWithVotes`: Get all volunteers with vote counts
   - `removeStarVote`: Remove user's vote
   - `checkUserVote`: Check if user already voted

3. **Star Vote Routes** (`/backend/src/Routes/starVote.routes.js`)
   - POST `/star-votes` - Cast vote
   - GET `/star-votes/volunteers` - Get all volunteers with votes
   - GET `/star-votes/volunteer/:id` - Get specific volunteer votes
   - GET `/star-votes/check/:id` - Check user vote status
   - DELETE `/star-votes/:id` - Remove vote

### Frontend Components
1. **StarVotingPage** (`/frontend/src/components/StarVoting/StarVotingPage.jsx`)
   - Full voting interface with search/filter
   - Modal for voting with reason
   - Vote management (add/remove)
   - Role-based access control

2. **StarVolunteerVotingHomePreview** (`/frontend/src/components/StarVoting/StarVolunteerVotingHomePreview.jsx`)
   - Top 3 volunteers showcase
   - Link to full voting page
   - Quick overview for home page

3. **Updated Leaderboard** (`/frontend/src/components/LeaderBoard/leader-board.jsx`)
   - Priority ranking system
   - Star vote integration
   - Enhanced UI with score display
   - **Top 3 Volunteers Showcase** (volunteers & admins only)
   - **Admin Feedback Panel** (admins only)

## How to Use

### For Regular Users:
1. **Login** as a regular user (not volunteer/admin)
2. **Navigate** to "Vote Stars" in the menu
3. **Browse** available volunteers
4. **Vote** for outstanding volunteers with optional reason
5. **View results** in the leaderboard

### For Volunteers:
- Cannot vote (voting restricted to regular users)
- Can view their ranking in leaderboard
- Can see **Top 3 Volunteers Showcase** on leaderboard page
- Benefits from user votes through improved ranking

### For Admins:
- Cannot vote (voting restricted to regular users)
- Can view overall voting statistics
- Can see **Top 3 Volunteers Showcase** on leaderboard page
- Can view **User Feedback Panel** on leaderboard for taking administrative actions
- Can **dismiss/close feedback items** once issues are resolved (X button)
- Can see leaderboard with voting impact

## API Endpoints Summary

```
POST   /api/v1/star-votes              - Cast vote for volunteer
GET    /api/v1/star-votes/volunteers   - Get all volunteers with vote counts
GET    /api/v1/star-votes/volunteer/:id - Get votes for specific volunteer
GET    /api/v1/star-votes/check/:id    - Check if user voted for volunteer
DELETE /api/v1/star-votes/:id          - Remove user's vote for volunteer
DELETE /api/v1/feedback/:id            - Dismiss feedback (admin only)
```

## Leaderboard Ranking Logic

```javascript
// Priority System:
1. Hours Worked (highest priority)
2. Star Votes (second priority)
3. Posts Created (third priority)

// Scoring System:
totalScore = (hoursWorked × 100) + (starVotes × 10) + approvedPosts

// Example:
Volunteer A: 10 hours, 5 stars, 8 posts = (10×100) + (5×10) + 8 = 1058 points
Volunteer B: 5 hours, 20 stars, 15 posts = (5×100) + (20×10) + 15 = 715 points
// Volunteer A ranks higher due to more hours worked
```

## User Flow Example

1. **User logs in** → Sees "Vote Stars" in navigation
2. **Clicks "Vote Stars"** → Redirected to `/vote-stars`
3. **Views volunteers** → Sees list with search/filter options
4. **Selects volunteer** → Modal opens for voting
5. **Provides reason** (optional) → Submits vote
6. **Vote recorded** → Volunteer's star count increases
7. **Leaderboard updates** → Ranking reflects new vote
8. **User can remove vote** → If they change their mind

## Security Features

- **Role-based access**: Only regular users can vote
- **Unique vote constraint**: One vote per user per volunteer
- **Authentication required**: All endpoints require login
- **Vote ownership**: Users can only remove their own votes

## Future Enhancements (Suggestions)

1. **Vote Comments**: Display voting reasons publicly
2. **Vote History**: Track voting patterns and trends
3. **Voting Notifications**: Notify volunteers when they receive votes
4. **Voting Rewards**: Gamification for active voters
5. **Anonymous Voting**: Option to hide voter identity
6. **Vote Categories**: Different types of recognition (helpful, innovative, etc.)

## Testing the System

1. **Start Backend**: `npm start` in `/backend`
2. **Start Frontend**: `npm run dev` in `/frontend`
3. **Create Test Users**: Register users with different roles
4. **Test Voting**: Login as regular user → vote for volunteers
5. **Check Leaderboard**: Verify ranking updates based on votes
6. **Test Access Control**: Verify volunteers/admins cannot vote

## Troubleshooting

### Common Issues

#### 1. "Access token is required" Errors
```
Error: Access token is required. Please login to continue.
Headers: { authorization: 'Missing', cookie: 'Missing' }
```
**Solution**: This is normal when no user is logged in. The error appears because:
- Frontend components check user authentication on page load
- No user is currently logged in
- Backend correctly rejects unauthenticated requests

**Fix**: Register a new user and login to access protected features.

#### 2. Registration "409 Conflict" Error
```
POST http://localhost:5174/api/v1/users/register 409 (Conflict)
Error: User with this phone number already exists
```
**Solution**:
- Use a different phone number (the one you tried already exists)
- Try a completely new email and 10-digit phone number
- Ensure all fields are filled, especially the avatar image

#### 3. FormData/File Upload Issues
**Problem**: Registration fails with file upload errors
**Solution**:
- Ensure an image file is selected for avatar
- Use FormData instead of regular JSON for file uploads
- Check Content-Type is set to "multipart/form-data"

#### 4. CORS Issues
**Problem**: Frontend can't connect to backend
**Solution**:
- Ensure both servers are running (frontend: 5174, backend: 8000)
- Check CORS configuration allows your frontend origin
- Verify API URLs use full backend URL with port

### Testing Steps

1. **Start Both Servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Register New User**:
   - Go to http://localhost:5174/register
   - Fill all fields with NEW data
   - Upload an avatar image
   - Submit form

3. **Login**:
   - Go to http://localhost:5174/login
   - Use the email/password from registration
   - Should redirect to home page

4. **Test Star Voting**:
   - As regular user: Click "Vote Stars" in navigation
   - Browse volunteers and cast votes
   - Check leaderboard for updated rankings

5. **Test Role Access**:
   - Regular users: Can vote and see "Vote Stars" menu
   - Volunteers/Admins: Cannot vote, no "Vote Stars" menu

## Files Modified/Created

### Backend:
- ✅ `/src/models/starVote.model.js`
- ✅ `/src/Controllers/starVote.controller.js`
- ✅ `/src/Routes/starVote.routes.js`
- ✅ `/src/Controllers/feedback.controller.js` (added deleteFeedback)
- ✅ `/src/Routes/feedback.routes.js` (added DELETE route)
- ✅ `/src/app.js` (added star-votes routes)

### Frontend:
- ✅ `/src/components/StarVoting/StarVotingPage.jsx`
- ✅ `/src/components/StarVoting/StarVolunteerVotingHomePreview.jsx`
- ✅ `/src/components/ui/input.jsx`
- ✅ `/src/components/Header/Navbar.jsx` (added Vote Stars link, fixed login/logout)
- ✅ `/src/components/LeaderBoard/leader-board.jsx` (updated ranking)
- ✅ `/src/components/Home/Home.jsx` (updated import)
- ✅ `/src/App.jsx` (added route)

The system is now fully functional and integrated! 🎉
