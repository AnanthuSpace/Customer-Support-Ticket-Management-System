# Customer Support Ticket Management - Backend

## Overview
A Node.js + Express + TypeScript backend for customer support ticket management. It provides authentication, role-based access control, ticket management, and user administration via REST APIs.

## Features
- JWT authentication
- Customer signup and login
- Role-based authorization: `customer`, `agent`, `admin`
- Admin user management and agent creation
- Ticket creation, listing, status updates, and deletion
- Swagger API documentation available at `/api-docs`
- MongoDB persistence

## Prerequisites
- Node.js 20+ / npm
- MongoDB running locally or remote

## Setup
1. Install dependencies

```bash
cd backend
npm install
```

2. Copy environment variables

```bash
cp .env .env.local
```

3. Update `.env.local` as needed:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/support_desk
JWT_SECRET=your_strong_jwt_secret
NODE_ENV=development
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=Admin@123
```

4. Start the backend server

```bash
npm run dev
```

The server will listen on `http://localhost:8000` by default.

## API Documentation
Swagger UI is available after the server starts at:

```text
http://localhost:8000/api-docs
```

### Authentication Endpoints
- `POST /api/auth/register` — register a new customer account
- `POST /api/auth/login` — login and receive JWT

### Ticket Endpoints
- `POST /api/tickets` — create a new ticket (authenticated users)
- `GET /api/tickets` — list tickets; customers see only their own, agents/admins see all
- `GET /api/tickets/:id` — get ticket details
- `PUT /api/tickets/:id` — update ticket status (`agent` or `admin` only)
- `DELETE /api/tickets/:id` — delete ticket (`admin` can delete any, customers can delete their own)

### User Endpoints
- `POST /api/users` — create a user or agent (`admin` only)
- `GET /api/users` — list all users (`admin` only)
- `GET /api/users/:id` — get user details (`admin` only)

## Environment Variables
- `PORT` — backend port (default `8000`)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret key used to sign JWT tokens
- `NODE_ENV` — environment mode
- `ADMIN_EMAIL` — seeded admin email
- `ADMIN_PASSWORD` — seeded admin password

## Database Setup
This project uses MongoDB. By default, it connects to `mongodb://localhost:27017/support_desk`.

When the backend starts, it connects to MongoDB and automatically seeds a default admin user if one does not already exist.

## Folder Structure
```
backend/
  ├── src/
  │   ├── app.ts                # Express app setup and route registration
  │   ├── server.ts             # Server startup and DB connection
  │   ├── config/
  │   │   ├── db.ts             # MongoDB connection helper
  │   │   └── swagger.ts        # Swagger configuration
  │   ├── docs/                 # Swagger documentation definitions
  │   ├── middlewares/          # Auth, validation, error handling
  │   ├── models/               # Mongoose schemas for User and Ticket
  │   ├── modules/
  │   │   ├── auth/             # Register/login logic
  │   │   ├── tickets/          # Ticket routes, services, repository
  │   │   └── users/            # Admin user management
  │   ├── utils/                # Helpers and error classes
  │   └── seedAdmin.ts          # Default admin seeding
  ├── package.json
  ├── tsconfig.json
  └── .env
```

## Assumptions
- Customers sign up through `/api/auth/register` and are created with role `customer`.
- Admins create agents/users using `POST /api/users`.
- Admin authentication is seeded automatically on startup if missing.
- JWT tokens are stored on the frontend and sent via `Authorization: Bearer <token>`.
- The frontend and backend run separately; frontend calls backend APIs at `http://localhost:8000/api`.

## Notes
- Ensure MongoDB is running before starting the backend.
- For production, replace `JWT_SECRET` with a secure secret and use a proper environment configuration.
