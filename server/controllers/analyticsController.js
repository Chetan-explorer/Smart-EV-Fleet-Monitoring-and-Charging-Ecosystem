const BatteryData = require('../models/BatteryData');
const ChargingSession = require('../models/ChargingSession');

// @desc    Get battery trends
// @route   GET /api/analytics/battery-trends
// @access  Private
const getBatteryTrends = async (req, res) => {
    try {
        // Return some mock trend data for the frontend chart (Recharts)
        // In a real app we would aggregate BatteryData by hour/day
        const trends = [
            { time: '00:00', avgBattery: 85 },
            { time: '04:00', avgBattery: 78 },
            { time: '08:00', avgBattery: 70 },
            { time: '12:00', avgBattery: 55 },
            { time: '16:00', avgBattery: 45 },
            { time: '20:00', avgBattery: 60 }, // charging started
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

module.exports = {
    getBatteryTrends,
    getSessionAnalytics
};
