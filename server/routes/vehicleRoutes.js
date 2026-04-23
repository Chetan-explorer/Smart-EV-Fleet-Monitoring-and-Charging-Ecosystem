const express = require('express');
const router = express.Router();
const { getVehicles, getVehicleMetrics, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, getVehicles);
router.route('/metrics/summary').get(protect, getVehicleMetrics);
router.route('/:id').put(protect, authorize('Admin'), updateVehicle).delete(protect, authorize('Admin'), deleteVehicle);

module.exports = router;
