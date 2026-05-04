# ⚡ Smart EV Fleet Monitoring and Charging Ecosystem

A modern, production-grade SaaS platform designed for comprehensive EV fleet management, charging station monitoring, and automated user booking systems. Built with the MERN stack (MongoDB, Express, React, Node.js) and enriched with real-time geospatial intelligence and AI-driven insights.

## 🌟 Key Features

- **Role-Based Access Control (RBAC):** Secure access tiers for Administrators, Fleet Managers, and standard Users, ensuring data integrity and restricted capabilities based on verified domains.
- **EV Charging Booking System:** Seamless user reservation flow preventing scheduling overlaps, capturing detailed vehicle specifications, and optimizing charging station utilization.
- **Admin Command Center:** A high-performance analytics dashboard providing real-time aggregated metrics on global station capacity, booking pressure, and operational alerts.
- **Interactive Geospatial Mapping:** Live `react-leaflet` integration leveraging custom Mapbox layers for premium visual tracking of fleet locations and station availability.
- **Gemini AI Assistant:** Integrated conversational interface powered by Google's Generative AI (`@google/generative-ai`), allowing admins to query system data, operational metrics, and contextual insights instantly.
- **Premium Modern UI/UX:** Built with Tailwind CSS and Framer Motion, offering a sleek, dark-mode SaaS aesthetic, micro-interactions, and fluid responsive layouts.

## 🛠️ Technology Stack

### Frontend (Client)

- **Core:** React 19, Vite, React Router DOM
- **Styling & UI:** Tailwind CSS, Framer Motion, Lucide React, `clsx`, `tailwind-merge`
- **Data Visualization:** Recharts (KPIs and Analytics)
- **Mapping:** React-Leaflet, Leaflet, Mapbox
- **Data Fetching:** Axios

### Backend (Server)

- **Core:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), Bcrypt.js
- **AI Integration:** `@google/generative-ai`

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas cluster)
- Mapbox API Key (for premium map tiles)
- Google Gemini API Key (Required for AI Chat features)

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure the following variables:

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
GEMINI_API_KEY=your_google_gemini_api_key
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

_(Optional)_ Configure frontend environment variables if needed (e.g., in `client/.env`):

```env
VITE_MAPBOX_API_KEY=your_mapbox_api_key
```

Start the Vite development server:

```bash
npm run dev
```

The application will launch automatically at `http://localhost:5173`.

## 📂 Architecture Highlights

- **Modular API Structure:** The Express backend is structured into distinct routes (`auth`, `vehicles`, `stations`, `analytics`, `booking`, `chat`) using a robust Controller-Service pattern.
- **Optimistic UI Updates:** The React client utilizes sophisticated Context APIs and local state management to provide instant feedback during CRUD operations.
- **Advanced Data Aggregation:** MongoDB aggregation pipelines are utilized extensively in the analytics routes to process large datasets before transmitting them to the client, ensuring optimal performance.
