import express from 'express';
import { createOrder, getMyOrders, getOrder, cancelOrder } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('customer'), createOrder);
router.get('/', protect, authorize('customer'), getMyOrders);
router.get('/:id', protect, getOrder);
router.post('/:id/cancel', protect, authorize('customer'), cancelOrder);

export default router;
