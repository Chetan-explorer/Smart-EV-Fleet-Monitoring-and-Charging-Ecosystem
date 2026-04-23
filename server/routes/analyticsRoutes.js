const express = require('express');
const router = express.Router();
const { getBatteryTrends, getSessionAnalytics, getCommandCenterAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.route('/battery-trends').get(protect, getBatteryTrends);
router.route('/sessions').get(protect, getSessionAnalytics);
router.route('/command-center').get(protect, getCommandCenterAnalytics);

module.exports = router;
