const Booking = require('../models/Booking');
const ChargingStation = require('../models/ChargingStation');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User)
const createBooking = async (req, res) => {
    try {
        const { vehicleModel, stationId, bookingDate, startTime, endTime } = req.body;

        // Verify station exists
        const station = await ChargingStation.findById(stationId);
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        // Basic overlap prevention:
        // Find if this specific station has overlapping active bookings.
        // For simplicity, we assume 1 slot per station. If multiple slots, logic would count active vs capacity.
        const overlapping = await Booking.find({
            stationId,
            status: 'active',
            $or: [
                { startTime: { $lt: end, $gte: start } },
                { endTime: { $gt: start, $lte: end } },
                { startTime: { $lte: start }, endTime: { $gte: end } }
            ]
        });

        if (overlapping.length >= station.capacity) {
            return res.status(400).json({ message: 'All charging ports are occupied for this time slot' });
        }

        const booking = await Booking.create({
            userId: req.user._id,
            vehicleModel,
            stationId,
            bookingDate,
            startTime,
            endTime,
            status: 'active'
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user bookings (active)
// @route   GET /api/bookings/my
// @access  Private (User)
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ 
            userId: req.user._id,
            status: 'active'
        }).populate('stationId', 'name location').sort({ startTime: 1 });
        
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get booking history
// @route   GET /api/bookings/history
// @access  Private (User)
const getBookingHistory = async (req, res) => {
    try {
        const bookings = await Booking.find({
            userId: req.user._id,
            status: { $in: ['completed', 'cancelled'] }
        }).populate('stationId', 'name location').sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (User)
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify owner
        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (booking.status !== 'active') {
            return res.status(400).json({ message: `Cannot cancel a ${booking.status} booking` });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getBookingHistory,
    cancelBooking
};
