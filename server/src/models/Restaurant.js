import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  logo: {
    type: String,
    default: '🍽️',
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop',
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  cuisine: [{
    type: String,
    trim: true,
  }],
  openingHours: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    open: String,
    close: String,
    isClosed: { type: Boolean, default: false },
  }],
  deliveryRadius: {
    type: Number,
    default: 5,
    min: [1, 'Delivery radius must be at least 1 km'],
    max: [50, 'Delivery radius cannot exceed 50 km'],
  },
  minimumOrder: {
    type: Number,
    default: 99,
    min: [0, 'Minimum order cannot be negative'],
  },
  deliveryFee: {
    type: Number,
    default: 29,
    min: [0, 'Delivery fee cannot be negative'],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for location-based queries
restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ status: 1 });
restaurantSchema.index({ cuisine: 1 });

export default mongoose.model('Restaurant', restaurantSchema);
