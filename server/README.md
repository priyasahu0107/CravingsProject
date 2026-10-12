# 🍔 CRAVINGS Backend API Server

## Overview
Complete MERN backend for Cravings food delivery platform with:
- JWT Authentication (access + refresh tokens)
- Role-based access control (Customer, Restaurant, Rider, Admin)
- MongoDB Atlas with Mongoose ODM
- Socket.IO for real-time updates
- Rate limiting, security headers, input validation
- Complete order lifecycle management

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Setup

```bash
# 1. Navigate to server directory
cd server

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# 4. Seed the database (development)
npm run seed

# 5. Start the server
npm run dev
```

The API will be available at `http://localhost:5000`

## Demo Credentials (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cravings.app | admin123 |
| Customer | demo@cravings.app | demo123 |
| Restaurant | restaurant@cravings.app | rest123 |
| Rider | rider@cravings.app | rider123 |

## API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new customer
POST   /api/auth/login             - Login
POST   /api/auth/logout            - Logout
POST   /api/auth/refresh           - Refresh access token
GET    /api/auth/me                - Get current user
PUT    /api/auth/profile           - Update profile
PUT    /api/auth/change-password   - Change password
POST   /api/auth/register-restaurant - Restaurant onboarding
POST   /api/auth/register-rider    - Rider onboarding
```

### Customer
```
GET    /api/restaurants            - List restaurants
GET    /api/restaurants/:id        - Restaurant details
GET    /api/restaurants/:id/menu   - Restaurant menu
GET    /api/search?q=              - Search
GET    /api/addresses              - Get addresses
POST   /api/addresses              - Add address
PUT    /api/addresses/:id          - Update address
DELETE /api/addresses/:id          - Delete address
GET    /api/favourites             - Get favourites
POST   /api/favourites             - Add favourite
DELETE /api/favourites/:id         - Remove favourite
POST   /api/coupons/validate       - Validate coupon
POST   /api/checkout/calculate     - Calculate checkout totals
POST   /api/orders                 - Place order
GET    /api/orders                 - Order history
GET    /api/orders/:id             - Order details
POST   /api/orders/:id/cancel      - Cancel order
GET    /api/notifications          - Get notifications
```

### Restaurant
```
GET    /api/restaurant/dashboard   - Dashboard stats
GET    /api/restaurant/orders      - Get orders
PUT    /api/restaurant/orders/:id/accept   - Accept order
PUT    /api/restaurant/orders/:id/reject   - Reject order
PUT    /api/restaurant/orders/:id/status/:status - Update status
GET    /api/restaurant/menu        - Get menu
POST   /api/restaurant/menu        - Add food item
PUT    /api/restaurant/menu/:id    - Update item
DELETE /api/restaurant/menu/:id    - Delete item
PATCH  /api/restaurant/menu/:id/availability - Toggle availability
GET    /api/restaurant/analytics   - Sales analytics
GET    /api/restaurant/reviews     - Customer reviews
PUT    /api/restaurant/profile     - Update profile
PATCH  /api/restaurant/toggle-open - Toggle open/close
```

### Rider
```
GET    /api/rider/dashboard        - Dashboard stats
PUT    /api/rider/status           - Toggle online/offline
GET    /api/rider/requests         - Available deliveries
POST   /api/rider/requests/:id/accept  - Accept delivery
POST   /api/rider/requests/:id/reject  - Reject delivery
PUT    /api/rider/deliveries/:id/status/:status - Update delivery status
POST   /api/rider/deliveries/:id/verify-otp - Verify OTP
POST   /api/rider/location         - Update location
GET    /api/rider/history          - Delivery history
GET    /api/rider/earnings         - Earnings summary
```

### Admin
```
GET    /api/admin/dashboard        - Platform overview
GET    /api/admin/analytics        - Analytics data
GET    /api/admin/users            - List users
PUT    /api/admin/users/:id/status - Update user status
GET    /api/admin/restaurants      - List restaurants
PUT    /api/admin/restaurants/:id/approve  - Approve restaurant
PUT    /api/admin/restaurants/:id/reject   - Reject restaurant
PUT    /api/admin/restaurants/:id/suspend  - Suspend restaurant
GET    /api/admin/riders           - List riders
PUT    /api/admin/riders/:id/approve - Approve rider
PUT    /api/admin/riders/:id/reject  - Reject rider
GET    /api/admin/orders           - All orders
GET/POST/PUT/DELETE /api/admin/coupons - Manage coupons
GET    /api/admin/audit-logs       - Audit logs
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| PORT | No | Server port (default: 5000) |
| MONGO_URI | Yes | MongoDB connection string |
| JWT_SECRET | Yes | JWT signing secret |
| JWT_REFRESH_SECRET | Yes | Refresh token secret |
| CLIENT_URL | No | Frontend URL for CORS |
| CLOUDINARY_* | No | Image upload (optional) |
| RAZORPAY_* | No | Payment gateway (optional) |
| SMTP_* | No | Email sending (optional) |

## Security Features
- ✅ JWT authentication with access + refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Rate limiting (100 req/15min general, 20 req/15min auth)
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Input validation with express-validator
- ✅ MongoDB injection protection (Mongoose)
- ✅ Atomic operations for race condition prevention
- ✅ Audit logging for admin actions

## Database Models
- User, Restaurant, FoodCategory, FoodItem
- Order, Delivery, RiderProfile
- Address, Favourite, Coupon
- Notification, Review, AuditLog

## Socket.IO Events
- `newOrder` - Restaurant receives new order
- `orderStatusUpdated` - Customer receives status update
- `riderAssigned` - Customer/restaurant notified
- `riderLocationUpdated` - Customer tracks rider
- `joinOrder` / `leaveOrder` - Room management
