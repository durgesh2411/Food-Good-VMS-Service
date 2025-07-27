# Google OAuth Setup Guide

## 🔧 Setting Up Google OAuth for Food Good VMS

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API and Google OAuth2 API

### Step 2: Create OAuth Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Configure:
   - **Name**: Food Good VMS
   - **Authorized JavaScript origins**: 
     - `http://localhost:8000`
     - `https://food-good-vms-service.onrender.com`
   - **Authorized redirect URIs**:
     - `http://localhost:8000/api/v1/auth/google/callback`
     - `https://food-good-vms-service.onrender.com/api/v1/auth/google/callback`

### Step 3: Update Environment Variables
Add to your `.env` file:
```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here  
SESSION_SECRET=your_random_session_secret_here
```

### Step 4: Update Render Environment Variables
In Render dashboard, add the same variables:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SESSION_SECRET`

### Step 5: Test OAuth Flow
1. Click "Sign in with Google" button
2. Should redirect to Google login
3. After authorization, redirects back to your app
4. User should be logged in automatically

## 🚨 Current Status
- ✅ Avatar preview functionality is working
- ✅ Google OAuth infrastructure is set up  
- ⚠️ Requires Google Cloud credentials to be fully functional
- 💡 Placeholder message shows until credentials are configured

## 🔗 Helpful Links
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Setup Guide](https://developers.google.com/identity/protocols/oauth2)
