# 🏠 RoomGi - Smart Room Rental Platform

<div align="center">

![RoomGi Logo](https://img.shields.io/badge/RoomGi-Room%20Rental%20Platform-orange?style=for-the-badge)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://roomgi-hackathon.vercel.app/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

**A modern, full-stack room rental platform connecting property owners with tenants**

🌐 **[Live Demo](https://roomgi-hackathon.vercel.app/)** | [Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**RoomGi** is a comprehensive room rental platform designed to simplify the process of finding and listing rental properties. Built with modern web technologies, it provides a seamless experience for both property owners and tenants.

### Why RoomGi?

- 🔍 **Smart Search** - Find rooms by location, price, amenities, and more
- 🗺️ **Map Integration** - Search properties by map location with radius-based filtering
- ✅ **Verified Owners** - Identity verification system for trusted listings
- 💬 **Direct Communication** - Enquiry system for tenant-owner interaction
- ⭐ **Review System** - Rate and review properties
- 📱 **Responsive Design** - Fully optimized for mobile, tablet, and desktop
- 🔐 **Secure Authentication** - JWT-based authentication with role-based access

---

## ✨ Features

### For Tenants
- 🏘️ Browse and search available properties
- 🗺️ Map-based property search with location and radius filters
- 💾 Save favorite properties
- 📝 Send enquiries to property owners
- ⭐ Write and manage reviews
- 👤 Manage profile and view enquiry history

### For Property Owners
- 📋 List and manage multiple properties
- 📊 Owner dashboard with analytics
- 💬 Receive and respond to tenant enquiries
- 🔔 Email notifications for new enquiries
- ✅ Identity verification system
- 📸 Upload property images (Cloudinary integration)
- 📍 Location picker with map integration

### For Admins
- 👥 User management (view, verify, delete users)
- 🏢 Property management and moderation
- ✅ Verify owner identity documents
- 📊 Analytics and reporting dashboard
- 🚫 Handle user reports and complaints

### Additional Features
- 🔐 Secure JWT authentication with HTTP-only cookies
- 📧 Email notifications (Nodemailer)
- ☁️ Cloud image storage (Cloudinary)
- 🗺️ Interactive maps (Leaflet, OpenStreetMap)
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time data updates
- 📱 Fully responsive design

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19.2.0
- **Routing:** React Router DOM 7.13.0
- **Styling:** Tailwind CSS 3.4.19
- **Icons:** Lucide React 0.563.0
- **Maps:** React Leaflet 5.0.0, Leaflet 1.9.4
- **HTTP Client:** Axios 1.13.4
- **Build Tool:** Vite 7.2.4

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5.2.1
- **Database:** MongoDB (Mongoose 9.1.5)
- **Authentication:** JWT (jsonwebtoken 9.0.3)
- **Password Hashing:** Bcrypt 6.0.0
- **File Upload:** Multer 2.0.2
- **Cloud Storage:** Cloudinary 2.9.0
- **Email:** Nodemailer 7.0.13
- **CORS:** cors 2.8.6

### Development Tools
- **Dev Server:** Nodemon 3.1.11
- **Code Formatting:** Prettier 3.8.1
- **Linting:** ESLint 9.39.1

---

## 📁 Project Structure

```
roomgi-hackathon/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── db/                   # Database configuration
│   ├── middlewares/          # Custom middlewares (auth, upload, etc.)
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── utils/                # Utility functions
│   ├── index.js              # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── admin/        # Admin-specific components
│   │   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   │   ├── map/          # Map-related components
│   │   │   ├── owner/        # Owner-specific components
│   │   │   ├── property/     # Property components
│   │   │   ├── review/       # Review components
│   │   │   └── routing/      # Route guards
│   │   ├── pages/            # Page components
│   │   │   ├── admin/        # Admin pages
│   │   │   ├── auth/         # Authentication pages
│   │   │   ├── owner/        # Owner pages
│   │   │   └── tenant/       # Tenant pages
│   │   ├── services/         # API service layer
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**
- **Cloudinary Account** (for image uploads)
- **Email Account** (for Nodemailer - Gmail recommended)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/roomgi-hackathon.git
cd roomgi-hackathon
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to your `.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/roomgi
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/roomgi

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following to your `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🎮 Usage

### Running the Application

#### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

#### Option 2: Run from Root (if configured)
```bash
# From project root
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```
This creates an optimized production build in the `dist/` folder.

**Backend:**
The backend runs as-is in production. Make sure to:
1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance
3. Configure proper CORS settings

---

## 🔐 Environment Variables

### Backend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `5000` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb://localhost:27017/roomgi` |
| `JWT_SECRET` | Secret key for JWT | Yes | `your_secret_key` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | `your_api_secret` |
| `EMAIL_USER` | Email address for sending mails | Yes | `your-email@gmail.com` |
| `EMAIL_PASS` | Email app password | Yes | `your_app_password` |
| `FRONTEND_URL` | Frontend URL for CORS | Yes | `http://localhost:5173` |

### Frontend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes | `http://localhost:5000/api` |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "+919876543210",
  "role": "tenant" // or "owner"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout
```http
POST /auth/logout
```

### Property Endpoints

#### Get All Properties
```http
GET /properties
```

#### Get Property by ID
```http
GET /properties/:id
```

#### Create Property (Owner only)
```http
POST /properties
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "name": "Cozy 2BHK Apartment",
  "description": "Beautiful apartment in prime location",
  "price": 15000,
  "location": {...},
  "amenities": ["WiFi", "Parking"],
  "images": [files]
}
```

#### Search Properties
```http
GET /properties/search?query=<searchTerm>&location=<city>&minPrice=<min>&maxPrice=<max>
```

### Enquiry Endpoints

#### Create Enquiry
```http
POST /enquiries
Content-Type: application/json
Authorization: Bearer <token>

{
  "propertyId": "property_id",
  "message": "I'm interested in this property"
}
```

#### Get Tenant Enquiries
```http
GET /enquiries/tenant
Authorization: Bearer <token>
```

#### Get Owner Enquiries
```http
GET /enquiries/owner
Authorization: Bearer <token>
```

### Review Endpoints

#### Create Review
```http
POST /reviews
Content-Type: application/json
Authorization: Bearer <token>

{
  "propertyId": "property_id",
  "rating": 5,
  "comment": "Great property!"
}
```

For complete API documentation, see [API_DOCS.md](./API_DOCS.md) (if available).

---

## 📸 Screenshots

### Landing Page
![Landing Page](./screenshots/landing.png)

### Property Search
![Property Search](./screenshots/explore.png)

### Map Search
![Map Search](./screenshots/map-search.png)

### Owner Dashboard
![Owner Dashboard](./screenshots/owner-dashboard.png)

### Admin Panel
![Admin Panel](./screenshots/admin-panel.png)

---

## 🎨 Design Features

- **Mobile-First Design** - Optimized for all screen sizes
- **Modern UI/UX** - Clean, intuitive interface
- **Smooth Animations** - Enhanced user experience
- **Dark Mode Ready** - Easy to implement dark theme
- **Accessible** - WCAG compliant components

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ HTTP-only cookies
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Input validation
- ✅ Protected routes
- ✅ Role-based access control

---

## 🚀 Deployment

### Live Demo
The application is currently deployed at: **[https://roomgi-hackathon.vercel.app/](https://roomgi-hackathon.vercel.app/)**

### Frontend Deployment (Vercel)

#### Prerequisites
- Vercel account
- GitHub repository

#### Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - **Framework Preset:** Vite
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

3. **Add Environment Variables**
   In Vercel dashboard, add:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your frontend

#### Auto-Deployment
Vercel automatically redeploys on every push to your main branch.

### Backend Deployment

#### Option 1: Render.com (Recommended)

1. **Create account** at [render.com](https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repository
   - Select the `backend` directory
   - Configure:
     - **Name:** roomgi-backend
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `node index.js`

3. **Add Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   FRONTEND_URL=https://roomgi-hackathon.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your backend

#### Option 2: Railway.app

1. **Create account** at [railway.app](https://railway.app)
2. **New Project** → Deploy from GitHub
3. **Select repository** and `backend` directory
4. **Add environment variables** (same as above)
5. **Deploy**

#### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and create app**
   ```bash
   heroku login
   heroku create roomgi-backend
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_uri
   # ... add all other variables
   ```

4. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Database (MongoDB Atlas)

1. **Create account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create cluster** (free tier available)
3. **Create database user**
4. **Whitelist IP addresses** (0.0.0.0/0 for all IPs)
5. **Get connection string** and add to backend environment variables

### Post-Deployment Checklist

- [ ] Update `VITE_API_URL` in Vercel to point to deployed backend
- [ ] Update `FRONTEND_URL` in backend to point to Vercel deployment
- [ ] Test all features on production
- [ ] Verify email notifications work
- [ ] Test image uploads to Cloudinary
- [ ] Check map functionality
- [ ] Test authentication flow
- [ ] Verify admin panel access

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Coding Standards
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

---

## 🐛 Known Issues

- Build process may require additional configuration for production
- Email notifications require app-specific passwords for Gmail
- Map features require internet connection

---

## 🔮 Future Enhancements

- [ ] Real-time chat between owners and tenants
- [ ] Payment gateway integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Social media authentication
- [ ] Property comparison feature
- [ ] Saved searches and alerts

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- OpenStreetMap for map data
- Cloudinary for image hosting
- MongoDB for database
- All contributors and testers

---

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

<div align="center">

**Made with ❤️ by the RoomGi Team**

⭐ Star this repo if you find it helpful!

</div>
