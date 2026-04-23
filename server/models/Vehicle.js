const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    vehicleId: {
        type: String,
        required: true,
        unique: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    batteryCapacity: {
        type: Number,
        required: true // in kWh
    },
    status: {
        type: String,
        enum: ['charging', 'idle', 'active'],
        default: 'idle'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
