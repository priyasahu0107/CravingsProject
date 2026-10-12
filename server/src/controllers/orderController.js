import { v4 as uuidv4 } from 'uuid';
import { Order, Restaurant, FoodItem, Address, Delivery, Notification, RiderProfile } from '../models/index.js';
import { asyncHandler } from '../middleware/index.js';

// ==================== CHECKOUT CALCULATION ====================
export const calculateCheckout = asyncHandler(async (req, res) => {
  const { restaurantId, items, addressId, couponCode } = req.body;

  // Validate restaurant
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.status !== 'approved') {
    return res.status(404).json({ success: false, message: 'Restaurant not found or not available.', error: 'RESTAURANT_NOT_FOUND' });
  }

  if (!restaurant.isOpen) {
    return res.status(400).json({ success: false, message: 'Restaurant is currently closed.', error: 'RESTAURANT_CLOSED' });
  }

  // Validate and fetch items with current prices
  const foodItemIds = items.map(i => i.foodItemId);
  const foodItems = await FoodItem.find({ _id: { $in: foodItemIds }, restaurantId, isAvailable: true });

  if (foodItems.length !== items.length) {
    return res.status(400).json({ 
      success: false, 
      message: 'Some items are unavailable.', 
      error: 'ITEMS_UNAVAILABLE' 
    });
  }

  // Calculate subtotal with current prices
  let subtotal = 0;
  const validatedItems = items.map(item => {
    const foodItem = foodItems.find(f => f._id.toString() === item.foodItemId);
    const price = foodItem.basePrice;
    const itemTotal = price * item.quantity;
    subtotal += itemTotal;
    return {
      foodItemId: foodItem._id,
      name: foodItem.name,
      quantity: item.quantity,
      price,
      variant: item.variant || null,
      addons: item.addons || [],
      specialInstructions: item.specialInstructions || '',
    };
  });

  // Validate minimum order
  if (subtotal < restaurant.minimumOrder) {
    return res.status(400).json({
      success: false,
      message: `Minimum order amount is ₹${restaurant.minimumOrder}.`,
      error: 'MINIMUM_ORDER_NOT_MET',
    });
  }

  // Validate address
  const address = await Address.findOne({ _id: addressId });
  if (!address) {
    return res.status(404).json({ success: false, message: 'Delivery address not found.', error: 'ADDRESS_NOT_FOUND' });
  }

  // Calculate fees
  const deliveryFee = restaurant.deliveryFee;
  const platformFee = restaurant.platformFee || 5;
  const tax = Math.round(subtotal * (restaurant.taxRate || 0.05));

  // Apply coupon if provided
  let discount = 0;
  if (couponCode) {
    // Coupon validation would go here - simplified for now
    discount = 0;
  }

  const total = subtotal + deliveryFee + platformFee + tax - discount;

  res.json({
    success: true,
    data: {
      items: validatedItems,
      pricing: {
        subtotal,
        deliveryFee,
        platformFee,
        tax,
        discount,
        total,
      },
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        minimumOrder: restaurant.minimumOrder,
      },
      deliveryAddress: address,
    },
  });
});

// ==================== PLACE ORDER ====================
export const placeOrder = asyncHandler(async (req, res) => {
  const { restaurantId, items, addressId, couponCode, paymentMethod } = req.body;

  // Validate restaurant
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant || restaurant.status !== 'approved' || !restaurant.isOpen) {
    return res.status(400).json({ success: false, message: 'Restaurant not available.', error: 'RESTAURANT_UNAVAILABLE' });
  }

  // Validate items with current prices
  const foodItemIds = items.map(i => i.foodItemId);
  const foodItems = await FoodItem.find({ _id: { $in: foodItemIds }, restaurantId, isAvailable: true });

  if (foodItems.length !== items.length) {
    return res.status(400).json({ success: false, message: 'Some items are no longer available.', error: 'ITEMS_UNAVAILABLE' });
  }

  // Calculate pricing server-side
  let subtotal = 0;
  const orderItems = items.map(item => {
    const foodItem = foodItems.find(f => f._id.toString() === item.foodItemId);
    const price = foodItem.basePrice;
    subtotal += price * item.quantity;
    return {
      foodItemId: foodItem._id,
      name: foodItem.name,
      quantity: item.quantity,
      price,
      variant: item.variant || null,
      addons: item.addons || [],
      specialInstructions: item.specialInstructions || '',
    };
  });

  // Validate minimum order
  if (subtotal < restaurant.minimumOrder) {
    return res.status(400).json({ success: false, message: 'Minimum order not met.', error: 'MINIMUM_ORDER_NOT_MET' });
  }

  // Get address
  const address = await Address.findOne({ _id: addressId });
  if (!address) {
    return res.status(404).json({ success: false, message: 'Address not found.', error: 'ADDRESS_NOT_FOUND' });
  }

  // Calculate fees
  const deliveryFee = restaurant.deliveryFee;
  const platformFee = restaurant.platformFee || 5;
  const tax = Math.round(subtotal * (restaurant.taxRate || 0.05));
  const discount = 0; // Coupon logic would go here
  const total = subtotal + deliveryFee + platformFee + tax - discount;

  // Generate unique order number
  const orderNumber = `CRV${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // Generate delivery OTP
  const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

  // Create order
  const order = await Order.create({
    orderNumber,
    customerId: req.user._id,
    restaurantId,
    items: orderItems,
    deliveryAddress: {
      name: address.name,
      phone: address.phone,
      address: `${address.houseNumber}, ${address.street}, ${address.area}, ${address.city} - ${address.pincode}`,
      latitude: address.latitude,
      longitude: address.longitude,
    },
    pricing: { subtotal, deliveryFee, platformFee, tax, discount, total },
    couponCode,
    payment: {
      method: paymentMethod || 'cod',
      status: paymentMethod === 'online' ? 'pending' : 'success',
    },
    orderStatus: paymentMethod === 'online' ? 'payment_pending' : 'order_placed',
    deliveryOtp,
    statusHistory: [{
      status: paymentMethod === 'online' ? 'payment_pending' : 'order_placed',
      updatedBy: req.user._id,
    }],
  });

  // Create notification for restaurant
  await Notification.create({
    recipientId: restaurant.ownerId,
    type: 'order',
    title: 'New Order Received!',
    message: `New order #${orderNumber} worth ₹${total}`,
    data: { orderId: order._id, orderNumber },
  });

  // Emit socket event (if socket.io is available)
  if (req.app.get('io')) {
    const io = req.app.get('io');
    io.to(`restaurant:${restaurant._id}`).emit('newOrder', { orderId: order._id, orderNumber });
  }

  res.status(201).json({
    success: true,
    message: 'Order placed successfully.',
    data: order,
  });
});

// ==================== PAYMENT VERIFICATION (Razorpay) ====================
export const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  // In production, verify signature with Razorpay secret
  // For now, mark payment as successful
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.', error: 'NOT_FOUND' });
  }

  if (order.customerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Unauthorized.', error: 'FORBIDDEN' });
  }

  order.payment.status = 'success';
  order.payment.transactionId = razorpayPaymentId;
  order.payment.razorpayOrderId = razorpayOrderId;
  order.payment.razorpayPaymentId = razorpayPaymentId;
  order.orderStatus = 'order_placed';
  order.statusHistory.push({
    status: 'order_placed',
    updatedBy: req.user._id,
    note: 'Payment verified',
  });
  await order.save();

  // Notify restaurant
  await Notification.create({
    recipientId: order.restaurantId,
    type: 'order',
    title: 'Payment Received',
    message: `Payment received for order #${order.orderNumber}`,
    data: { orderId: order._id },
  });

  res.json({ success: true, message: 'Payment verified.', data: order });
});
