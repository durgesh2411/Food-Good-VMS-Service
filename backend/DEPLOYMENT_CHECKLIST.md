# Render Deployment Checklist

## Pre-Deployment Steps

### 1. Code Preparation ✅
- [x] Updated `index.js` for production deployment
- [x] Enhanced `package.json` with proper dependencies and scripts
- [x] Improved database connection with production settings
- [x] Added proper CORS configuration for production
- [x] Added comprehensive error handling
- [x] Created health check endpoint
- [x] Added environment configuration

### 2. Files Created ✅
- [x] `.env.example` - Template for environment variables
- [x] `RENDER_DEPLOYMENT.md` - Detailed deployment instructions
- [x] `render.yaml` - Render configuration file
- [x] `.gitignore` - Git ignore file for security
- [x] `healthcheck.js` - Health check script

## Render Deployment Steps

### 1. Repository Setup (Single Repo Approach - Recommended)
- [ ] Push your entire project to GitHub/GitLab/Bitbucket
- [ ] Ensure `.env` is NOT committed (should be in `.gitignore`)
- [ ] Keep both `frontend/` and `backend/` folders in the same repository

### 2. Backend Service Creation
- [ ] Log into [Render Dashboard](https://dashboard.render.com)
- [ ] Click "New +" → "Web Service"
- [ ] Connect your repository
- [ ] Configure the backend service:
  - **Name**: `volunteer-management-backend`
  - **Environment**: `Node`
  - **Region**: Choose closest to your users
  - **Branch**: `main` or `master`
  - **Root Directory**: `backend` ⚠️ **Important: Set this to backend folder**
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`

### 3. Frontend Service Creation (Optional - if deploying frontend on Render)
- [ ] Click "New +" → "Static Site"
- [ ] Connect the SAME repository
- [ ] Configure the frontend service:
  - **Name**: `volunteer-management-frontend`
  - **Branch**: `main` or `master`
  - **Root Directory**: `frontend` ⚠️ **Important: Set this to frontend folder**
  - **Build Command**: `npm install && npm run build`
  - **Publish Directory**: `dist` (for Vite) or `build` (for Create React App)

### 4. Environment Variables Setup
Add these environment variables in Render **Backend Service**:

**Required Variables:**
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `8000`
- [ ] `MONGODB_URI` = Your MongoDB connection string
- [ ] `ACCESS_TOKEN_SECRET` = Strong secret (generate new for production)
- [ ] `REFRESH_TOKEN_SECRET` = Strong secret (generate new for production)

**Optional but Recommended:**
- [ ] `FRONTEND_URL` = Your frontend domain
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `RAZORPAY_KEY_ID`
- [ ] `RAZORPAY_KEY_SECRET`
- [ ] `GMAIL_USERNAME`
- [ ] `GMAIL_PASSWORD`
- [ ] `TWILIO_ACCOUNT_SID`
- [ ] `TWILIO_AUTH_TOKEN`
- [ ] `TWILIO_PHONE_NUMBER`
- [ ] `OPENAI_API_KEY`

### 5. Database Setup
- [ ] Ensure MongoDB Atlas is configured
- [ ] Whitelist Render's IP ranges (or use 0.0.0.0/0)
- [ ] Test connection string

### 6. Deploy Services
- [ ] Deploy Backend: Click "Create Web Service"
- [ ] Deploy Frontend: Click "Create Static Site" (if using Render for frontend)
- [ ] Wait for deployments to complete
- [ ] Check logs for any errors

### 7. Connect Frontend to Backend
- [ ] Update frontend API base URL to your backend service URL
- [ ] Add frontend domain to backend CORS configuration

## Post-Deployment Verification

### 1. Health Check
- [ ] Visit: `https://your-app-name.onrender.com/api/v1/health`
- [ ] Should return: `{"success": true, "message": "Server is running", ...}`

### 2. API Endpoints Test
- [ ] Test user registration endpoint
- [ ] Test authentication endpoints
- [ ] Test other core functionality

### 3. CORS Testing
- [ ] Test frontend connection
- [ ] Verify CORS headers are working

## Security Checklist

- [ ] All sensitive data is in environment variables
- [ ] Strong JWT secrets are used
- [ ] Database connection is secure
- [ ] API keys are not exposed in logs
- [ ] CORS is properly configured

## Monitoring

- [ ] Set up Render alerts
- [ ] Monitor application logs
- [ ] Set up uptime monitoring
- [ ] Monitor database performance

## Troubleshooting

### Common Issues:
1. **MongoDB Connection Failed**
   - Check connection string
   - Verify IP whitelist
   - Check database credentials

2. **Environment Variables Not Loading**
   - Verify all required env vars are set in Render
   - Check spelling and casing

3. **CORS Errors**
   - Update `FRONTEND_URL` environment variable
   - Check allowed origins in `app.js`

4. **Deployment Fails**
   - Check build logs
   - Verify Node.js version compatibility
   - Check package.json dependencies

### Useful Commands:
```bash
# Test health check locally
npm run healthcheck

# Start development server
npm run dev

# Start production server
npm start
```

## Support

For deployment issues:
- Check Render documentation: https://render.com/docs
- Review application logs in Render dashboard
- Test locally first with production environment variables
