import { Restaurant, FoodItem, FoodCategory, Order, Review } from '../models/index.js';
import { asyncHandler, authorize } from '../middleware/index.js';

// Helper to get restaurant for authenticated restaurant owner
const getOwnerRestaurant = async (userId) => {
  return await Restaurant.findOne({ ownerId: userId });
};

// ==================== DASHBOARD STATS ====================
export const getDashboard = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found.', error: 'NOT_FOUND' });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = await Order.countDocuments({
    restaurantId: restaurant._id,
    createdAt: { $gte: today },
  });

  const todayRevenue = await Order.aggregate([
    { $match: { restaurantId: restaurant._id, createdAt: { $gte: today }, orderStatus: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$pricing.total' } } },
  ]);

  const newOrders = await Order.countDocuments({
    restaurantId: restaurant._id,
    orderStatus: 'order_placed',
  });

  const preparingOrders = await Order.countDocuments({
    restaurantId: restaurant._id,
    orderStatus: { $in: ['restaurant_accepted', 'preparing', 'ready_for_pickup'] },
  });

  res.json({
    success: true,
    data: {
      restaurant,
      stats: {
        todayOrders,
        todayRevenue: todayRevenue[0]?.total || 0,
        newOrders,
        preparingOrders,
        avgRating: restaurant.rating,
      },
    },
  });
});

// ==================== GET ORDERS ====================
export const getOrders = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found.', error: 'NOT_FOUND' });
  }

  const { status, page = 1, limit = 20 } = req.query;
  const query = { restaurantId: restaurant._id };
  if (status) query.orderStatus = status;

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('customerId', 'name phone');

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: orders,
    pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) },
  });
});

// ==================== ACCEPT ORDER ====================
export const acceptOrder = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  const order = await Order.findOne({ _id: req.params.id, restaurantId: restaurant._id });
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

  if (order.orderStatus !== 'order_placed') {
    return res.status(400).json({ success: false, message: 'Order cannot be accepted at this stage.', error: 'INVALID_TRANSITION' });
  }

  order.orderStatus = 'restaurant_accepted';
  order.statusHistory.push({ status: 'restaurant_accepted', updatedBy: req.user._id });
  await order.save();

  if (req.app.get('io')) {
    req.app.get('io').to(`order:${order._id}`).emit('orderStatusUpdated', { orderId: order._id, status: 'restaurant_accepted' });
    req.app.get('io').to(`user:${order.customerId}`).emit('orderStatusUpdated', { orderId: order._id, status: 'restaurant_accepted' });
  }

  res.json({ success: true, message: 'Order accepted.', data: order });
});

// ==================== REJECT ORDER ====================
export const rejectOrder = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  const order = await Order.findOne({ _id: req.params.id, restaurantId: restaurant._id });
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

  if (order.orderStatus !== 'order_placed') {
    return res.status(400).json({ success: false, message: 'Order cannot be rejected at this stage.', error: 'INVALID_TRANSITION' });
  }

  order.orderStatus = 'rejected';
  order.cancellationReason = req.body.reason || 'Restaurant rejected the order';
  order.statusHistory.push({ status: 'rejected', updatedBy: req.user._id, note: order.cancellationReason });
  await order.save();

  if (req.app.get('io')) {
    req.app.get('io').to(`user:${order.customerId}`).emit('orderStatusUpdated', { orderId: order._id, status: 'rejected' });
  }

  res.json({ success: true, message: 'Order rejected.', data: order });
});

// ==================== UPDATE STATUS (Preparing / Ready) ====================
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  const order = await Order.findOne({ _id: req.params.id, restaurantId: restaurant._id });
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

  const validTransitions = {
    preparing: ['restaurant_accepted'],
    ready_for_pickup: ['preparing'],
  };

  if (!validTransitions[status] || !validTransitions[status].includes(order.orderStatus)) {
    return res.status(400).json({ success: false, message: 'Invalid status transition.', error: 'INVALID_TRANSITION' });
  }

  order.orderStatus = status;
  order.statusHistory.push({ status, updatedBy: req.user._id });
  await order.save();

  if (req.app.get('io')) {
    req.app.get('io').to(`order:${order._id}`).emit('orderStatusUpdated', { orderId: order._id, status });
    req.app.get('io').to(`user:${order.customerId}`).emit('orderStatusUpdated', { orderId: order._id, status });
  }

  res.json({ success: true, message: `Order status updated to ${status}.`, data: order });
});

// ==================== MENU MANAGEMENT ====================
export const getMenu = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  const categories = await FoodCategory.find({ restaurantId: restaurant._id }).sort({ displayOrder: 1 });
  const items = await FoodItem.find({ restaurantId: restaurant._id }).sort({ name: 1 });

  res.json({ success: true, data: { categories, items } });
});

export const createFoodItem = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  const item = await FoodItem.create({ ...req.body, restaurantId: restaurant._id });
  res.status(201).json({ success: true, message: 'Food item created.', data: item });
});

export const updateFoodItem = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  const item = await FoodItem.findOneAndUpdate(
    { _id: req.params.id, restaurantId: restaurant._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

  res.json({ success: true, message: 'Food item updated.', data: item });
});

export const deleteFoodItem = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  const item = await FoodItem.findOneAndDelete({ _id: req.params.id, restaurantId: restaurant._id });
  if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

  res.json({ success: true, message: 'Food item deleted.' });
});

export const toggleItemAvailability = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  const item = await FoodItem.findOne({ _id: req.params.id, restaurantId: restaurant._id });
  if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

  item.isAvailable = !item.isAvailable;
  await item.save();

  res.json({ success: true, message: `Item ${item.isAvailable ? 'available' : 'unavailable'}.`, data: item });
});

// ==================== CATEGORIES ====================
export const createCategory = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  const category = await FoodCategory.create({ ...req.body, restaurantId: restaurant._id });
  res.status(201).json({ success: true, message: 'Category created.', data: category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  const category = await FoodCategory.findOneAndUpdate(
    { _id: req.params.id, restaurantId: restaurant._id },
    req.body,
    { new: true }
  );
  if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

  res.json({ success: true, message: 'Category updated.', data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  await FoodCategory.findOneAndDelete({ _id: req.params.id, restaurantId: restaurant._id });
  res.json({ success: true, message: 'Category deleted.' });
});

// ==================== ANALYTICS ====================
export const getAnalytics = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weeklyOrders = await Order.aggregate([
    { $match: { restaurantId: restaurant._id, createdAt: { $gte: sevenDaysAgo }, orderStatus: { $ne: 'cancelled' } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, orders: { $sum: 1 }, revenue: { $sum: '$pricing.total' } } },
    { $sort: { _id: 1 } },
  ]);

  const topItems = await Order.aggregate([
    { $match: { restaurantId: restaurant._id, orderStatus: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    { $group: { _id: '$items.name', orders: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
    { $sort: { orders: -1 } },
    { $limit: 10 },
  ]);

  res.json({
    success: true,
    data: { weeklyOrders, topItems },
  });
});

// ==================== REVIEWS ====================
export const getReviews = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  const reviews = await Review.find({ restaurantId: restaurant._id })
    .sort({ createdAt: -1 })
    .populate('customerId', 'name')
    .limit(50);

  res.json({ success: true, data: reviews });
});

// ==================== PROFILE ====================
export const updateProfile = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  const { name, description, phone, email, address, openingHours, deliveryRadius, minimumOrder, deliveryFee } = req.body;
  
  Object.assign(restaurant, { name, description, phone, email, address, openingHours, deliveryRadius, minimumOrder, deliveryFee });
  await restaurant.save();

  res.json({ success: true, message: 'Restaurant profile updated.', data: restaurant });
});

export const toggleOpen = asyncHandler(async (req, res) => {
  const restaurant = await getOwnerRestaurant(req.user._id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

  restaurant.isOpen = !restaurant.isOpen;
  await restaurant.save();

  res.json({ success: true, message: `Restaurant is now ${restaurant.isOpen ? 'open' : 'closed'}.`, data: { isOpen: restaurant.isOpen } });
});
