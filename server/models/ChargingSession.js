const mongoose = require('mongoose');

const ChargingSessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    station: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChargingStation',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    energyConsumed: {
        type: Number,
        default: 0 // in kWh
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ChargingSession', ChargingSessionSchema);
