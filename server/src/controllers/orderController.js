import Order from '../models/Order.js';
import FoodItem from '../models/FoodItem.js';
import Restaurant from '../models/Restaurant.js';

const PLATFORM_FEE = 5;
const TAX_RATE = 0.05;

// @desc    Calculate order totals (server-side)
const calculateOrderTotals = (items, deliveryFee, couponDiscount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + deliveryFee + PLATFORM_FEE + tax - couponDiscount;
  return { subtotal, deliveryFee, platformFee: PLATFORM_FEE, tax, discount: couponDiscount, total };
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private (Customer)
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Verify all items exist and are available
    const foodItemIds = items.map(item => item.foodItemId);
    const foodItems = await FoodItem.find({ _id: { $in: foodItemIds } });

    if (foodItems.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: 'Some items are no longer available',
      });
    }

    // Check availability
    const unavailable = foodItems.filter(item => !item.isAvailable);
    if (unavailable.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Items not available: ${unavailable.map(i => i.name).join(', ')}`,
      });
    }

    // All items must be from same restaurant
    const restaurantId = foodItems[0].restaurantId;
    const allSameRestaurant = foodItems.every(item =>
      item.restaurantId.toString() === restaurantId.toString()
    );

    if (!allSameRestaurant) {
      return res.status(400).json({
        success: false,
        message: 'All items must be from the same restaurant',
      });
    }

    // Get restaurant for delivery fee
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || !restaurant.isOpen) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant is currently closed',
      });
    }

    // Build order items with current prices
    const orderItems = items.map(cartItem => {
      const foodItem = foodItems.find(f => f._id.toString() === cartItem.foodItemId);
      return {
        foodItemId: foodItem._id,
        name: foodItem.name,
        quantity: cartItem.quantity,
        price: foodItem.price, // Use server price
        foodType: foodItem.foodType,
        specialInstructions: cartItem.specialInstructions || '',
      };
    });

    // Calculate totals server-side
    const pricing = calculateOrderTotals(orderItems, restaurant.deliveryFee);

    // Check minimum order
    if (pricing.subtotal < restaurant.minimumOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹${restaurant.minimumOrder}`,
      });
    }

    // Create order
    const order = await Order.create({
      customerId: req.user.id,
      restaurantId,
      items: orderItems,
      deliveryAddress,
      pricing,
      couponCode,
      payment: {
        method: paymentMethod || 'cod',
        status: paymentMethod === 'online' ? 'pending' : 'success',
      },
      status: paymentMethod === 'online' ? 'payment_pending' : 'order_placed',
      statusHistory: [{
        status: paymentMethod === 'online' ? 'payment_pending' : 'order_placed',
        timestamp: new Date(),
        note: 'Order created',
      }],
    });

    // Populate restaurant info
    await order.populate('restaurantId', 'name phone');

    // Emit socket event
    if (req.io) {
      req.io.to(`restaurant_${restaurantId}`).emit('newOrder', {
        orderId: order._id,
        orderNumber: order.orderNumber,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get customer orders
// @route   GET /api/orders
// @access  Private (Customer)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('restaurantId', 'name logo');

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurantId', 'name phone address')
      .populate('customerId', 'name phone')
      .populate('riderId', 'name phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check ownership
    if (order.customerId._id.toString() !== req.user.id &&
        order.restaurantId.ownerId?.toString() !== req.user.id &&
        req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel order
// @route   POST /api/orders/:id/cancel
// @access  Private (Customer)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customerId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Can only cancel if not yet accepted or prepared
    const cancellableStatuses = ['payment_pending', 'order_placed'];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage',
      });
    }

    order.addStatus('cancelled', req.body.reason || 'Cancelled by customer');
    order.cancellationReason = req.body.reason || 'Cancelled by customer';
    await order.save();

    if (req.io) {
      req.io.to(`restaurant_${order.restaurantId}`).emit('orderCancelled', {
        orderId: order._id,
      });
    }

    res.json({ success: true, message: 'Order cancelled', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
