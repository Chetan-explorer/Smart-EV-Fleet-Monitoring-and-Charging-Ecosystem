const express = require('express');
const router = express.Router();
const { getStations, getStationsWithMetrics } = require('../controllers/stationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getStations);
router.route('/nearby').get(protect, getStationsWithMetrics);

module.exports = router;
