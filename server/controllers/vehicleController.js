const User = require('../models/User');

// @desc    Get all vehicles (mapped from Users)
// @route   GET /api/vehicles
// @access  Private (Admin & FleetManager)
const getVehicles = async (req, res) => {
    try {
        const users = await User.find({ role: 'User', vehicleNumber: { $ne: '' } });
        
        // Map user to vehicle payload schema expected by frontend
        const vehicles = users.map(u => ({
            _id: u._id,
            vehicleId: u.name, // Display owner name instead of generic ID
            vehicleNumber: u.vehicleNumber,
            model: u.vehicleModel,
            batteryCapacity: u.batteryCapacity || 100,
            status: u.vehicleStatus || 'idle',
            email: u.email
        }));

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

        const users = await User.find({ role: 'User', vehicleNumber: { $ne: '' } });
        const avgBattery = users.length > 0 ? 
            (users.reduce((acc, curr) => acc + (curr.batteryCapacity || 100), 0) / users.length).toFixed(1) : 0;

        res.json({
            total,
            active,
            charging,
            idle,
            avgBattery: Number(avgBattery)
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
        const { vehicleNumber, model, batteryCapacity, status } = req.body;
        
        const updateData = {};
        if (vehicleNumber !== undefined) updateData.vehicleNumber = vehicleNumber;
        if (model !== undefined) updateData.vehicleModel = model;
        if (batteryCapacity !== undefined) updateData.batteryCapacity = batteryCapacity;
        if (status !== undefined) updateData.vehicleStatus = status;

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        
        if (updatedUser) {
            res.json({
                _id: updatedUser._id,
                vehicleId: updatedUser.name,
                vehicleNumber: updatedUser.vehicleNumber,
                model: updatedUser.vehicleModel,
                batteryCapacity: updatedUser.batteryCapacity,
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
            vehicleStatus: 'idle',
            batteryCapacity: 100
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
