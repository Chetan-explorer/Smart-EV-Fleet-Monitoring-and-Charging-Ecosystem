const express = require('express');
const router = express.Router();
const { getStations, getStationsWithMetrics, createStation, updateStation, deleteStation } = require('../controllers/stationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, getStations).post(protect, authorize('Admin'), createStation);
router.route('/nearby').get(protect, getStationsWithMetrics);
router.route('/:id')
    .put(protect, authorize('Admin'), updateStation)
    .delete(protect, authorize('Admin'), deleteStation);

module.exports = router;
