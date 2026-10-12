import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  foodItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem',
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // Price at time of order
  foodType: { type: String, enum: ['veg', 'non_veg', 'egg'] },
  specialInstructions: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
    index: true,
  },
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [orderItemSchema],
  deliveryAddress: {
    label: String,
    name: String,
    phone: String,
    houseNumber: String,
    street: String,
    area: String,
    city: String,
    state: String,
    pincode: String,
    fullAddress: String,
  },
  pricing: {
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    platformFee: { type: Number, default: 5 },
    tax: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  couponCode: String,
  payment: {
    method: {
      type: String,
      enum: ['online', 'cod'],
      default: 'online',
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: String,
    razorpayOrderId: String,
  },
  status: {
    type: String,
    enum: [
      'payment_pending',
      'order_placed',
      'restaurant_accepted',
      'preparing',
      'ready_for_pickup',
      'rider_assigned',
      'rider_accepted',
      'picked_up',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'rejected',
    ],
    default: 'payment_pending',
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
  }],
  deliveryOtp: {
    type: String,
    select: false,
  },
  estimatedDeliveryTime: String,
  cancellationReason: String,
  customerNote: String,
  restaurantNote: String,
}, {
  timestamps: true,
});

// Indexes for efficient queries
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, status: 1, createdAt: -1 });
orderSchema.index({ riderId: 1, status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });

// Generate unique order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `CRV${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Add status to history
orderSchema.methods.addStatus = function(status, note = '') {
  this.status = status;
  this.statusHistory.push({
    status,
    timestamp: new Date(),
    note,
  });
};

export default mongoose.model('Order', orderSchema);
