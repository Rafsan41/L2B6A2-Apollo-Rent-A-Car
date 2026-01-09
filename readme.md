# 🚗 Vehicle Rental Management System

A complete RESTful API for managing vehicle rentals built with Node.js, Express.js, TypeScript, and PostgreSQL. This system allows customers to book vehicles and administrators to manage the fleet efficiently.

## 📌 Live Demo

- **API Base URL**: `https://your-domain.com/api/v1`
- **Postman Collection**: [Download Here](#)
- **Frontend Demo**: [Live Preview](#)

## 🎯 Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (Customer & Admin)
- Secure password hashing with bcrypt
- Protected API endpoints

### 🚘 Vehicle Management

- Full CRUD operations for vehicles
- Vehicle categorization (Car, Bike, Van, SUV)
- Real-time availability tracking
- Search and filter vehicles
- Automatic status updates

### 📅 Booking System

- Create bookings with date validation
- Dynamic price calculation (daily rate × days)
- Booking lifecycle management
- Vehicle availability auto-sync
- Customer booking history

### 👥 User Management

- User registration and login
- Profile management
- Booking history tracking
- Role-based dashboard access

## 🛠️ Technology Stack

| Technology     | Purpose                |
| -------------- | ---------------------- |
| **Node.js**    | Runtime Environment    |
| **Express.js** | Web Framework          |
| **TypeScript** | Programming Language   |
| **PostgreSQL** | Database               |
| **JWT**        | Authentication         |
| **bcryptjs**   | Password Hashing       |
| **dotenv**     | Environment Management |
| **CORS**       | Cross-Origin Support   |

## 📁 Project Structure

vehicle-rental-api/
├── src/
│ ├── app.ts # Main application file
│ ├── server.ts # Server configuration
│ ├── config/ # Configuration files
│ ├── middleware/ # Custom middleware
│ ├── modules/ # Feature modules
│ │ ├── auth/ # Authentication
│ │ ├── users/ # User management
│ │ ├── vehicles/ # Vehicle management
│ │ └── bookings/ # Booking system
│ └── utils/ # Utility functions
├── .env.example # Environment template
├── package.json # Dependencies
├── tsconfig.json # TypeScript config
└── README.md # Documentation

text

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/vehicle-rental-system.git
cd vehicle-rental-system
Install dependencies

bash
npm install
Configure environment variables

bash
cp .env.example .env
# Edit .env with your configuration
Set up PostgreSQL database

bash
# Create database
createdb vehicle_rental_db

# Or use pgAdmin/psql
# Database name: vehicle_rental_db
Update .env file

env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/vehicle_rental_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=14d
BCRYPT_SALT_ROUNDS=10
Run the application

bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
📚 API Documentation
Base URL
text
http://localhost:5000/api/v1
Authentication Endpoints
Register User
http
POST /auth/signup
Request:

json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
}
Response:

json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "customer"
    }
}
Login
http
POST /auth/signin
Request:

json
{
    "email": "john@example.com",
    "password": "SecurePass123!"
}
Response:

json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "customer"
    }
}
Vehicle Endpoints
Get All Vehicles
http
GET /vehicles
Query Parameters:

type - Filter by vehicle type (car, bike, van, suv)

status - Filter by availability (available, booked)

minPrice - Minimum daily price

maxPrice - Maximum daily price

Get Single Vehicle
http
GET /vehicles/:id
Create Vehicle (Admin Only)
http
POST /vehicles
Authorization: Bearer <admin_token>
Request:

json
{
    "vehicle_name": "Toyota Corolla",
    "type": "car",
    "registration_number": "DHK-1001",
    "daily_rent_price": 3000
}
Update Vehicle (Admin Only)
http
PUT /vehicles/:id
Authorization: Bearer <admin_token>
Delete Vehicle (Admin Only)
http
DELETE /vehicles/:id
Authorization: Bearer <admin_token>
Booking Endpoints
Create Booking
http
POST /bookings
Authorization: Bearer <token>
Request:

json
{
    "vehicle_id": 1,
    "rent_start_date": "2024-01-15",
    "rent_end_date": "2024-01-20"
}
Note: Automatically calculates total price and updates vehicle status

Get Bookings
http
GET /bookings
Authorization: Bearer <token>
Admin: Gets all bookings

Customer: Gets only own bookings

Get Single Booking
http
GET /bookings/:id
Authorization: Bearer <token>
Access Control:

Admin can access any booking

Customer can access only own bookings

Update Booking
http
PUT /bookings/:id
Authorization: Bearer <token>
Allowed Actions:

Customer: Cancel booking (before start date)

Admin: Mark as returned (updates vehicle to available)

🔐 Authentication & Authorization
JWT Token
Include the JWT token in the Authorization header:

http
Authorization: Bearer <your_jwt_token>

1. Register a Test User
http
POST http://localhost:5000/api/v1/auth/signup
Content-Type: application/json

{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!"
}
2. Login and Save Token
http
POST http://localhost:5000/api/v1/auth/signin
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "Test123!"
}
Save the token from response for subsequent requests.

3. Browse Available Vehicles
http
GET http://localhost:5000/api/v1/vehicles?status=available
Authorization: Bearer <your_token>
4. Create a Booking
http
POST http://localhost:5000/api/v1/bookings
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "vehicle_id": 1,
    "rent_start_date": "2024-01-15",
    "rent_end_date": "2024-01-18"
}
5. View Your Bookings
http
GET http://localhost:5000/api/v1/bookings
Authorization: Bearer <your_token>
```
