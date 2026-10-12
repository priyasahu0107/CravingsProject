import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Food item name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    maxlength: [300, 'Description cannot exceed 300 characters'],
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  foodType: {
    type: String,
    enum: ['veg', 'non_veg', 'egg'],
    required: true,
    default: 'veg',
  },
  preparationTime: {
    type: String,
    default: '20 min',
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
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
foodItemSchema.index({ restaurantId: 1, isAvailable: 1 });
foodItemSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('FoodItem', foodItemSchema);
