const express = require('express');
const router = express.Router();
const { getBatteryTrends, getSessionAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.route('/battery-trends').get(protect, getBatteryTrends);
router.route('/sessions').get(protect, getSessionAnalytics);

module.exports = router;
