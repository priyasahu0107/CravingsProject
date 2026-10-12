import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { User } from '../models/index.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: config.clientUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return next(new Error('Invalid or inactive user'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.user.name} (${socket.user.role})`);

    // Join user-specific room
    socket.join(`user:${socket.user._id}`);

    // Role-specific rooms
    if (socket.user.role === 'restaurant') {
      // Restaurant joins their restaurant room
      socket.join(`restaurant:${socket.user._id}`);
    }

    if (socket.user.role === 'rider') {
      socket.join(`rider:${socket.user._id}`);
    }

    // Join order rooms when requested
    socket.on('joinOrder', (orderId) => {
      socket.join(`order:${orderId}`);
      console.log(`${socket.user.name} joined order:${orderId}`);
    });

    socket.on('leaveOrder', (orderId) => {
      socket.leave(`order:${orderId}`);
    });

    // Handle rider location updates
    socket.on('riderLocationUpdate', (data) => {
      if (socket.user.role === 'rider') {
        // Broadcast to relevant parties
        socket.broadcast.to(`order:${data.orderId}`).emit('riderLocationUpdated', {
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: new Date(),
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.user.name} (${reason})`);
    });
  });

  return io;
};
