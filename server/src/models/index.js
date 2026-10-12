import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

// ==================== USER MODEL ====================
const userSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['customer', 'restaurant', 'rider', 'admin'], default: 'customer' },
  avatar: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'approved' },
  refreshToken: { type: String, select: false },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });

export const User = model('User', userSchema);

// ==================== RESTAURANT MODEL ====================
const restaurantSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  logo: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  description: { type: String, maxlength: 500 },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  cuisine: [{ type: String, trim: true }],
  openingHours: [{
    day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    open: String,
    close: String,
    isClosed: { type: Boolean, default: false },
  }],
  deliveryRadius: { type: Number, default: 5 },
  minimumOrder: { type: Number, default: 100 },
  deliveryFee: { type: Number, default: 29 },
  platformFee: { type: Number, default: 5 },
  taxRate: { type: Number, default: 0.05 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'under_review', 'approved', 'rejected', 'suspended'], default: 'pending' },
  isOpen: { type: Boolean, default: true },
}, { timestamps: true });

restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ status: 1 });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ ownerId: 1 });

export const Restaurant = model('Restaurant', restaurantSchema);

// ==================== FOOD CATEGORY MODEL ====================
const foodCategorySchema = new Schema({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String },
  image: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

foodCategorySchema.index({ restaurantId: 1 });

export const FoodCategory = model('FoodCategory', foodCategorySchema);

// ==================== FOOD ITEM MODEL ====================
const foodItemSchema = new Schema({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'FoodCategory' },
  name: { type: String, required: true, trim: true },
  description: { type: String, maxlength: 300 },
  image: { type: String, default: '' },
  basePrice: { type: Number, required: true, min: 0 },
  foodType: { type: String, enum: ['veg', 'non_veg', 'egg'], required: true },
  preparationTime: { type: Number, default: 15 },
  variants: [{
    name: String,
    price: { type: Number, required: true },
  }],
  addons: [{
    name: String,
    price: { type: Number, required: true },
  }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

foodItemSchema.index({ restaurantId: 1 });
foodItemSchema.index({ categoryId: 1 });
foodItemSchema.index({ name: 'text', description: 'text' });

export const FoodItem = model('FoodItem', foodItemSchema);

// ==================== ADDRESS MODEL ====================
const addressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  houseNumber: { type: String, required: true },
  street: { type: String, required: true },
  area: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  instructions: String,
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

addressSchema.index({ userId: 1 });

export const Address = model('Address', addressSchema);

// ==================== ORDER MODEL ====================
const orderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  riderId: { type: Schema.Types.ObjectId, ref: 'User' },
  
  items: [{
    foodItemId: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // Price snapshot at order time
    variant: String,
    addons: [{ name: String, price: Number }],
    specialInstructions: String,
  }],
  
  deliveryAddress: {
    name: String,
    phone: String,
    address: String,
    latitude: Number,
    longitude: Number,
  },
  
  pricing: {
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    platformFee: { type: Number, default: 0 },
    tax: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  
  couponCode: String,
  
  payment: {
    method: { type: String, enum: ['online', 'cod'], required: true },
    status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
  },
  
  orderStatus: { 
    type: String, 
    enum: [
      'payment_pending', 'order_placed', 'restaurant_accepted', 
      'preparing', 'ready_for_pickup', 'rider_assigned',
      'rider_accepted', 'picked_up', 'out_for_delivery',
      'delivered', 'cancelled', 'rejected'
    ], 
    default: 'payment_pending' 
  },
  
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    note: String,
  }],
  
  cancellationReason: String,
  deliveryOtp: { type: String, select: false },
  estimatedDeliveryTime: Number,
  
  customerRating: Number,
  customerReview: String,
}, { timestamps: true });

orderSchema.index({ customerId: 1 });
orderSchema.index({ restaurantId: 1 });
orderSchema.index({ riderId: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

export const Order = model('Order', orderSchema);

// ==================== DELIVERY MODEL ====================
const deliverySchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  riderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  pickupLocation: { latitude: Number, longitude: Number },
  deliveryLocation: { latitude: Number, longitude: Number },
  
  distance: Number,
  estimatedTime: Number,
  earnings: { type: Number, default: 0 },
  
  status: { 
    type: String, 
    enum: ['assigned', 'accepted', 'arrived_restaurant', 'picked_up', 'arrived_customer', 'delivered', 'cancelled'],
    default: 'assigned' 
  },
  
  assignedAt: Date,
  acceptedAt: Date,
  arrivedAtRestaurantAt: Date,
  pickedUpAt: Date,
  arrivedAtCustomerAt: Date,
  deliveredAt: Date,
  
  deliveryOtp: { type: String, select: false },
}, { timestamps: true });

deliverySchema.index({ riderId: 1 });
deliverySchema.index({ orderId: 1 });
deliverySchema.index({ status: 1 });

export const Delivery = model('Delivery', deliverySchema);

// ==================== RIDER PROFILE MODEL ====================
const riderProfileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  vehicleType: { type: String, enum: ['bike', 'scooter', 'car', 'bicycle'], required: true },
  vehicleNumber: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  documents: [{ type: String }],
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  isOnline: { type: Boolean, default: false },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    updatedAt: Date,
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalDeliveries: { type: Number, default: 0 },
  acceptanceRate: { type: Number, default: 0 },
  completionRate: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
}, { timestamps: true });

riderProfileSchema.index({ isOnline: 1 });
riderProfileSchema.index({ 'currentLocation': '2dsphere' });

export const RiderProfile = model('RiderProfile', riderProfileSchema);

// ==================== COUPON MODEL ====================
const couponSchema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: String,
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minimumOrder: { type: Number, default: 0 },
  maximumDiscount: { type: Number },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },
  applicableRestaurants: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

export const Coupon = model('Coupon', couponSchema);

// ==================== FAVOURITE MODEL ====================
const favouriteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['restaurant', 'food'], required: true },
  itemId: { type: Schema.Types.ObjectId, required: true },
  addedAt: { type: Date, default: Date.now },
}, { timestamps: true });

favouriteSchema.index({ userId: 1, type: 1 });
favouriteSchema.index({ userId: 1, itemId: 1 }, { unique: true });

export const Favourite = model('Favourite', favouriteSchema);

// ==================== NOTIFICATION MODEL ====================
const notificationSchema = new Schema({
  recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['order', 'delivery', 'promo', 'system'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: Schema.Types.Mixed,
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export const Notification = model('Notification', notificationSchema);

// ==================== REVIEW MODEL ====================
const reviewSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  riderId: { type: Schema.Types.ObjectId, ref: 'User' },
  
  foodRating: { type: Number, min: 1, max: 5 },
  restaurantRating: { type: Number, min: 1, max: 5, required: true },
  riderRating: { type: Number, min: 1, max: 5 },
  
  comment: { type: String, maxlength: 500 },
  restaurantReply: String,
}, { timestamps: true });

reviewSchema.index({ restaurantId: 1 });
reviewSchema.index({ customerId: 1, orderId: 1 }, { unique: true });

export const Review = model('Review', reviewSchema);

// ==================== AUDIT LOG MODEL ====================
const auditLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  resource: String,
  resourceId: Schema.Types.ObjectId,
  details: Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
}, { timestamps: true });

auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

export const AuditLog = model('AuditLog', auditLogSchema);
