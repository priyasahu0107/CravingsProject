import Restaurant from '../models/Restaurant.js';
import FoodItem from '../models/FoodItem.js';
import Order from '../models/Order.js';

// @desc    Get all approved restaurants
// @route   GET /api/restaurants
// @access  Public
export const getRestaurants = async (req, res) => {
  try {
    const { cuisine, search, sort } = req.query;
    const filter = { status: 'approved' };

    if (cuisine && cuisine !== 'all') {
      filter.cuisine = { $regex: cuisine, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { rating: -1 };
    if (sort === 'deliveryTime') sortOption = { deliveryTime: 1 };
    if (sort === 'deliveryFee') sortOption = { deliveryFee: 1 };

    const restaurants = await Restaurant.find(filter).sort(sortOption);
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get restaurant menu
// @route   GET /api/restaurants/:id/menu
// @access  Public
export const getRestaurantMenu = async (req, res) => {
  try {
    const items = await FoodItem.find({ restaurantId: req.params.id });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my restaurant (for restaurant role)
// @route   GET /api/restaurant/my
// @access  Private (Restaurant)
export const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update restaurant profile
// @route   PUT /api/restaurant/my
// @access  Private (Restaurant)
export const updateMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const allowedFields = ['name', 'description', 'phone', 'email', 'address', 'cuisine', 'deliveryRadius', 'minimumOrder', 'deliveryFee', 'isOpen'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        restaurant[field] = req.body[field];
      }
    });

    await restaurant.save();
    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add food item
// @route   POST /api/restaurant/menu
// @access  Private (Restaurant)
export const addFoodItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const item = await FoodItem.create({
      ...req.body,
      restaurantId: restaurant._id,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update food item
// @route   PUT /api/restaurant/menu/:itemId
// @access  Private (Restaurant)
export const updateFoodItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    const item = await FoodItem.findOne({
      _id: req.params.itemId,
      restaurantId: restaurant._id,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    Object.assign(item, req.body);
    await item.save();

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete food item
// @route   DELETE /api/restaurant/menu/:itemId
// @access  Private (Restaurant)
export const deleteFoodItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    const item = await FoodItem.findOneAndDelete({
      _id: req.params.itemId,
      restaurantId: restaurant._id,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get restaurant orders
// @route   GET /api/restaurant/orders
// @access  Private (Restaurant)
export const getRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    const orders = await Order.find({ restaurantId: restaurant._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('customerId', 'name phone');

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status (restaurant)
// @route   PUT /api/restaurant/orders/:orderId/status
// @access  Private (Restaurant)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });

    const order = await Order.findOne({
      _id: req.params.orderId,
      restaurantId: restaurant._id,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Valid transitions for restaurant
    const validTransitions = {
      'order_placed': ['restaurant_accepted', 'rejected'],
      'restaurant_accepted': ['preparing'],
      'preparing': ['ready_for_pickup'],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${order.status} to ${status}`,
      });
    }

    order.addStatus(status);
    if (status === 'rejected') {
      order.cancellationReason = req.body.reason || 'Rejected by restaurant';
    }

    await order.save();

    // Emit socket event (will be implemented with socket.io)
    if (req.io) {
      req.io.to(`customer_${order.customerId}`).emit('orderStatusUpdated', {
        orderId: order._id,
        status: order.status,
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
