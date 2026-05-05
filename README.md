# REAL-ESTATE-LIVITY 🏠

A modern full-stack real estate application built with React, Express, and MongoDB. Browse, search, and manage properties with an intuitive user interface and robust backend API.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Details](#project-details)
- [Author](#author)

## ✨ Features

### Client
- **Property Browsing**: View and search through available properties
- **Property Details**: Detailed property pages with images and information
- **User Authentication**: Sign up and sign in functionality
- **Wishlist**: Save favorite properties
- **Image Slider**: Interactive image galleries for property listings
- **Map Integration**: View properties on an interactive map using Leaflet
- **Responsive Design**: Fully responsive UI built with Tailwind CSS
- **Smooth Animations**: Enhanced UX with Framer Motion

### Server
- **User Management**: User registration, authentication, and profile management
- **Property Management**: Full CRUD operations for property listings
- **Image Upload**: Cloud storage integration with Cloudinary
- **Email Notifications**: Send emails using Nodemailer
- **JWT Authentication**: Secure API endpoints with token-based auth
- **Database**: MongoDB for data persistence

## 🛠️ Tech Stack

### Frontend
- **React** 19.1 - UI framework
- **Vite** 7.1 - Build tool and development server
- **Tailwind CSS** 4.1 - Utility-first CSS framework
- **React Router** 7.9 - Client-side routing
- **Framer Motion** 12.23 - Animation library
- **Leaflet** 1.9 - Interactive maps
- **React Leaflet** 5.0 - React wrapper for Leaflet
- **Swiper** 12.0 - Touch slider
- **React Icons** 5.5 - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** 4.19 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.20 - MongoDB ODM
- **JWT** 9.0 - Authentication
- **Bcrypt** 6.0 - Password hashing
- **Cloudinary** 2.8 - Cloud image storage
- **Multer** 2.0 - File upload handling
- **Nodemailer** 7.0 - Email service
- **CORS** 2.8 - Cross-origin resource sharing
- **Nodemon** 3.1 - Development server auto-reload

## 📁 Project Structure

```
REAL-ESTATE-LIVITY/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── ImageSlider.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── TestimonialCard.jsx
│   │   │   └── Testimonials.jsx
│   │   ├── pages/                  # Page components
│   │   │   ├── About.jsx
│   │   │   ├── AddProperty.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Properties.jsx
│   │   │   ├── PropertyPage.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   └── Wishlist.jsx
│   │   ├── App.jsx                 # Root component
│   │   ├── main.jsx                # Entry point
│   │   ├── index.css               # Global styles
│   │   └── assets/                 # Static assets
│   ├── public/                     # Public files
│   ├── vite.config.js              # Vite configuration
│   ├── eslint.config.js            # ESLint configuration
│   └── package.json
│
├── server/                          # Express backend application
│   ├── api/
│   │   ├── index.js                # Express app entry point
│   │   ├── controllers/            # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── listing.controller.js
│   │   │   └── user.controller.js
│   │   ├── models/                 # MongoDB schemas
│   │   │   ├── listing.model.js
│   │   │   └── user.model.js
│   │   ├── routes/                 # API routes
│   │   │   ├── auth.route.js
│   │   │   ├── listing.route.js
│   │   │   └── user.route.js
│   │   ├── middleware/             # Express middleware
│   │   │   └── auth.middleware.js
│   │   ├── utils/                  # Utility functions
│   │   │   ├── cloudinary.js
│   │   │   ├── multer.js
│   │   │   └── sendEmail.js
│   │   └── package.json
│   │
│   └── seed/                        # Database seeding
│       └── seedListings.js
│
└── README.md                        # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)

## 💾 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd REAL-ESTATE-LIVITY
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

## 🚀 Running the Application

### Start the Backend Server
```bash
cd server
npm run dev
```
The server will start on `http://localhost:3000` (or your configured port)

### Start the Frontend Development Server
In a new terminal:
```bash
cd client
npm run dev
```
The frontend will start on `http://localhost:5173` (or your configured port)

## 🔧 Environment Variables

### Backend (.env file in server directory)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```

### Frontend (.env file in client directory)
```
VITE_API_BASE_URL=http://localhost:3000
```

## 📚 API Documentation

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - User login

### User Routes (`/api/user`)
- `GET /:id` - Get user profile
- `PUT /:id` - Update user profile
- `DELETE /:id` - Delete user account

### Listing Routes (`/api/listing`)
- `GET /` - Get all listings
- `GET /:id` - Get listing details
- `POST /` - Create new listing (authenticated)
- `PUT /:id` - Update listing (authenticated)
- `DELETE /:id` - Delete listing (authenticated)

## 📖 Project Details

### Features in Development
- User authentication with JWT tokens
- Property listing management
- Image uploads to Cloudinary
- Email notifications
- Interactive maps
- Property search and filtering
- Wishlist functionality

### Future Enhancements
- Advanced property filtering (price range, location radius, amenities)
- Property reviews and ratings
- Booking/scheduling system
- Payment integration
- Admin dashboard
- Email verification
- Password reset functionality

## 👤 Author

**Ruban**
