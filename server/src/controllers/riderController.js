import { Order, Delivery, RiderProfile, Notification, Restaurant } from '../models/index.js';
import { asyncHandler } from '../middleware/index.js';

// Helper to get rider profile
const getRiderProfile = async (userId) => {
  return await RiderProfile.findOne({ userId });
};

// ==================== DASHBOARD ====================
export const getDashboard = asyncHandler(async (req, res) => {
  const profile = await getRiderProfile(req.user._id);
  if (!profile) {
    return res.status(404).json({ success: false, message: 'Rider profile not found.', error: 'NOT_FOUND' });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayDeliveries = await Delivery.countDocuments({
    riderId: req.user._id,
    createdAt: { $gte: today },
  });

  const todayEarnings = await Delivery.aggregate([
    { $match: { riderId: req.user._id, createdAt: { $gte: today }, status: 'delivered' } },
    { $group: { _id: null, total: { $sum: '$earnings' } } },
  ]);

  const activeDelivery = await Delivery.findOne({
    riderId: req.user._id,
    status: { $in: ['accepted', 'arrived_restaurant', 'picked_up', 'arrived_customer'] },
  }).populate('orderId');

  res.json({
    success: true,
    data: {
      profile,
      stats: {
        todayDeliveries,
        todayEarnings: todayEarnings[0]?.total || 0,
        rating: profile.rating,
        acceptanceRate: profile.acceptanceRate,
        totalDeliveries: profile.totalDeliveries,
        totalEarnings: profile.totalEarnings,
      },
      activeDelivery,
    },
  });
});

// ==================== TOGGLE ONLINE/OFFLINE ====================
export const toggleStatus = asyncHandler(async (req, res) => {
  const profile = await getRiderProfile(req.user._id);
  if (!profile) return res.status(404).json({ success: false, message: 'Rider profile not found.' });

  if (profile.verificationStatus !== 'verified') {
    return res.status(403).json({ success: false, message: 'Account not verified.', error: 'NOT_VERIFIED' });
  }

  profile.isOnline = !profile.isOnline;
  await profile.save();

  res.json({ success: true, message: `You are now ${profile.isOnline ? 'online' : 'offline'}.`, data: { isOnline: profile.isOnline } });
});

// ==================== GET AVAILABLE DELIVERY REQUESTS ====================
export const getDeliveryRequests = asyncHandler(async (req, res) => {
  const profile = await getRiderProfile(req.user._id);
  if (!profile || !profile.isOnline) {
    return res.json({ success: true, data: [] });
  }

  // Find orders ready for pickup that don't have a rider yet
  const requests = await Order.find({
    orderStatus: 'ready_for_pickup',
    riderId: null,
  })
    .populate('restaurantId', 'name address location')
    .limit(10)
    .sort({ createdAt: -1 });

  // Calculate earnings for each (simplified - in production, use distance-based calculation)
  const requestList = requests.map(order => ({
    orderId: order._id,
    orderNumber: order.orderNumber,
    restaurantName: order.restaurantId?.name,
    restaurantAddress: order.restaurantId?.address,
    customerAddress: order.deliveryAddress?.address,
    items: order.items.length,
    total: order.pricing.total,
    earnings: Math.max(30, Math.round(order.pricing.total * 0.08)), // 8% of order value, min ₹30
    estimatedTime: order.estimatedDeliveryTime || 25,
  }));

  res.json({ success: true, data: requestList });
});

// ==================== ACCEPT DELIVERY ====================
export const acceptDelivery = asyncHandler(async (req, res) => {
  const profile = await getRiderProfile(req.user._id);
  if (!profile || !profile.isOnline) {
    return res.status(403).json({ success: false, message: 'You must be online to accept deliveries.' });
  }

  const { orderId } = req.params;

  // Use atomic update to prevent race conditions
  const order = await Order.findOneAndUpdate(
    { _id: orderId, orderStatus: 'ready_for_pickup', riderId: null },
    { 
      riderId: req.user._id,
      orderStatus: 'rider_assigned',
      $push: { statusHistory: { status: 'rider_assigned', updatedBy: req.user._id } }
    },
    { new: true }
  );

  if (!order) {
    return res.status(409).json({ success: false, message: 'Delivery already assigned or not available.', error: 'CONFLICT' });
  }

  // Create delivery record
  const restaurant = await Restaurant.findById(order.restaurantId);
  const earnings = Math.max(30, Math.round(order.pricing.total * 0.08));

  const delivery = await Delivery.create({
    orderId: order._id,
    riderId: req.user._id,
    restaurantId: order.restaurantId,
    customerId: order.customerId,
    pickupLocation: restaurant?.location,
    deliveryLocation: { latitude: order.deliveryAddress?.latitude, longitude: order.deliveryAddress?.longitude },
    earnings,
    status: 'accepted',
    assignedAt: new Date(),
    acceptedAt: new Date(),
    deliveryOtp: order.deliveryOtp,
  });

  // Update rider stats
  profile.acceptanceRate = Math.min(100, profile.acceptanceRate + 1);
  await profile.save();

  // Notify customer and restaurant
  if (req.app.get('io')) {
    const io = req.app.get('io');
    io.to(`user:${order.customerId}`).emit('riderAssigned', { orderId: order._id, riderName: req.user.name });
    io.to(`restaurant:${order.restaurantId}`).emit('riderAssigned', { orderId: order._id, riderName: req.user.name });
    io.to(`order:${order._id}`).emit('orderStatusUpdated', { orderId: order._id, status: 'rider_assigned' });
  }

  await Notification.create({
    recipientId: order.customerId,
    type: 'delivery',
    title: 'Rider Assigned!',
    message: `${req.user.name} is on the way to pick up your order.`,
    data: { orderId: order._id },
  });

  res.json({ success: true, message: 'Delivery accepted.', data: { order, delivery } });
});

// ==================== REJECT DELIVERY ====================
export const rejectDelivery = asyncHandler(async (req, res) => {
  const profile = await getRiderProfile(req.user._id);
  if (!profile) return res.status(404).json({ success: false, message: 'Rider profile not found.' });

  profile.acceptanceRate = Math.max(0, profile.acceptanceRate - 2);
  await profile.save();

  res.json({ success: true, message: 'Delivery declined.' });
});

// ==================== UPDATE DELIVERY STATUS ====================
export const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const delivery = await Delivery.findOne({
    _id: req.params.id,
    riderId: req.user._id,
  });

  if (!delivery) {
    return res.status(404).json({ success: false, message: 'Delivery not found.', error: 'NOT_FOUND' });
  }

  const validTransitions = {
    arrived_restaurant: ['accepted'],
    picked_up: ['arrived_restaurant'],
    arrived_customer: ['picked_up'],
    delivered: ['arrived_customer'],
  };

  if (!validTransitions[status] || !validTransitions[status].includes(delivery.status)) {
    return res.status(400).json({ success: false, message: 'Invalid status transition.', error: 'INVALID_TRANSITION' });
  }

  delivery.status = status;
  const timestampField = {
    arrived_restaurant: 'arrivedAtRestaurantAt',
    picked_up: 'pickedUpAt',
    arrived_customer: 'arrivedAtCustomerAt',
    delivered: 'deliveredAt',
  };
  delivery[timestampField[status]] = new Date();
  await delivery.save();

  // Update order status
  const orderStatusMap = {
    arrived_restaurant: 'rider_accepted',
    picked_up: 'picked_up',
    arrived_customer: 'out_for_delivery',
    delivered: 'delivered',
  };

  const order = await Order.findById(delivery.orderId);
  if (order) {
    order.orderStatus = orderStatusMap[status];
    order.statusHistory.push({ status: orderStatusMap[status], updatedBy: req.user._id });
    await order.save();

    // Update rider stats
    const profile = await getRiderProfile(req.user._id);
    if (profile) {
      profile.totalDeliveries += 1;
      profile.totalEarnings += delivery.earnings;
      profile.completionRate = Math.min(100, profile.completionRate + 1);
      await profile.save();
    }

    // Notify customer
    if (req.app.get('io')) {
      const io = req.app.get('io');
      io.to(`user:${order.customerId}`).emit('orderStatusUpdated', { orderId: order._id, status: orderStatusMap[status] });
      io.to(`order:${order._id}`).emit('orderStatusUpdated', { orderId: order._id, status: orderStatusMap[status] });
    }
  }

  res.json({ success: true, message: `Delivery status updated to ${status}.`, data: delivery });
});

// ==================== VERIFY DELIVERY OTP ====================
export const verifyOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const delivery = await Delivery.findOne({
    _id: req.params.id,
    riderId: req.user._id,
  }).select('+deliveryOtp');

  if (!delivery) {
    return res.status(404).json({ success: false, message: 'Delivery not found.' });
  }

  if (delivery.deliveryOtp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP.', error: 'INVALID_OTP' });
  }

  res.json({ success: true, message: 'OTP verified.' });
});

// ==================== UPDATE LOCATION ====================
export const updateLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;
  const profile = await getRiderProfile(req.user._id);
  if (!profile) return res.status(404).json({ success: false, message: 'Rider profile not found.' });

  profile.currentLocation = { latitude, longitude, updatedAt: new Date() };
  await profile.save();

  // Emit location update to relevant parties
  if (req.app.get('io')) {
    const activeDelivery = await Delivery.findOne({
      riderId: req.user._id,
      status: { $in: ['picked_up', 'arrived_customer'] },
    });

    if (activeDelivery) {
      req.app.get('io').to(`user:${activeDelivery.customerId}`).emit('riderLocationUpdated', {
        orderId: activeDelivery.orderId,
        latitude,
        longitude,
      });
    }
  }

  res.json({ success: true, message: 'Location updated.' });
});

// ==================== DELIVERY HISTORY ====================
export const getHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const deliveries = await Delivery.find({ riderId: req.user._id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('orderId', 'orderNumber pricing');

  const total = await Delivery.countDocuments({ riderId: req.user._id });

  res.json({
    success: true,
    data: deliveries,
    pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) },
  });
});

// ==================== EARNINGS ====================
export const getEarnings = asyncHandler(async (req, res) => {
  const profile = await getRiderProfile(req.user._id);
  if (!profile) return res.status(404).json({ success: false, message: 'Rider profile not found.' });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weeklyEarnings = await Delivery.aggregate([
    { $match: { riderId: req.user._id, status: 'delivered', createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, earnings: { $sum: '$earnings' } } },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    success: true,
    data: {
      totalEarnings: profile.totalEarnings,
      weeklyEarnings,
    },
  });
});
