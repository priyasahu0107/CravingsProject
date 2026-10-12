import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Order from '../models/Order.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalCustomers,
      totalRestaurants,
      totalRiders,
      todayOrders,
      pendingRestaurants,
      pendingRiders,
    ] = await Promise.all([
      User.countDocuments({ role: 'customer', isActive: true }),
      Restaurant.countDocuments({ status: 'approved' }),
      User.countDocuments({ role: 'rider', status: 'approved' }),
      Order.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      Restaurant.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'rider', status: 'pending' }),
    ]);

    // Calculate today's revenue
    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          status: { $ne: 'cancelled' },
          'payment.status': 'success',
        },
      },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('customerId', 'name')
      .populate('restaurantId', 'name')
      .populate('riderId', 'name');

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalRestaurants,
        totalRiders,
        todayOrders,
        todayRevenue: todayRevenue[0]?.total || 0,
        pendingApprovals: {
          restaurants: pendingRestaurants,
          riders: pendingRiders,
        },
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all restaurants (admin)
// @route   GET /api/admin/restaurants
// @access  Private (Admin)
export const getAllRestaurants = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const restaurants = await Restaurant.find(filter)
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve restaurant
// @route   PUT /api/admin/restaurants/:id/approve
// @access  Private (Admin)
export const approveRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    restaurant.status = 'approved';
    await restaurant.save();

    // Update owner status
    await User.findByIdAndUpdate(restaurant.ownerId, { status: 'approved' });

    res.json({ success: true, message: 'Restaurant approved', data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject restaurant
// @route   PUT /api/admin/restaurants/:id/reject
// @access  Private (Admin)
export const rejectRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    restaurant.status = 'rejected';
    await restaurant.save();

    await User.findByIdAndUpdate(restaurant.ownerId, { status: 'rejected' });

    res.json({ success: true, message: 'Restaurant rejected', data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all riders (admin)
// @route   GET /api/admin/riders
// @access  Private (Admin)
export const getAllRiders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { role: 'rider' };
    if (status) filter.status = status;

    const riders = await User.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: riders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve rider
// @route   PUT /api/admin/riders/:id/approve
// @access  Private (Admin)
export const approveRider = async (req, res) => {
  try {
    const rider = await User.findById(req.params.id);
    if (!rider || rider.role !== 'rider') {
      return res.status(404).json({ success: false, message: 'Rider not found' });
    }

    rider.status = 'approved';
    await rider.save();

    res.json({ success: true, message: 'Rider approved', data: rider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name')
      .populate('riderId', 'name');

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
