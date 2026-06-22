# Customer Support Ticket Management - Frontend

## Overview
React + TypeScript frontend built with Vite for a customer support ticket management application.

## Features
- Login and signup
- Role-based dashboard for `customer`, `agent`, and `admin`
- Ticket creation, listing, filtering, and status workflows
- Admin user management with role selection
- Search, filter, and pagination for tickets and users
- Toast notifications and auth-protected routes

## Prerequisites
- Node.js 20+ / npm
- Backend running at `http://localhost:8000/api`

## Setup
1. Install dependencies

```bash
cd frontend
npm install
```

2. Start the development server

```bash
npm run dev
```

3. Open the app in your browser

```text
http://localhost:5173
```

## API Integration
The frontend communicates with the backend API at `http://localhost:8000/api`.

### Main API endpoints
- `POST /api/auth/register` — register customer accounts
- `POST /api/auth/login` — login and receive JWT
- `POST /api/tickets` — create a ticket
- `GET /api/tickets` — list tickets
- `GET /api/tickets/:id` — ticket details
- `PUT /api/tickets/:id` — update ticket status
- `DELETE /api/tickets/:id` — delete ticket
- `POST /api/users` — admin create user/agent
- `GET /api/users` — admin list users
- `GET /api/users/:id` — admin user details

## Environment
This frontend does not include a `.env` file by default. To change the backend URL, update:

- `frontend/src/api/axios.ts`

## Folder structure
```
frontend/
  public/                  # Static assets
  src/
    api/                   # Axios API helpers
    components/            # Shared components and cards
    context/               # Auth provider and hooks
    layouts/               # Page layout wrappers
    pages/                 # UI pages
    routes/                # React Router routes and guards
    schemas/               # Form validation schemas
    App.tsx
    main.tsx
    index.css
    App.css
  package.json
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  vite.config.ts
  README.md
```

## Authentication flow
- Signup registers a new customer account.
- Login stores JWT in `localStorage`.
- Axios uses the JWT for secure API requests.
- `ProtectedRoute` waits for auth state to finish loading before redirecting.

## Admin UI behavior
- Admins can create agents and users from the admin creation page.
- The create form includes a `Role` dropdown for clarity.
- Admin dashboard includes ticket summary cards and status breakdown charts.

## Assumptions
- Customers register themselves through signup.
- Admins create agents/users from the admin interface.
- JWT tokens are persisted in `localStorage`.
- The backend API runs at `http://localhost:8000/api`.
- Role values are `customer`, `agent`, and `admin`.

## Useful scripts
- `npm run dev` — start development server
- `npm run build` — build production assets
- `npm run lint` — run ESLint

## Notes
- For production, add environment configuration and secure API URLs.
- The current UI uses Tailwind-like utility classes for styling.
- If the backend origin changes, update `frontend/src/api/axios.ts`.
