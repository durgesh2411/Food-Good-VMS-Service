# Volunteer Management System (RAG client-suport-agent)

A comprehensive full-stack web application for managing volunteers, events, donations, and community engagement with modern features like AI integration, payment processing, and real-time notifications.

## Features

### **Authentication & Authorization**
- Role-based access control (Admin, Volunteer, User)
- JWT-based authentication
- Secure session management

### **Dashboard & Analytics**
- Real-time statistics and charts
- Role-specific dashboards
- Data visualization with interactive charts

### **Event Management**
- Create and manage volunteer events
- Event registration and tracking
- Event analytics and reporting

### **Donation System**
- Razorpay payment gateway integration
- Donation tracking and receipts
- Automated thank-you emails

### **Volunteer Features**
- Star voting system for volunteers
- Leaderboard rankings
- Volunteer work hour tracking
- Post creation and management

### **Communication**
- Announcement system
- Email notifications (Nodemailer)
- SMS notifications (Twilio)
- Feedback management

### **AI Integration**
- OpenAI-powered chat assistance
- Intelligent content generation
- Smart recommendations

### **Modern UI/UX**
- Responsive design with Tailwind CSS
- Smooth animations and transitions
- Mobile-first approach
- Dark/light theme support

## Tech Stack

### **Frontend**
- React 18
- Tailwind CSS
- Responsive Design
- Vite (Build Tool)
- React Router
- Chart.js/Recharts
- Axios

### **Backend**
- RAG support system
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (File Upload)
- Cloudinary (Media Storage)

### **Services & Integrations**
- Razorpay (Payment Gateway)
- Nodemailer (Email Service)
- Twilio (SMS Service)
- OpenAI API
- Cloudinary (Image Storage)

## Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/volunteer-management-system.git
   cd volunteer-management-system
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # JWT Secrets
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_EXPIRY=7d
   
   # Payment Gateway
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # Cloud Storage
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Email Service
   GMAIL_USERNAME=your_email@gmail.com
   GMAIL_PASSWORD=your_app_password
   GMAIL_PORT=587
   
   # SMS Service
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   
   # AI Service
   OPENAI_API_KEY=your_openai_api_key
   ```

5. **Run the Application**
   
   Start Backend (Terminal 1):
   ```bash
   cd backend
   npm start
   ```
   
   Start Frontend (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## Project Structure

```
volunteer-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── db/
│   ├── public/
│   ├── package.json
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── index.html
├── README.md
├── .gitignore
└── LICENSE
```

## User Roles & Permissions

### ** Admin**
- Full system access
- Manage users and volunteers
- View all analytics
- Approve/reject posts
- Manage events and donations
- Send announcements

### ** Volunteer**
- Create posts for approval
- Track volunteer hours
- Participate in events
- View leaderboards
- Submit volunteer work

### ** Regular User**
- Make donations
- Vote for star volunteers
- View events and volunteer opportunities
- Receive announcements

## API Endpoints

### **Authentication**
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `GET /api/v1/users/current-user` - Get current user

### **Events**
- `GET /api/v1/events` - Get all events
- `POST /api/v1/events` - Create event (Admin)
- `GET /api/v1/events/:id` - Get event details
- `PUT /api/v1/events/:id` - Update event (Admin)

### **Donations**
- `POST /api/v1/donations/create-order` - Create payment order
- `POST /api/v1/donations/verify-payment` - Verify payment
- `GET /api/v1/donations` - Get donations (Admin)

### **Posts**
- `GET /api/v1/posts` - Get all posts
- `POST /api/v1/posts` - Create post (Volunteer)
- `PUT /api/v1/posts/:id/approve` - Approve post (Admin)
- `DELETE /api/v1/posts/:id` - Delete post

### **Star Voting**
- `GET /api/v1/star-votes/volunteers` - Get volunteers for voting
- `POST /api/v1/star-votes` - Submit vote
- `GET /api/v1/star-votes/leaderboard` - Get leaderboard

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Request rate limiting
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Deployment

### **Frontend (Vercel/Netlify)**
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your preferred hosting service

### **Backend (Railway/Render/Heroku)**
1. Set up environment variables
2. Configure MongoDB connection
3. Deploy the backend code

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Team

- **Developer**: Durgesh Kumar Singh
- **Email**: durgesh.vns24@gmail.com
- **GitHub**: [durgesh2411](https://github.com//durgesh2411)

## Acknowledgments

- React community for excellent documentation
- Node.js ecosystem for powerful tools
- MongoDB for reliable database solutions
- All contributors and testers

---

⭐ **Star this repository if you found it helpful!** ⭐
