# Volunteer Management System - Backend

## Deployment Guide for Render

### Prerequisites
- Node.js 18.x or higher
- MongoDB Atlas account (or other MongoDB hosting)
- Render account

### Environment Variables
Create the following environment variables in your Render dashboard:

```
NODE_ENV=production
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend-domain.com
ACCESS_TOKEN_SECRET=your-secure-access-token-secret
REFRESH_TOKEN_SECRET=your-secure-refresh-token-secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
GMAIL_USERNAME=your-email@gmail.com
GMAIL_PASSWORD=your-app-specific-password
GMAIL_PORT=587
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
OPENAI_API_KEY=your-openai-api-key
```

### Render Deployment Steps

1. **Connect your repository** to Render
2. **Create a new Web Service**
3. **Configure the service:**
   - **Name**: volunteer-management-backend
   - **Root Directory**: `/backend` (if your backend is in a subdirectory)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: 18

4. **Add all environment variables** from the list above
5. **Deploy** the service

### MongoDB Atlas Setup
1. Create a MongoDB Atlas cluster
2. Add your Render server IP to the IP whitelist (or use 0.0.0.0/0 for all IPs)
3. Create a database user with read/write permissions
4. Get the connection string and add it to `MONGODB_URI`

### Security Notes
- Ensure all secrets are properly set in Render environment variables
- Use strong, unique secrets for JWT tokens
- Whitelist only necessary IPs in MongoDB Atlas
- Keep your API keys secure and never commit them to version control

### Health Check
Your deployed service will be available at: `https://your-service-name.onrender.com`
Health check endpoint: `https://your-service-name.onrender.com/api/v1/health`

### CORS Configuration
Update the `FRONTEND_URL` environment variable with your actual frontend domain to ensure proper CORS handling.

### Troubleshooting
- Check Render logs for any deployment errors
- Ensure all environment variables are properly set
- Verify MongoDB connection string and credentials
- Check that all required ports are properly configured
