const ChargingStation = require('../models/ChargingStation');

const Booking = require('../models/Booking');

// @desc    Get all charging stations
// @route   GET /api/stations
// @access  Private
const getStations = async (req, res) => {
    try {
        const stations = await ChargingStation.find({});
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get stations with crowding/queue logic (for User view)
// @route   GET /api/stations/nearby
// @access  Private (User)
const getStationsWithMetrics = async (req, res) => {
    try {
        const stations = await ChargingStation.find({}).lean();
        const now = new Date();

        // Count current & future bookings (conceptually finding queue)
        const activeBookings = await Booking.find({ estimatedEndTime: { $gte: now }, status: { $in: ['charging', 'scheduled'] }});

        // Enrich stations with crowding info
        const enhancedStations = stations.map(station => {
            const stationBookings = activeBookings.filter(b => b.stationId.toString() === station._id.toString());
            
            // Basic metric logic: if > 1 it's crowded, etc. Note: this would be more complex in production
            const crowdednessLevel = stationBookings.length > 2 ? 'High' : (stationBookings.length > 0 ? 'Moderate' : 'Low');
            
            // Find lowest completion time to display when a spot frees up
            let nextAvailable = null;
            if (stationBookings.length > 0) {
                 const times = stationBookings.map(b => new Date(b.estimatedEndTime).getTime());
                 nextAvailable = new Date(Math.min(...times));
            }

            return {
                ...station,
                activeBookingsCount: stationBookings.length,
                crowdedness: crowdednessLevel,
                nextAvailableSlot: nextAvailable
            };
        });

        // Sort by crowding (least crowded first)
        enhancedStations.sort((a, b) => a.activeBookingsCount - b.activeBookingsCount);

        res.json(enhancedStations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStations, getStationsWithMetrics };
