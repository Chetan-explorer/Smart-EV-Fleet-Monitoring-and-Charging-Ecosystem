const BatteryData = require('../models/BatteryData');
const ChargingSession = require('../models/ChargingSession');
const Booking = require('../models/Booking');
const ChargingStation = require('../models/ChargingStation');
const User = require('../models/User');

// @desc    Get battery trends
// @route   GET /api/analytics/battery-trends
// @access  Private
const getBatteryTrends = async (req, res) => {
    try {
        const trends = [
            { time: '00:00', avgBattery: 85 },
            { time: '04:00', avgBattery: 78 },
            { time: '08:00', avgBattery: 70 },
            { time: '12:00', avgBattery: 55 },
            { time: '16:00', avgBattery: 45 },
            { time: '20:00', avgBattery: 60 },
            { time: '23:59', avgBattery: 80 }
        ];
        res.json(trends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get session analytics
// @route   GET /api/analytics/sessions
// @access  Private
const getSessionAnalytics = async (req, res) => {
    try {
        const sessions = await ChargingSession.find({}).populate('vehicle station');
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get comprehensive command center analytics for admin dashboard
// @route   GET /api/analytics/command-center
// @access  Private (Admin)
const getCommandCenterAnalytics = async (req, res) => {
    try {
        const now = new Date();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Fetch data pools
        const stations = await ChargingStation.find({}).lean();
        const bookingsAll = await Booking.find({});
        const activeBookings = bookingsAll.filter(b => b.status === 'active' && new Date(b.startTime) <= now && new Date(b.endTime) >= now);
        const todayBookings = bookingsAll.filter(b => new Date(b.startTime) >= startOfDay && new Date(b.startTime) <= endOfDay);
        const users = await User.find({ role: 'User' });
        const recentlyRegistered = users.filter(u => new Date(u.createdAt) >= startOfDay);

        // 1. Station Status & Map Array
        let totalCapacity = 0;
        let globalAvailablePorts = 0;
        let fullyOccupiedStations = 0;
        let activeStationsCount = 0;

        const enhancedStations = stations.map(station => {
            const stationActiveBookings = activeBookings.filter(b => b.stationId.toString() === station._id.toString());
            const stationUsedPorts = stationActiveBookings.length;
            const cap = station.capacity || 1;
            const availablePorts = Math.max(0, cap - stationUsedPorts);
            
            totalCapacity += cap;
            globalAvailablePorts += availablePorts;
            
            if (stationUsedPorts > 0) activeStationsCount++;
            if (availablePorts === 0) fullyOccupiedStations++;

            return {
                ...station,
                availableSlots: availablePorts,
                capacity: cap,
                todayQueue: todayBookings.filter(b => b.stationId.toString() === station._id.toString()).length,
                activeBookingsCount: stationUsedPorts,
                crowdedness: availablePorts === 0 ? 'High' : (availablePorts === 1 && cap > 1 ? 'Moderate' : (availablePorts < cap ? 'Moderate' : 'Low'))
            };
        });

        const usedCapacity = totalCapacity - globalAvailablePorts;
        const utilizationPercent = totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0;

        // 2. Alerts Generation
        const alerts = [];
        enhancedStations.forEach(s => {
            if (s.availableSlots === 0) {
                alerts.push({ id: Math.random().toString(), type: 'danger', message: `Station ${s.name} is fully overloaded.` });
            } else if (s.availableSlots === 1 && s.capacity > 1) {
                alerts.push({ id: Math.random().toString(), type: 'warning', message: `Station ${s.name} nearing capacity.` });
            }
        });
        const lowBatteryUsers = users.filter(u => u.batteryCapacity < 20);
        lowBatteryUsers.forEach(u => {
            alerts.push({ id: Math.random().toString(), type: 'danger', message: `EV ${u.vehicleNumber || 'Unknown'} is critically low (${u.batteryCapacity}%).` });
        });

        if (activeBookings.length > globalAvailablePorts) {
             alerts.push({ id: Math.random().toString(), type: 'danger', message: `Severe booking conflict detected across network.` });
        }

        // 3. Queue Intelligence
        // Find longest queue station
        let longestQueueStation = 'N/A';
        if (enhancedStations.length > 0) {
            const sortedStations = [...enhancedStations].sort((a,b) => b.todayQueue - a.todayQueue);
            if (sortedStations[0].todayQueue > 0) {
                longestQueueStation = sortedStations[0].name;
            }
        }
        
        // 4. Usage/Revenue Dummy
        const revToday = todayBookings.length * 15; // Assume $15 avg session
        
        // Final Payload Assembly
        res.json({
            kpi: {
                totalStations: stations.length,
                activeStations: activeStationsCount,
                fullStations: fullyOccupiedStations,
                totalCapacity,
                usedCapacity,
                utilizationPercent,
                availablePorts: globalAvailablePorts,
                activeSessions: activeBookings.length,
                todayBookingsCount: todayBookings.length,
                lowBatteryVehicles: lowBatteryUsers.length,
                totalVehicles: users.length
            },
            alerts,
            queueStats: {
                avgWaitTimeMin: fullyOccupiedStations > 0 ? 15 : 0, // Mock calculation
                longestQueueStation,
                totalQueuedToday: todayBookings.length
            },
            usersStats: {
                activeToday: Math.round(users.length * 0.4), // mock
                newRegistrations: recentlyRegistered.length,
                frequentBookers: Math.round(users.length * 0.1) // mock
            },
            revenue: {
                today: revToday,
                perStationAvg: enhancedStations.length > 0 ? Math.round(revToday / enhancedStations.length) : 0,
                avgDurationMin: 45
            },
            trends: {
                // Return dummy trend objects for advanced charts
                bookingTrendsDaily: [
                    { day: 'Mon', bookings: 12 }, { day: 'Tue', bookings: 19 },
                    { day: 'Wed', bookings: 15 }, { day: 'Thu', bookings: 25 },
                    { day: 'Fri', bookings: 32 }, { day: 'Sat', bookings: 40 },
                    { day: 'Sun', bookings: 28 }
                ]
            },
            mapStations: enhancedStations // Push down so Map can just render it
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBatteryTrends,
    getSessionAnalytics,
    getCommandCenterAnalytics
};
