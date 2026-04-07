const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private (Admin & FleetManager)
const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Private
const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (vehicle) {
            res.json(vehicle);
        } else {
            res.status(404).json({ message: 'Vehicle not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get vehicle metrics
// @route   GET /api/vehicles/metrics/summary
// @access  Private
const getVehicleMetrics = async (req, res) => {
    try {
        const total = await Vehicle.countDocuments();
        const active = await Vehicle.countDocuments({ status: 'active' });
        const charging = await Vehicle.countDocuments({ status: 'charging' });
        const idle = await Vehicle.countDocuments({ status: 'idle' });

        // Aggregate average battery capacity (assuming battery capacity is the current level for simplicity in MVP, 
        // normally we would query BatteryData model for latest levels. Let's send a mock avg battery % for now, or calculate it)
        const vehicles = await Vehicle.find({});
        const avgBattery = vehicles.length > 0 ? 
            (vehicles.reduce((acc, curr) => acc + (curr.batteryCapacity || 80), 0) / vehicles.length).toFixed(1) : 0;

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

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private (Admin)
const createVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Admin)
const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (vehicle) {
            res.json(vehicle);
        } else {
            res.status(404).json({ message: 'Vehicle not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Admin)
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (vehicle) {
            res.json({ message: 'Vehicle removed' });
        } else {
            res.status(404).json({ message: 'Vehicle not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getVehicles,
    getVehicleById,
    getVehicleMetrics,
    createVehicle,
    updateVehicle,
    deleteVehicle
};
