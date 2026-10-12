import express from 'express';
import {
  getRestaurants,
  getRestaurant,
  getRestaurantMenu,
  getMyRestaurant,
  updateMyRestaurant,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getRestaurantOrders,
  updateOrderStatus,
} from '../controllers/restaurantController.js';
import { protect, authorize, checkApproval } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getRestaurants);
router.get('/:id', getRestaurant);
router.get('/:id/menu', getRestaurantMenu);

// Restaurant routes (protected)
router.get('/my/restaurant', protect, authorize('restaurant'), checkApproval, getMyRestaurant);
router.put('/my/restaurant', protect, authorize('restaurant'), checkApproval, updateMyRestaurant);
router.post('/my/menu', protect, authorize('restaurant'), checkApproval, addFoodItem);
router.put('/my/menu/:itemId', protect, authorize('restaurant'), checkApproval, updateFoodItem);
router.delete('/my/menu/:itemId', protect, authorize('restaurant'), checkApproval, deleteFoodItem);
router.get('/my/orders', protect, authorize('restaurant'), checkApproval, getRestaurantOrders);
router.put('/my/orders/:orderId/status', protect, authorize('restaurant'), checkApproval, updateOrderStatus);

export default router;
