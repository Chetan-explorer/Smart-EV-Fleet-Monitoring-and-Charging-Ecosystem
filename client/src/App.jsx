import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import UserProfile from './pages/UserProfile';
import MyBookings from './pages/MyBookings';
import Users from './pages/Users';
import Stations from './pages/Stations';
import UserMap from './pages/UserMap';
import Learning from './pages/Learning';
import Help from './pages/Help';
import Ports from './pages/Ports';
import Schedule from './pages/Schedule';
import Reports from './pages/Reports';
import Trends from './pages/Trends';
import Settings from './pages/Settings';
import AllBookings from './pages/AllBookings';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes inside Layout */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="stations" element={<Stations />} />
          <Route path="map" element={<UserMap />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="users" element={<Users />} />
          <Route path="learning" element={<Learning />} />
          <Route path="help" element={<Help />} />
          <Route path="ports" element={<Ports />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="reports" element={<Reports />} />
          <Route path="trends" element={<Trends />} />
          <Route path="settings" element={<Settings />} />
          <Route path="all-bookings" element={<AllBookings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
