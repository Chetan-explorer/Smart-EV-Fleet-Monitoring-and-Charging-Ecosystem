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
