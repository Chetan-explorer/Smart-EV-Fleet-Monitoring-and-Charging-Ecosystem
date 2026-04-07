const express = require('express');
const router = express.Router();
const { getVehicles, getVehicleById, getVehicleMetrics, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, getVehicles).post(protect, authorize('Admin'), createVehicle);
router.route('/metrics/summary').get(protect, getVehicleMetrics);
router.route('/:id').get(protect, getVehicleById).put(protect, authorize('Admin'), updateVehicle).delete(protect, authorize('Admin'), deleteVehicle);

module.exports = router;
