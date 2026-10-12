import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { User, Restaurant, RiderProfile, AuditLog } from '../models/index.js';
import { asyncHandler } from '../middleware/index.js';

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
  return { accessToken, refreshToken };
};

// ==================== REGISTER ====================
export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  // Only allow customer registration from public
  if (role && role !== 'customer') {
    return res.status(403).json({
      success: false,
      message: 'Only customer registration is allowed publicly. Contact admin for other roles.',
      error: 'FORBIDDEN_ROLE',
    });
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered.',
      error: 'EMAIL_EXISTS',
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'customer',
    isVerified: true,
    isActive: true,
    status: 'approved',
  });

  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  // Log audit
  await AuditLog.create({
    userId: user._id,
    action: 'USER_REGISTERED',
    resource: 'User',
    resourceId: user._id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(201).json({
    success: true,
    message: 'Registration successful.',
    data: {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    },
  });
});

// ==================== LOGIN ====================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password field
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
      error: 'INVALID_CREDENTIALS',
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
      error: 'INVALID_CREDENTIALS',
    });
  }

  // Check if active
  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated. Contact support.',
      error: 'ACCOUNT_DEACTIVATED',
    });
  }

  // Check approval status for non-customer roles
  if (user.role !== 'customer' && user.status !== 'approved') {
    return res.status(403).json({
      success: false,
      message: `Your account is ${user.status}. Please wait for admin approval.`,
      error: 'ACCOUNT_NOT_APPROVED',
      status: user.status,
    });
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  // Log audit
  await AuditLog.create({
    userId: user._id,
    action: 'USER_LOGIN',
    resource: 'User',
    resourceId: user._id,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.json({
    success: true,
    message: 'Login successful.',
    data: {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    },
  });
});

// ==================== LOGOUT ====================
export const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+refreshToken');
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  await AuditLog.create({
    userId: req.user._id,
    action: 'USER_LOGOUT',
    resource: 'User',
    resourceId: req.user._id,
  });

  res.json({
    success: true,
    message: 'Logout successful.',
  });
});

// ==================== REFRESH TOKEN ====================
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token required.',
      error: 'MISSING_TOKEN',
    });
  }

  const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
  const user = await User.findById(decoded.userId).select('+refreshToken');

  if (!user || user.refreshToken !== refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token.',
      error: 'INVALID_REFRESH_TOKEN',
    });
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
  user.refreshToken = newRefreshToken;
  await user.save();

  res.json({
    success: true,
    data: { accessToken, refreshToken: newRefreshToken },
  });
});

// ==================== GET ME ====================
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
});

// ==================== UPDATE PROFILE ====================
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, avatar },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Profile updated.',
    data: { user },
  });
});

// ==================== CHANGE PASSWORD ====================
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect.',
      error: 'INVALID_PASSWORD',
    });
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully.',
  });
});

// ==================== RESTAURANT ONBOARDING ====================
export const registerRestaurant = asyncHandler(async (req, res) => {
  const { name, phone, email, address, location, cuisine, description } = req.body;

  // Check if user already has a restaurant
  const existingRestaurant = await Restaurant.findOne({ ownerId: req.user._id });
  if (existingRestaurant) {
    return res.status(409).json({
      success: false,
      message: 'You already have a restaurant registered.',
      error: 'RESTAURANT_EXISTS',
    });
  }

  // Update user role
  await User.findByIdAndUpdate(req.user._id, { role: 'restaurant', status: 'pending' });

  // Create restaurant
  const restaurant = await Restaurant.create({
    ownerId: req.user._id,
    name,
    phone,
    email,
    address,
    location,
    cuisine,
    description,
    status: 'pending',
  });

  await AuditLog.create({
    userId: req.user._id,
    action: 'RESTAURANT_REGISTERED',
    resource: 'Restaurant',
    resourceId: restaurant._id,
  });

  res.status(201).json({
    success: true,
    message: 'Restaurant registered. Awaiting admin approval.',
    data: { restaurant },
  });
});

// ==================== RIDER ONBOARDING ====================
export const registerRider = asyncHandler(async (req, res) => {
  const { vehicleType, vehicleNumber, licenseNumber } = req.body;

  // Check if user already has rider profile
  const existingProfile = await RiderProfile.findOne({ userId: req.user._id });
  if (existingProfile) {
    return res.status(409).json({
      success: false,
      message: 'You already have a rider profile.',
      error: 'RIDER_EXISTS',
    });
  }

  // Update user role
  await User.findByIdAndUpdate(req.user._id, { role: 'rider', status: 'pending' });

  // Create rider profile
  const riderProfile = await RiderProfile.create({
    userId: req.user._id,
    vehicleType,
    vehicleNumber,
    licenseNumber,
    verificationStatus: 'pending',
  });

  await AuditLog.create({
    userId: req.user._id,
    action: 'RIDER_REGISTERED',
    resource: 'RiderProfile',
    resourceId: riderProfile._id,
  });

  res.status(201).json({
    success: true,
    message: 'Rider profile created. Awaiting admin verification.',
    data: { riderProfile },
  });
});
