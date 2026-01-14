# Request Portal

A frontend application for submitting and viewing form requests. Consumes the API from demo-json-forms backend.

## Features

- **Login Page**: Simple authentication (mock for now)
- **History Page**: View all submitted requests from the database
- **New Request Page**: Submit new form requests

## Tech Stack

- React 18 + TypeScript
- React Router (routing)
- TanStack Query (data fetching)
- Material-UI (components)
- Zustand (auth state)
- Vite (build tool)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start demo-json-forms Backend

Make sure the backend is running on port 3001:

```bash
cd ../demo-json-forms/server
npm run dev
```

### 3. Start Frontend

```bash
npm run dev
```

Application runs on http://localhost:5173

## Usage

1. **Login**: Enter any email/password (mock auth)
2. **History**: View all submissions from the database
3. **New Request**: Submit a new form request
4. **Logout**: Clear session and return to login

## API Integration

This app connects to the demo-json-forms backend:
- `GET /api/submissions` - Fetch all submissions
- `POST /api/submit` - Submit new form data

Backend must be running on `http://localhost:3001`

## Project Structure

```
request-form/
├── src/
│   ├── pages/
│   │   ├── Login.tsx          # Login page
│   │   ├── History.tsx        # View submissions
│   │   └── NewRequest.tsx     # Submit new request
│   ├── components/
│   │   └── ProtectedRoute.tsx # Auth guard
│   ├── store/
│   │   └── authStore.ts       # Zustand auth state
│   ├── api/
│   │   └── client.ts          # API client
│   ├── App.tsx                # Router setup
│   └── main.tsx               # Entry point
└── package.json
```

## Routes

- `/` - Redirects to login
- `/login` - Login page
- `/history` - Protected: View submissions
- `/new` - Protected: Create new request
