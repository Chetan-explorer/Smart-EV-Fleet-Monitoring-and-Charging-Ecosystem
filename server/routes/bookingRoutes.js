const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    getUserBookings, 
    getBookingHistory, 
    cancelBooking 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking);
router.route('/my').get(protect, getUserBookings);
router.route('/history').get(protect, getBookingHistory);
router.route('/:id/cancel').put(protect, cancelBooking);

module.exports = router;
