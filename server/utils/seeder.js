const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const ChargingStation = require('../models/ChargingStation');
const ChargingSession = require('../models/ChargingSession');
const Booking = require('../models/Booking');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Vehicle.deleteMany();
        await ChargingStation.deleteMany();
        await ChargingSession.deleteMany();
        await Booking.deleteMany();

        // Create Users (Admin, FleetManager, User)
        const createdUsers = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@fleet.com',
                password: 'password123',
                role: 'Admin'
            },
            {
                name: 'Manager User',
                email: 'manager@fleet.com',
                password: 'password123',
                role: 'FleetManager'
            },
            {
                name: 'Daily Commuter',
                email: 'user@fleet.com',
                password: 'password123',
                role: 'User'
            }
        ]);

        const adminUser = createdUsers[0];
        const normalUser = createdUsers[2];

        // Vehicles
        const createdVehicles = await Vehicle.insertMany([
            { vehicleId: 'EV001', vehicleNumber: 'KA-01-EV-1234', model: 'Tesla Model 3', batteryCapacity: 85, status: 'active' },
            { vehicleId: 'EV002', vehicleNumber: 'KA-01-EV-5678', model: 'Nissan Leaf', batteryCapacity: 45, status: 'charging' },
            { vehicleId: 'EV003', vehicleNumber: 'KA-01-EV-9101', model: 'Hyundai Kona', batteryCapacity: 92, status: 'idle' },
            { vehicleId: 'EV004', vehicleNumber: 'KA-01-EV-1121', model: 'Tata Nexon EV', batteryCapacity: 30, status: 'active' },
            { vehicleId: 'EV005', vehicleNumber: 'KA-01-EV-3141', model: 'MG ZS EV', batteryCapacity: 15, status: 'charging' }
        ]);

        // Charging Stations
        const createdStations = await ChargingStation.insertMany([
            { stationId: 'CS001', name: 'Koramangala Fast Charge', location: { lat: 12.9352, lng: 77.6245 }, availability: 'available' },
            { stationId: 'CS002', name: 'Whitefield Hub', location: { lat: 12.9698, lng: 77.7500 }, availability: 'occupied' },
            { stationId: 'CS003', name: 'Indiranagar Station', location: { lat: 12.9784, lng: 77.6408 }, availability: 'available' }
        ]);

        // Create Bookings (to simulate crowdedness)
        // We will add 3 bookings to the second station (Whitefield Hub) to make it "crowded"
        const now = new Date();
        const future1 = new Date(now.getTime() + 30 * 60000); // +30m
        const future2 = new Date(now.getTime() + 60 * 60000); // +60m

        await Booking.insertMany([
            { userId: normalUser._id, stationId: createdStations[1]._id, vehicle: 'TN-02-AB-3333', startTime: now, estimatedEndTime: future1, status: 'charging' },
            { userId: normalUser._id, stationId: createdStations[1]._id, vehicle: 'KA-04-XY-9999', startTime: future1, estimatedEndTime: future2, status: 'scheduled' },
            { userId: normalUser._id, stationId: createdStations[0]._id, vehicle: 'MH-01-CD-1111', startTime: now, estimatedEndTime: future1, status: 'charging' }
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Vehicle.deleteMany();
        await ChargingStation.deleteMany();
        await ChargingSession.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
