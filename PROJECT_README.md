# 🤝 Volunteer Management System

A comprehensive full-stack web application for managing volunteers, events, donations, and community engagement.

## 📁 Project Structure

```
volunteer-management-system/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── controllers/       # API controllers
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   ├── middlewares/      # Custom middlewares
│   │   └── utils/            # Utility functions
│   ├── package.json
│   ├── index.js              # Server entry point
│   └── DEPLOYMENT_CHECKLIST.md
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   └── lib/              # Frontend utilities
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (Atlas recommended)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd volunteer-management-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Health Check: http://localhost:8000/api/v1/health

## 🌐 Deployment

### Render Deployment (Recommended)

This project is optimized for **Render** deployment using a **single repository, dual service** approach:

1. **Backend Service** (Web Service)
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Frontend Service** (Static Site)
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

### Step-by-Step Deployment Guide

Follow the detailed guide in `backend/DEPLOYMENT_CHECKLIST.md` for complete deployment instructions.

## 🔧 Features

- **User Management** - Registration, authentication, profiles
- **Event Management** - Create, manage, and track events
- **Volunteer Work** - Track volunteer activities and hours
- **Donations** - Handle donations with payment integration
- **Announcements** - Community announcements system
- **AI Chat** - OpenAI-powered assistance
- **Star Voting** - Community rating system
- **Email & SMS** - Automated notifications
- **Dashboard** - Analytics and reporting

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer + Cloudinary
- **Payments**: Razorpay
- **Email**: Nodemailer
- **SMS**: Twilio
- **AI**: OpenAI API

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components
- **State Management**: React hooks
- **HTTP Client**: Axios
- **Routing**: React Router

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=8000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
GMAIL_USERNAME=your_gmail
GMAIL_PASSWORD=your_gmail_app_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
OPENAI_API_KEY=your_openai_key
FRONTEND_URL=your_frontend_domain
```

## 📚 API Documentation

### Base URL
- Local: `http://localhost:8000/api/v1`
- Production: `https://your-backend.onrender.com/api/v1`

### Key Endpoints
- `GET /health` - Health check
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `GET /events` - Get all events
- `POST /donations` - Create donation
- `GET /dashboard/stats` - Dashboard statistics

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Check `backend/DEPLOYMENT_CHECKLIST.md` for deployment help
- Create an issue for bug reports
- Contact the development team for support

---

**Happy Volunteering! 🌟**
