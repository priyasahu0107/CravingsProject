import { User, Restaurant, RiderProfile, Order, Coupon, FoodCategory, AuditLog, Notification } from '../models/index.js';
import { asyncHandler } from '../middleware/index.js';

// ==================== DASHBOARD OVERVIEW ====================
export const getDashboard = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalCustomers,
    totalRestaurants,
    totalRiders,
    todayOrders,
    todayRevenueResult,
    pendingRestaurants,
    pendingRiders,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer', isActive: true }),
    Restaurant.countDocuments({ status: 'approved' }),
    RiderProfile.countDocuments({ verificationStatus: 'verified' }),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.aggregate([
      { $match: { createdAt: { $gte: today }, orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]),
    Restaurant.countDocuments({ status: 'pending' }),
    User.countDocuments({ role: 'rider', status: 'pending' }),
  ]);

  res.json({
    success: true,
    data: {
      totalCustomers,
      totalRestaurants,
      totalRiders,
      todayOrders,
      todayRevenue: todayRevenueResult[0]?.total || 0,
      pendingApprovals: {
        restaurants: pendingRestaurants,
        riders: pendingRiders,
      },
    },
  });
});

// ==================== ANALYTICS ====================
export const getAnalytics = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const monthlyOrders = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, orderStatus: { $ne: 'cancelled' } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, orders: { $sum: 1 }, revenue: { $sum: '$pricing.total' } } },
    { $sort: { _id: 1 } },
  ]);

  const orderStatusBreakdown = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
  ]);

  const topRestaurants = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'cancelled' } } },
    { $group: { _id: '$restaurantId', orders: { $sum: 1 }, revenue: { $sum: '$pricing.total' } } },
    { $sort: { revenue: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'restaurants', localField: '_id', foreignField: '_id', as: 'restaurant' } },
    { $unwind: '$restaurant' },
    { $project: { name: '$restaurant.name', orders: 1, revenue: 1 } },
  ]);

  const performance = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        deliveredOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] } },
        cancelledOrders: { $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] } },
        totalRevenue: { $sum: '$pricing.total' },
      }
    },
  ]);

  const perf = performance[0] || {};
  const completionRate = perf.totalOrders ? ((perf.deliveredOrders || 0) / perf.totalOrders * 100).toFixed(1) : 0;
  const cancellationRate = perf.totalOrders ? ((perf.cancelledOrders || 0) / perf.totalOrders * 100).toFixed(1) : 0;
  const avgOrderValue = perf.totalOrders ? Math.round((perf.totalRevenue || 0) / perf.totalOrders) : 0;

  res.json({
    success: true,
    data: {
      monthlyOrders,
      orderStatusBreakdown,
      topRestaurants,
      performance: {
        totalOrders: perf.totalOrders || 0,
        deliveredOrders: perf.deliveredOrders || 0,
        cancelledOrders: perf.cancelledOrders || 0,
        totalRevenue: perf.totalRevenue || 0,
        completionRate: Number(completionRate),
        cancellationRate: Number(cancellationRate),
        avgOrderValue,
      },
    },
  });
});

// ==================== USER MANAGEMENT ====================
export const getUsers = asyncHandler(async (req, res) => {
  const { role, status, page = 1, limit = 20, search } = req.query;
  const query = {};
  
  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query)
    .select('-password -refreshToken')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: users,
    pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) },
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive, status } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive, status },
    { new: true }
  ).select('-password -refreshToken');

  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  await AuditLog.create({
    userId: req.user._id,
    action: 'USER_STATUS_UPDATED',
    resource: 'User',
    resourceId: user._id,
    details: { isActive, status },
  });

  res.json({ success: true, message: 'User status updated.', data: user });
});

// ==================== RESTAURANT MANAGEMENT ====================
export const getRestaurants = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;

  const restaurants = await Restaurant.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('ownerId', 'name email phone');

  const total = await Restaurant.countDocuments(query);

  res.json({
    success: true,
    data: restaurants,
    pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) },
  });
});

export const approveRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { status: 'approved' },
    { new: true }
  );
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  // Update owner status
  await User.findByIdAndUpdate(restaurant.ownerId, { status: 'approved' });

  await AuditLog.create({
    userId: req.user._id,
    action: 'RESTAURANT_APPROVED',
    resource: 'Restaurant',
    resourceId: restaurant._id,
  });

  await Notification.create({
    recipientId: restaurant.ownerId,
    type: 'system',
    title: 'Restaurant Approved!',
    message: `Your restaurant "${restaurant.name}" has been approved.`,
  });

  res.json({ success: true, message: 'Restaurant approved.', data: restaurant });
});

export const rejectRestaurant = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected' },
    { new: true }
  );
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  await User.findByIdAndUpdate(restaurant.ownerId, { status: 'rejected' });

  await AuditLog.create({
    userId: req.user._id,
    action: 'RESTAURANT_REJECTED',
    resource: 'Restaurant',
    resourceId: restaurant._id,
    details: { reason },
  });

  res.json({ success: true, message: 'Restaurant rejected.', data: restaurant });
});

export const suspendRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { status: 'suspended', isOpen: false },
    { new: true }
  );
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  await AuditLog.create({
    userId: req.user._id,
    action: 'RESTAURANT_SUSPENDED',
    resource: 'Restaurant',
    resourceId: restaurant._id,
  });

  res.json({ success: true, message: 'Restaurant suspended.', data: restaurant });
});

// ==================== RIDER MANAGEMENT ====================
export const getRiders = asyncHandler(async (req, res) => {
  const { verificationStatus, page = 1, limit = 20 } = req.query;
  const query = {};
  if (verificationStatus) query.verificationStatus = verificationStatus;

  const riders = await RiderProfile.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('userId', 'name email phone');

  const total = await RiderProfile.countDocuments(query);

  res.json({
    success: true,
    data: riders,
    pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) },
  });
});

export const approveRider = asyncHandler(async (req, res) => {
  const rider = await RiderProfile.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: 'verified' },
    { new: true }
  );
  if (!rider) return res.status(404).json({ success: false, message: 'Rider not found.' });

  await User.findByIdAndUpdate(rider.userId, { status: 'approved' });

  await AuditLog.create({
    userId: req.user._id,
    action: 'RIDER_APPROVED',
    resource: 'RiderProfile',
    resourceId: rider._id,
  });

  await Notification.create({
    recipientId: rider.userId,
    type: 'system',
    title: 'Account Verified!',
    message: 'Your rider account has been verified. You can now go online and accept deliveries.',
  });

  res.json({ success: true, message: 'Rider approved.', data: rider });
});

export const rejectRider = asyncHandler(async (req, res) => {
  const rider = await RiderProfile.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: 'rejected' },
    { new: true }
  );
  if (!rider) return res.status(404).json({ success: false, message: 'Rider not found.' });

  await User.findByIdAndUpdate(rider.userId, { status: 'rejected' });

  await AuditLog.create({
    userId: req.user._id,
    action: 'RIDER_REJECTED',
    resource: 'RiderProfile',
    resourceId: rider._id,
  });

  res.json({ success: true, message: 'Rider rejected.', data: rider });
});

// ==================== ORDER MANAGEMENT ====================
export const getOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.orderStatus = status;

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('customerId', 'name email')
    .populate('restaurantId', 'name')
    .populate('riderId', 'name');

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: orders,
    pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) },
  });
});

// ==================== COUPON MANAGEMENT ====================
export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, data: coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  await AuditLog.create({
    userId: req.user._id,
    action: 'COUPON_CREATED',
    resource: 'Coupon',
    resourceId: coupon._id,
  });
  res.status(201).json({ success: true, message: 'Coupon created.', data: coupon });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
  res.json({ success: true, message: 'Coupon updated.', data: coupon });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Coupon deleted.' });
});

// ==================== CATEGORY MANAGEMENT ====================
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await FoodCategory.find().sort({ name: 1 });
  res.json({ success: true, data: categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await FoodCategory.create(req.body);
  res.status(201).json({ success: true, message: 'Category created.', data: category });
});

// ==================== AUDIT LOGS ====================
export const getAuditLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  
  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('userId', 'name email');

  res.json({ success: true, data: logs });
});
