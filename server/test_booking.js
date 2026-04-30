const axios = require('axios');

async function testBooking() {
    try {
        // 1. Login to get token
        const loginRes = await axios.post('http://127.0.0.1:5000/api/auth/login', {
            email: 'testuser@gmail.com', // Assuming a test user exists
            password: 'password' // Assuming this is the password
        });
        
        console.log('Login success:', loginRes.data);
        const token = loginRes.data.token;
        const vehicleModel = loginRes.data.vehicleModel || 'Test Model';
        
        // 2. Get nearby stations to get a stationId
        const stationsRes = await axios.get('http://127.0.0.1:5000/api/stations/nearby');
        const station = stationsRes.data[0];
        
        console.log('Got station:', station.name, station._id);
        
        // 3. Create booking
        const start = new Date();
        start.setMinutes(start.getMinutes() + 60); // 1 hr from now
        const end = new Date(start.getTime() + 60*60*1000);
        
        const bookingRes = await axios.post('http://127.0.0.1:5000/api/bookings', {
            stationId: station._id,
            bookingDate: start.toISOString().split('T')[0],
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            vehicleModel: vehicleModel
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Booking created:', bookingRes.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testBooking();
