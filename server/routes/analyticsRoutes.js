const express = require('express');
const router = express.Router();
const { getBatteryTrends, getSessionAnalytics, getBookingAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.route('/battery-trends').get(protect, getBatteryTrends);
router.route('/sessions').get(protect, getSessionAnalytics);
router.route('/bookings').get(protect, getBookingAnalytics);

module.exports = router;
