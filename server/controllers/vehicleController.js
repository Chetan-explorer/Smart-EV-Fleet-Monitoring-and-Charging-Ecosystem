const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all vehicles (mapped from Users)
// @route   GET /api/vehicles
// @access  Private (Admin & FleetManager)
const getVehicles = async (req, res) => {
    try {
        const users = await User.find({ role: 'User', vehicleNumber: { $ne: '' } }).lean();
        const allBookings = await Booking.find({}).lean();
        
        const vehicles = users.map(u => {
            const userBookings = allBookings.filter(b => b.userId.toString() === u._id.toString());
            let lastActive = null;
            if (userBookings.length > 0) {
                const sorted = [...userBookings].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
                lastActive = sorted[0].createdAt;
            }

            return {
                _id: u._id,
                vehicleId: u.name,
                vehicleNumber: u.vehicleNumber,
                model: u.vehicleModel,
                status: u.vehicleStatus || 'idle',
                email: u.email,
                totalSessions: userBookings.length,
                lastActive
            };
        });

        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get vehicle metrics
// @route   GET /api/vehicles/metrics/summary
// @access  Private
const getVehicleMetrics = async (req, res) => {
    try {
        const total = await User.countDocuments({ role: 'User', vehicleNumber: { $ne: '' } });
        const active = await User.countDocuments({ role: 'User', vehicleStatus: 'active' });
        const charging = await User.countDocuments({ role: 'User', vehicleStatus: 'charging' });
        const idle = await User.countDocuments({ role: 'User', vehicleStatus: 'idle' });

        res.json({
            total,
            active,
            charging,
            idle
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a vehicle's specific attributes (Linked to User)
// @route   PUT /api/vehicles/:id
// @access  Private (Admin)
const updateVehicle = async (req, res) => {
    try {
        // We only allow updating the vehicle aspects of the user account from the Vehicle screen.
        const { vehicleNumber, model, status } = req.body;
        
        const updateData = {};
        if (vehicleNumber !== undefined) updateData.vehicleNumber = vehicleNumber;
        if (model !== undefined) updateData.vehicleModel = model;
        if (status !== undefined) updateData.vehicleStatus = status;

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        
        if (updatedUser) {
            res.json({
                _id: updatedUser._id,
                vehicleId: updatedUser.name,
                vehicleNumber: updatedUser.vehicleNumber,
                model: updatedUser.vehicleModel,
                status: updatedUser.vehicleStatus
            });
        } else {
            res.status(404).json({ message: 'User/Vehicle not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a vehicle (Effectively unlinks the EV from the User)
// @route   DELETE /api/vehicles/:id
// @access  Private (Admin)
const deleteVehicle = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            vehicleNumber: '',
            vehicleModel: '',
            vehicleStatus: 'idle'
        });

        if (user) {
            res.json({ message: 'Vehicle details stripped from User' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getVehicles,
    getVehicleMetrics,
    updateVehicle,
    deleteVehicle
};
