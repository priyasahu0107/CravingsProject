import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { User } from '../models/index.js';

// ==================== AUTH MIDDLEWARE ====================
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        error: 'UNAUTHORIZED',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret);
    
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.',
        error: 'USER_NOT_FOUND',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated.',
        error: 'ACCOUNT_DEACTIVATED',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.',
        error: 'TOKEN_EXPIRED',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
        error: 'INVALID_TOKEN',
      });
    }
    next(error);
  }
};

// ==================== ROLE MIDDLEWARE ====================
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        error: 'UNAUTHORIZED',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        error: 'FORBIDDEN',
      });
    }

    next();
  };
};

// ==================== ERROR HANDLER ====================
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: messages,
      error: 'VALIDATION_ERROR',
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists.`,
      error: 'DUPLICATE_ENTRY',
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format.',
      error: 'INVALID_ID',
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = config.nodeEnv === 'production' 
    ? 'Internal server error.' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    error: config.nodeEnv === 'development' ? err.stack : 'INTERNAL_ERROR',
  });
};

// ==================== NOT FOUND HANDLER ====================
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
    error: 'NOT_FOUND',
  });
};

// ==================== ASYNC HANDLER ====================
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
