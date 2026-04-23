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
        const startOfDay = new Date();
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date();
        endOfDay.setHours(23,59,59,999);

        // Count current active bookings for capacity tracking
        const activeBookings = await Booking.find({ 
            startTime: { $lte: now },
            endTime: { $gte: now }, 
            status: 'active' 
        });

        // Count all bookings for today to track day-wise queue
        const todayBookings = await Booking.find({
            startTime: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'cancelled' }
        });

        const enhancedStations = stations.map(station => {
            const stationActive = activeBookings.filter(b => b.stationId.toString() === station._id.toString());
            const stationToday = todayBookings.filter(b => b.stationId.toString() === station._id.toString());
            
            const cap = station.capacity || 1;
            const availableSlots = Math.max(0, cap - stationActive.length);
            
            let crowdednessLevel = 'Low';
            if (availableSlots === 0) crowdednessLevel = 'High';
            else if (availableSlots === 1 && cap > 1) crowdednessLevel = 'Moderate';
            else if (availableSlots < cap) crowdednessLevel = 'Moderate';

            // Find lowest completion time to display when a spot frees up
            let nextAvailable = null;
            if (stationActive.length > 0) {
                 const times = stationActive.map(b => new Date(b.endTime).getTime());
                 nextAvailable = new Date(Math.min(...times));
            }

            return {
                ...station,
                activeBookingsCount: stationActive.length, // Current occupied
                todayQueue: stationToday.length, // Total configured for today
                availableSlots,
                crowdedness: crowdednessLevel,
                nextAvailableSlot: availableSlots > 0 ? null : nextAvailable
            };
        });

        // Sort by crowding (least crowded first)
        enhancedStations.sort((a, b) => a.activeBookingsCount - b.activeBookingsCount);

        res.json(enhancedStations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a charging station
// @route   POST /api/stations
// @access  Private (Admin)
const createStation = async (req, res) => {
    try {
        const { stationId, name, location, availability, capacity } = req.body;
        const newStation = await ChargingStation.create({ stationId, name, location, availability, capacity });
        res.status(201).json(newStation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a charging station
// @route   PUT /api/stations/:id
// @access  Private (Admin)
const updateStation = async (req, res) => {
    try {
        const updatedStation = await ChargingStation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedStation) return res.status(404).json({ message: 'Station not found' });
        res.json(updatedStation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a charging station
// @route   DELETE /api/stations/:id
// @access  Private (Admin)
const deleteStation = async (req, res) => {
    try {
        const station = await ChargingStation.findByIdAndDelete(req.params.id);
        if (!station) return res.status(404).json({ message: 'Station not found' });
        res.json({ message: 'Station removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStations, getStationsWithMetrics, createStation, updateStation, deleteStation };
