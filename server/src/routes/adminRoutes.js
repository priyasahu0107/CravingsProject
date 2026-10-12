import express from 'express';
import {
  getDashboardStats,
  getAllRestaurants,
  approveRestaurant,
  rejectRestaurant,
  getAllRiders,
  approveRider,
  getAllOrders,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes are protected
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/restaurants', getAllRestaurants);
router.put('/restaurants/:id/approve', approveRestaurant);
router.put('/restaurants/:id/reject', rejectRestaurant);
router.get('/riders', getAllRiders);
router.put('/riders/:id/approve', approveRider);
router.get('/orders', getAllOrders);

export default router;
