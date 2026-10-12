import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as authController from '../controllers/authController.js';
import * as customerController from '../controllers/customerController.js';
import * as orderController from '../controllers/orderController.js';
import * as restaurantController from '../controllers/restaurantController.js';
import * as riderController from '../controllers/riderController.js';
import * as adminController from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/index.js';

const router = Router();

// Validation middleware helper
const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }
    const errors = req.validationErrors?.() || [];
    if (errors.length) {
      return res.status(400).json({ success: false, message: 'Validation failed.', errors });
    }
    next();
  };
};

// ==================== AUTH ROUTES ====================
router.post('/auth/register',
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().notEmpty(),
  body('password').isLength({ min: 6 }),
  authController.register
);

router.post('/auth/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  authController.login
);

router.post('/auth/logout', authenticate, authController.logout);
router.post('/auth/refresh', authController.refreshToken);
router.get('/auth/me', authenticate, authController.getMe);
router.put('/auth/profile', authenticate, authController.updateProfile);
router.put('/auth/change-password', authenticate, authController.changePassword);
router.post('/auth/register-restaurant', authenticate, authController.registerRestaurant);
router.post('/auth/register-rider', authenticate, authController.registerRider);

// ==================== CUSTOMER ROUTES ====================
router.get('/restaurants', customerController.getRestaurants);
router.get('/restaurants/:id', customerController.getRestaurantById);
router.get('/restaurants/:restaurantId/menu', customerController.getRestaurantMenu);
router.get('/search', customerController.search);

// Addresses
router.get('/addresses', authenticate, authorize('customer'), customerController.getAddresses);
router.post('/addresses', authenticate, authorize('customer'), customerController.createAddress);
router.put('/addresses/:id', authenticate, authorize('customer'), customerController.updateAddress);
router.delete('/addresses/:id', authenticate, authorize('customer'), customerController.deleteAddress);
router.put('/addresses/:id/default', authenticate, authorize('customer'), customerController.setDefaultAddress);

// Favourites
router.get('/favourites', authenticate, authorize('customer'), customerController.getFavourites);
router.post('/favourites', authenticate, authorize('customer'), customerController.addFavourite);
router.delete('/favourites/:id', authenticate, authorize('customer'), customerController.removeFavourite);

// Coupons
router.post('/coupons/validate', authenticate, authorize('customer'), customerController.validateCoupon);

// Notifications
router.get('/notifications', authenticate, customerController.getNotifications);
router.put('/notifications/:id/read', authenticate, customerController.markNotificationRead);

// Orders (Customer)
router.get('/orders', authenticate, authorize('customer'), customerController.getOrders);
router.get('/orders/:id', authenticate, authorize('customer'), customerController.getOrderById);
router.post('/orders/:id/cancel', authenticate, authorize('customer'), customerController.cancelOrder);

// Checkout & Place Order
router.post('/checkout/calculate', authenticate, authorize('customer'), orderController.calculateCheckout);
router.post('/orders', authenticate, authorize('customer'), orderController.placeOrder);
router.post('/orders/verify-payment', authenticate, authorize('customer'), orderController.verifyPayment);

// ==================== RESTAURANT ROUTES ====================
router.get('/restaurant/dashboard', authenticate, authorize('restaurant'), restaurantController.getDashboard);
router.get('/restaurant/orders', authenticate, authorize('restaurant'), restaurantController.getOrders);
router.put('/restaurant/orders/:id/accept', authenticate, authorize('restaurant'), restaurantController.acceptOrder);
router.put('/restaurant/orders/:id/reject', authenticate, authorize('restaurant'), restaurantController.rejectOrder);
router.put('/restaurant/orders/:id/status/:status', authenticate, authorize('restaurant'), restaurantController.updateOrderStatus);

// Menu
router.get('/restaurant/menu', authenticate, authorize('restaurant'), restaurantController.getMenu);
router.post('/restaurant/menu', authenticate, authorize('restaurant'), restaurantController.createFoodItem);
router.put('/restaurant/menu/:id', authenticate, authorize('restaurant'), restaurantController.updateFoodItem);
router.delete('/restaurant/menu/:id', authenticate, authorize('restaurant'), restaurantController.deleteFoodItem);
router.patch('/restaurant/menu/:id/availability', authenticate, authorize('restaurant'), restaurantController.toggleItemAvailability);

// Categories
router.post('/restaurant/categories', authenticate, authorize('restaurant'), restaurantController.createCategory);
router.put('/restaurant/categories/:id', authenticate, authorize('restaurant'), restaurantController.updateCategory);
router.delete('/restaurant/categories/:id', authenticate, authorize('restaurant'), restaurantController.deleteCategory);

// Analytics & Reviews
router.get('/restaurant/analytics', authenticate, authorize('restaurant'), restaurantController.getAnalytics);
router.get('/restaurant/reviews', authenticate, authorize('restaurant'), restaurantController.getReviews);

// Profile
router.put('/restaurant/profile', authenticate, authorize('restaurant'), restaurantController.updateProfile);
router.patch('/restaurant/toggle-open', authenticate, authorize('restaurant'), restaurantController.toggleOpen);

// ==================== RIDER ROUTES ====================
router.get('/rider/dashboard', authenticate, authorize('rider'), riderController.getDashboard);
router.put('/rider/status', authenticate, authorize('rider'), riderController.toggleStatus);
router.get('/rider/requests', authenticate, authorize('rider'), riderController.getDeliveryRequests);
router.post('/rider/requests/:orderId/accept', authenticate, authorize('rider'), riderController.acceptDelivery);
router.post('/rider/requests/:orderId/reject', authenticate, authorize('rider'), riderController.rejectDelivery);
router.put('/rider/deliveries/:id/status/:status', authenticate, authorize('rider'), riderController.updateDeliveryStatus);
router.post('/rider/deliveries/:id/verify-otp', authenticate, authorize('rider'), riderController.verifyOtp);
router.post('/rider/location', authenticate, authorize('rider'), riderController.updateLocation);
router.get('/rider/history', authenticate, authorize('rider'), riderController.getHistory);
router.get('/rider/earnings', authenticate, authorize('rider'), riderController.getEarnings);

// ==================== ADMIN ROUTES ====================
router.get('/admin/dashboard', authenticate, authorize('admin'), adminController.getDashboard);
router.get('/admin/analytics', authenticate, authorize('admin'), adminController.getAnalytics);

// Users
router.get('/admin/users', authenticate, authorize('admin'), adminController.getUsers);
router.put('/admin/users/:id/status', authenticate, authorize('admin'), adminController.updateUserStatus);

// Restaurants
router.get('/admin/restaurants', authenticate, authorize('admin'), adminController.getRestaurants);
router.put('/admin/restaurants/:id/approve', authenticate, authorize('admin'), adminController.approveRestaurant);
router.put('/admin/restaurants/:id/reject', authenticate, authorize('admin'), adminController.rejectRestaurant);
router.put('/admin/restaurants/:id/suspend', authenticate, authorize('admin'), adminController.suspendRestaurant);

// Riders
router.get('/admin/riders', authenticate, authorize('admin'), adminController.getRiders);
router.put('/admin/riders/:id/approve', authenticate, authorize('admin'), adminController.approveRider);
router.put('/admin/riders/:id/reject', authenticate, authorize('admin'), adminController.rejectRider);

// Orders
router.get('/admin/orders', authenticate, authorize('admin'), adminController.getOrders);

// Coupons
router.get('/admin/coupons', authenticate, authorize('admin'), adminController.getCoupons);
router.post('/admin/coupons', authenticate, authorize('admin'), adminController.createCoupon);
router.put('/admin/coupons/:id', authenticate, authorize('admin'), adminController.updateCoupon);
router.delete('/admin/coupons/:id', authenticate, authorize('admin'), adminController.deleteCoupon);

// Categories
router.get('/admin/categories', authenticate, authorize('admin'), adminController.getCategories);
router.post('/admin/categories', authenticate, authorize('admin'), adminController.createCategory);

// Audit Logs
router.get('/admin/audit-logs', authenticate, authorize('admin'), adminController.getAuditLogs);

export default router;
