const mongoose = require('mongoose');

const BatteryDataSchema = new mongoose.Schema({
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    batteryLevel: {
        type: Number,
        required: true // percentage 0-100
    },
    temperature: {
        type: Number,
        required: true // in celsius
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BatteryData', BatteryDataSchema);
