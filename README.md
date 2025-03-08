# Resign Ease

## Overview
Full-Stack Resignation System is a web-based platform that facilitates employee resignation management. The system enables users to submit resignations, answer exit questionnaires, track their resignation status, and receive notifications. Admins can review resignations, respond to exit questionnaires, and manage resignation approvals.

## Features
### User Features:
- Submit a resignation request
- Answer exit interview questions
- View resignation status
- Receive notifications

### Admin Features:
- Review and manage resignation requests
- Respond to exit questionnaires
- Conclude resignation processes

## Tech Stack
### Frontend:
- *Framework:* React (Vite)

### Backend:
- *Runtime:* Node.js (Express.js)
- *Database:* MongoDB
- *Authentication:* JWT & Cookies

## Directory Structure

└── resignease/
    ├── frontend/                # Frontend React app
    │   ├── public/            # Static assets
    │   ├── src/               # Source code
    │   │   ├── components/     # UI Components
    │   │   ├── services/        # API configuration
    ├── backend/                # Backend Node.js app
    │   ├── controllers/       # Business logic
    │   ├── config/                # Database configuration
    │   ├── middleware/        # Authentication middleware
    │   ├── models/            # Mongoose schema models
    │   ├── routes/            # API endpoints
    │   ├── utils/             # Utility functions


## Installation
### Prerequisites:
- Node.js (v16+)
- MongoDB (local or cloud instance)
- Vite (for frontend development)

### Steps:
1. *Clone the repository:*
   sh
   git clone https://github.com/abhash-tiwari/resign-ease
   
   

2. *Setup Frontend:*
   sh
   cd frontend
   npm install
   npm run dev
   

3. *Setup Backend:*
   sh
   cd ../backend
   npm install
   npm start
   

## Environment Variables
Create a .env file in both frontend/ and backend/ directories.
### For the Frontend:

VITE_API_URL=https://claw-task.onrender.com/api

### For the Backend:

PORT=8080
MONGODB_URI=mongodb://localhost:27017/resignationDB
JWT_SECRET=your_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
CALENDARIFIC_API_KEY=your_api_key

## API Endpoints
### Authentication:
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login and receive a token

### User:
- POST /api/user/resign - Submit a resignation
- GET /api/user/notifications - Check resignation status

### Admin:
- GET /api/admin/resignations - View all resignation requests
- POST /api/admin/conclude_resignation - Conclude a resignation process

## Contributing
Feel free to fork the repository, make improvements, and submit pull requests.
