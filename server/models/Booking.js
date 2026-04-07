const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChargingStation',
        required: true
    },
    vehicle: {
        type: String, // Vehicle details or license plate for the user
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    estimatedEndTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'charging', 'completed', 'cancelled'],
        default: 'scheduled'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', BookingSchema);
