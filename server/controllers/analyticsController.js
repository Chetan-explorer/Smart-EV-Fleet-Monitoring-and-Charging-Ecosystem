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
        await Booking.updateMany(
            { status: 'active', endTime: { $lt: new Date() } },
            { $set: { status: 'completed' } }
        );

        const now = new Date();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Fetch data pools
        const stations = await ChargingStation.find({}).lean();
        const bookingsAll = await Booking.find({}).populate('userId', 'name').lean();
        const activeBookings = bookingsAll.filter(b => b.status === 'active' && new Date(b.startTime) <= now && new Date(b.endTime) >= now);
        const todayBookings = bookingsAll.filter(b => new Date(b.startTime) >= startOfDay && new Date(b.startTime) <= endOfDay);
        const users = await User.find({ role: 'User' }).lean();
        const recentlyRegistered = users.filter(u => new Date(u.createdAt) >= startOfDay);

        // 1. Station Status & Map Array
        let totalCapacity = 0;
        let globalAvailablePorts = 0;
        let fullyOccupiedStations = 0;
        let activeStationsCount = 0;

        let enhancedStations = stations.map(station => {
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

        // Calculate Nearest Available Station
        enhancedStations = enhancedStations.map(s => {
            if (s.availableSlots === 0) {
                // find nearest
                let nearest = null;
                let minDst = Infinity;
                enhancedStations.forEach(other => {
                    if (other._id.toString() !== s._id.toString() && other.availableSlots > 0) {
                        const dist = Math.sqrt(Math.pow(s.location.lat - other.location.lat, 2) + Math.pow(s.location.lng - other.location.lng, 2));
                        if (dist < minDst) {
                            minDst = dist;
                            nearest = other;
                        }
                    }
                });
                return { ...s, nearestAvailable: nearest ? { name: nearest.name, slots: nearest.availableSlots } : null };
            }
            return s;
        });

        const usedCapacity = totalCapacity - globalAvailablePorts;
        const utilizationPercent = totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0;

        // 2. Alerts Generation
        const alerts = [];
        enhancedStations.forEach(s => {
            if (s.availableSlots === 0) {
                alerts.push({ id: Math.random().toString(), severity: 'critical', type: 'danger', message: `Station ${s.name} is fully overloaded.`, action: 'Increase Capacity', timestamp: new Date().toISOString() });
            } else if (s.availableSlots === 1 && s.capacity > 1) {
                alerts.push({ id: Math.random().toString(), severity: 'warning', type: 'warning', message: `Station ${s.name} nearing capacity.`, action: 'Monitor Queue', timestamp: new Date().toISOString() });
            }
        });


        if (activeBookings.length > globalAvailablePorts) {
             alerts.push({ id: Math.random().toString(), severity: 'critical', type: 'danger', message: `Severe booking conflict detected across network.`, action: 'Halt Bookings', timestamp: new Date().toISOString() });
        }

        // Sort alerts by severity
        const severityScores = { critical: 3, warning: 2, info: 1 };
        alerts.sort((a, b) => severityScores[b.severity] - (severityScores[a.severity] || 0));

        // 3. Queue Intelligence
        let longestQueueStation = 'N/A';
        if (enhancedStations.length > 0) {
            const sortedStations = [...enhancedStations].sort((a,b) => b.todayQueue - a.todayQueue);
            if (sortedStations[0].todayQueue > 0) {
                longestQueueStation = sortedStations[0].name;
            }
        }
        
        // 4. Activity Feed Synthesis
        const activityFeed = [];
        const recentBookings = [...bookingsAll].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        recentBookings.forEach(b => {
            const stName = enhancedStations.find(s => s._id.toString() === b.stationId.toString())?.name || 'Unknown Station';
            activityFeed.push({
                id: `act_${b._id}`,
                message: `User ${b.userId?.name || 'Unknown'} booked ${stName}`,
                time: b.createdAt,
                type: 'booking'
            });
        });
        const recentUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 2);
        recentUsers.forEach(u => {
            activityFeed.push({
                id: `act_${u._id}`,
                message: `New user registered: ${u.name || u.email}`,
                time: u.createdAt,
                type: 'user'
            });
        });
        activityFeed.sort((a, b) => new Date(b.time) - new Date(a.time));

        // 5. Recommendations
        const recommendations = [];
        const fullStations = enhancedStations.filter(s => s.availableSlots === 0);
        if (fullStations.length > 0) {
            recommendations.push(`Increase capacity at overloaded station (${fullStations[0].name})`);
            recommendations.push(`Add new station in high-demand area near ${fullStations[0].name}`);
        }
        const emptyStations = enhancedStations.filter(s => s.availableSlots === s.capacity && s.capacity > 0);
        if (emptyStations.length > 0) {
            recommendations.push(`Promote usage in underutilized zone (${emptyStations[0].name})`);
        }
        if (recommendations.length === 0) {
            recommendations.push('Network load is balanced. Continue monitoring.');
        }

        // 6. Trend Intelligence
        const bookingTrendsDaily = [
            { day: 'Mon', bookings: 12 }, { day: 'Tue', bookings: 19 },
            { day: 'Wed', bookings: 15 }, { day: 'Thu', bookings: 25 },
            { day: 'Fri', bookings: 32 }, { day: 'Sat', bookings: 40 },
            { day: 'Sun', bookings: 28 }
        ];
        const peakDay = bookingTrendsDaily.reduce((max, obj) => obj.bookings > max.bookings ? obj : max, bookingTrendsDaily[0]).day;
        const trendGrowth = "+15%"; // Mock growth

        const revToday = todayBookings.length * 15;
        
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
                totalVehicles: users.length
            },
            alerts,
            activityFeed,
            recommendations,
            queueStats: {
                avgWaitTimeMin: fullyOccupiedStations > 0 ? 15 : 0,
                longestQueueStation,
                totalQueuedToday: todayBookings.length,
                availableSlotsOverall: globalAvailablePorts
            },
            usersStats: {
                activeToday: Math.round(users.length * 0.4),
                newRegistrations: recentlyRegistered.length,
                frequentBookers: Math.round(users.length * 0.1)
            },
            revenue: {
                today: revToday,
                perStationAvg: enhancedStations.length > 0 ? Math.round(revToday / enhancedStations.length) : 0,
                avgDurationMin: 45
            },
            trends: {
                bookingTrendsDaily,
                peakDay,
                trendGrowth,
                prediction: "High demand expected this weekend"
            },
            mapStations: enhancedStations,
            fleetList: users.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                vehicleModel: u.vehicleModel || 'Standard EV',
                vehicleNumber: u.vehicleNumber || 'Unassigned'
            }))
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
