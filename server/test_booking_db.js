const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const ChargingStation = require('./models/ChargingStation');
const User = require('./models/User');

async function test() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ev-fleet');
    
    try {
        const user = await User.findOne({ role: 'User' });
        if (!user) {
            console.log('No user found');
            process.exit();
        }
        
        const station = await ChargingStation.findOne();
        if (!station) {
            console.log('No station found');
            process.exit();
        }
        
        const start = new Date();
        start.setMinutes(start.getMinutes() + 60);
        const end = new Date(start.getTime() + 60*60*1000);
        
        // Let's try inserting
        const booking = await Booking.create({
            userId: user._id,
            vehicleModel: user.vehicleModel, // Might be undefined or empty string
            stationId: station._id,
            bookingDate: start.toISOString().split('T')[0],
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            status: 'active'
        });
        console.log('Success:', booking);
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    mongoose.connection.close();
}

test();
