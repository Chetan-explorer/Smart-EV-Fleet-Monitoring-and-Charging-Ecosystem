const mongoose = require('mongoose');

const ChargingStationSchema = new mongoose.Schema({
    stationId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    availability: {
        type: String,
        enum: ['available', 'occupied', 'offline'],
        default: 'available'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ChargingStation', ChargingStationSchema);
