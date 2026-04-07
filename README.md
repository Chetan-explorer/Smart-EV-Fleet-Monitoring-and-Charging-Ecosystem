# EV Fleet Monitoring & Charging Dashboard

A production-grade full-stack MERN application for monitoring and tracking EV fleets.

## Features
- **Dashboard**: High-level real-time overview of your fleet (Total vehicles, charging vs idle, battery statistics).
- **Vehicles Management**: Comprehensive table of fleet vehicles with specific status and real-time battery info.
- **Geospatial Map**: Integrated `react-leaflet` to display routing from EV vehicles to charging stations.
- **Authentication**: JWT & Bcrypt based Role Based Access Control (RBAC).

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally, or access to a MongoDB Atlas cluster.

### 1. Backend Setup

```bash
cd server
npm install
```

Configure environment variables in `server/.env` (These are set by default to use a local mongodb instance):

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ev-fleet
JWT_SECRET=supersecretjwtkeyforfleet
NODE_ENV=development
```

**Seed Mock Data into DB:**
```bash
npm run data:import
```

**Run Server:**
```bash
npm run dev
```

The Backend will run at `http://localhost:5000`

### 2. Frontend Setup

```bash
cd client
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The application will launch with hot module replacement pointing to the API.

## Default Admin Credentials
When you run the seed data script `npm run data:import`, it provisions an admin.
- **Email:** `admin@fleet.com`
- **Password:** `password123`

## Architecture
- **Mongoose/Express Backend:** Organized in controllers, models, routes and utility architecture to ensure scalability.
- **React Frontend:** Built using Vite, utilizing Context APIs for global Auth. Styled intricately with standard Tailwind to offer a dark SaaS aesthetic. Recharts handles robust visualizations and leaf-let manages the complex geographical charting algorithms.
