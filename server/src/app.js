import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { config } from './config/index.js';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/index.js';
import { initializeSocket } from './sockets/index.js';

const app = express();
const server = createServer(app);

// ==================== MIDDLEWARE ====================

// Security
app.use(helmet());
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ==================== ROUTES ====================
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== ERROR HANDLING ====================
app.use(notFoundHandler);
app.use(errorHandler);

// ==================== SOCKET.IO ====================
const io = initializeSocket(server);
app.set('io', io);

// ==================== START SERVER ====================
const startServer = async () => {
  try {
    await connectDB();
    
    server.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🍔 CRAVINGS API Server                        ║
║                                                  ║
║   Environment: ${config.nodeEnv.padEnd(33)}║
║   Port: ${String(config.port).padEnd(40)}║
║   Client: ${config.clientUrl.padEnd(38)}║
║                                                  ║
║   API: http://localhost:${config.port}/api          ║
║   Health: http://localhost:${config.port}/health     ║
║                                                  ║
╚══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

startServer();

export default app;
