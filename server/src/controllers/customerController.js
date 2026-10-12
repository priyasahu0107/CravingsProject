import { Restaurant, FoodItem, FoodCategory, Order, Address, Favourite, Coupon, Notification } from '../models/index.js';
import { asyncHandler } from '../middleware/index.js';

// ==================== GET RESTAURANTS ====================
export const getRestaurants = asyncHandler(async (req, res) => {
  const { cuisine, search, sortBy = 'rating', page = 1, limit = 20 } = req.query;
  
  const query = { status: 'approved', isOpen: true };
  
  if (cuisine && cuisine !== 'all') {
    query.cuisine = { $regex: cuisine, $options: 'i' };
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { cuisine: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOptions = {
    rating: { rating: -1 },
    deliveryTime: { deliveryTime: 1 },
    deliveryFee: { deliveryFee: 1 },
  };

  const restaurants = await Restaurant.find(query)
    .sort(sortOptions[sortBy] || { rating: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Restaurant.countDocuments(query);

  res.json({
    success: true,
    data: restaurants,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// ==================== GET RESTAURANT BY ID ====================
export const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: 'Restaurant not found.',
      error: 'NOT_FOUND',
    });
  }
  res.json({ success: true, data: restaurant });
});

// ==================== GET RESTAURANT MENU ====================
export const getRestaurantMenu = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  
  const categories = await FoodCategory.find({ restaurantId, isActive: true }).sort({ displayOrder: 1 });
  const items = await FoodItem.find({ restaurantId }).sort({ name: 1 });

  res.json({
    success: true,
    data: { categories, items },
  });
});

// ==================== SEARCH ====================
export const search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.json({ success: true, data: { restaurants: [], foods: [] } });
  }

  const restaurants = await Restaurant.find({
    status: 'approved',
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { cuisine: { $regex: q, $options: 'i' } },
    ],
  }).limit(10);

  const foods = await FoodItem.find({
    isAvailable: true,
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ],
  }).populate('restaurantId', 'name').limit(20);

  res.json({
    success: true,
    data: { restaurants, foods },
  });
});

// ==================== ADDRESSES ====================
export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ userId: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  res.json({ success: true, data: addresses });
});

export const createAddress = asyncHandler(async (req, res) => {
  const address = await Address.create({ ...req.body, userId: req.user._id });
  res.status(201).json({ success: true, message: 'Address added.', data: address });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!address) {
    return res.status(404).json({ success: false, message: 'Address not found.', error: 'NOT_FOUND' });
  }
  res.json({ success: true, message: 'Address updated.', data: address });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!address) {
    return res.status(404).json({ success: false, message: 'Address not found.', error: 'NOT_FOUND' });
  }
  res.json({ success: true, message: 'Address deleted.' });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  // Unset all defaults
  await Address.updateMany({ userId: req.user._id }, { isDefault: false });
  // Set new default
  const address = await Address.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isDefault: true },
    { new: true }
  );
  if (!address) {
    return res.status(404).json({ success: false, message: 'Address not found.', error: 'NOT_FOUND' });
  }
  res.json({ success: true, message: 'Default address set.', data: address });
});

// ==================== FAVOURITES ====================
export const getFavourites = asyncHandler(async (req, res) => {
  const favourites = await Favourite.find({ userId: req.user._id }).sort({ addedAt: -1 });
  res.json({ success: true, data: favourites });
});

export const addFavourite = asyncHandler(async (req, res) => {
  const { type, itemId } = req.body;
  
  const existing = await Favourite.findOne({ userId: req.user._id, itemId });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Already in favourites.', error: 'DUPLICATE' });
  }

  const favourite = await Favourite.create({ userId: req.user._id, type, itemId });
  res.status(201).json({ success: true, message: 'Added to favourites.', data: favourite });
});

export const removeFavourite = asyncHandler(async (req, res) => {
  const favourite = await Favourite.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!favourite) {
    return res.status(404).json({ success: false, message: 'Favourite not found.', error: 'NOT_FOUND' });
  }
  res.json({ success: true, message: 'Removed from favourites.' });
});

// ==================== COUPON VALIDATION ====================
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;
  
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid coupon code.', error: 'INVALID_COUPON' });
  }

  const now = new Date();
  if (now < coupon.startDate || now > coupon.endDate) {
    return res.status(400).json({ success: false, message: 'Coupon has expired.', error: 'EXPIRED' });
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ success: false, message: 'Coupon usage limit reached.', error: 'LIMIT_REACHED' });
  }

  if (subtotal < coupon.minimumOrder) {
    return res.status(400).json({ 
      success: false, 
      message: `Minimum order of ₹${coupon.minimumOrder} required.`, 
      error: 'MINIMUM_ORDER' 
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maximumDiscount) {
      discount = Math.min(discount, coupon.maximumDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    success: true,
    data: {
      coupon: { code: coupon.code, description: coupon.description },
      discount: Math.round(discount),
    },
  });
});

// ==================== NOTIFICATIONS ====================
export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const notifications = await Notification.find({ recipientId: req.user._id })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const unreadCount = await Notification.countDocuments({ recipientId: req.user._id, isRead: false });

  res.json({
    success: true,
    data: notifications,
    unreadCount,
  });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, recipientId: req.user._id },
    { isRead: true }
  );
  res.json({ success: true, message: 'Notification marked as read.' });
});

// ==================== ORDERS ====================
export const getOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  
  const query = { customerId: req.user._id };
  if (status) query.orderStatus = status;

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate('restaurantId', 'name');

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    customerId: req.user._id,
  }).populate('restaurantId', 'name');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.', error: 'NOT_FOUND' });
  }

  res.json({ success: true, data: order });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  const order = await Order.findOne({ _id: req.params.id, customerId: req.user._id });
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.', error: 'NOT_FOUND' });
  }

  // Only allow cancellation before restaurant accepts
  const cancellableStatuses = ['payment_pending', 'order_placed'];
  if (!cancellableStatuses.includes(order.orderStatus)) {
    return res.status(400).json({
      success: false,
      message: 'Order cannot be cancelled at this stage.',
      error: 'CANCELLATION_NOT_ALLOWED',
    });
  }

  order.orderStatus = 'cancelled';
  order.cancellationReason = reason || 'Customer requested cancellation';
  order.statusHistory.push({
    status: 'cancelled',
    updatedBy: req.user._id,
    note: order.cancellationReason,
  });
  await order.save();

  res.json({ success: true, message: 'Order cancelled.', data: order });
});
