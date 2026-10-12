# 🍔 CRAVINGS - Full-Stack Setup Guide

## 🎯 Project Overview

Cravings is now a **full-stack MERN application** with real MongoDB persistence, JWT authentication, Socket.IO real-time updates, and complete order lifecycle management.

---

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** v18+ installed
- **MongoDB** running locally OR MongoDB Atlas account
- **npm** or **yarn** package manager

---

## 🚀 Quick Start

### 1. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend (if not already done)
```bash
# From project root
npm install
```

### 2. Configure Environment

#### Backend (.env)
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cravings
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cravings
```

#### Frontend (optional)
Create `vite.config.js` proxy or set environment variable:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database (First Time Only)

```bash
cd server
npm run seed
```

This creates:
- ✅ Admin user: `admin@cravings.app` / `admin123`
- ✅ Customer: `demo@cravings.app` / `demo123`
- ✅ Restaurant owner: `restaurant@cravings.app` / `restaurant123`
- ✅ Rider: `rider@cravings.app` / `rider123`
- ✅ Sample restaurant with menu items

### 4. Start Backend Server

```bash
cd server
npm run dev
```

Server runs on: `http://localhost:5000`

### 5. Start Frontend

```bash
# From project root
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔐 Authentication System

### Unified Login/Register
- Single authentication system for all roles
- JWT-based session management
- Role-based access control (RBAC)
- Protected routes on frontend and backend

### Login Credentials (After Seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cravings.app | admin123 |
| Customer | demo@cravings.app | demo123 |
| Restaurant | restaurant@cravings.app | restaurant123 |
| Rider | rider@cravings.app | rider123 |

### Registration Flow
- **Customers**: Can register publicly
- **Restaurants**: Register → Pending approval → Admin approves
- **Riders**: Register → Pending verification → Admin approves
- **Admins**: Created only through seed script or direct database access

---

## 🗄️ Database Schema

### Collections

#### Users
```javascript
{
  name, email, phone, password (hashed),
  role: 'customer' | 'restaurant' | 'rider' | 'admin',
  status: 'pending' | 'approved' | 'rejected' | 'suspended',
  restaurantId (for restaurant owners),
  riderProfile (for riders),
  isActive, lastLogin
}
```

#### Restaurants
```javascript
{
  ownerId, name, logo, coverImage,
  description, phone, email, address,
  location (GeoJSON), cuisine[],
  openingHours[], deliveryRadius,
  minimumOrder, deliveryFee,
  rating, totalReviews,
  status, isOpen
}
```

#### FoodItems
```javascript
{
  restaurantId, name, description,
  image, price, category,
  foodType: 'veg' | 'non_veg' | 'egg',
  preparationTime, rating, totalReviews,
  isAvailable, isFeatured
}
```

#### Orders
```javascript
{
  orderNumber, customerId, restaurantId, riderId,
  items[], deliveryAddress,
  pricing: { subtotal, deliveryFee, platformFee, tax, discount, total },
  payment: { method, status, transactionId },
  status: 'payment_pending' | 'order_placed' | 'restaurant_accepted' | 
          'preparing' | 'ready_for_pickup' | 'rider_assigned' | 
          'picked_up' | 'out_for_delivery' | 'delivered' | 
          'cancelled' | 'rejected',
  statusHistory[], deliveryOtp, estimatedDeliveryTime
}
```

---

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login
GET    /api/auth/me                - Get current user (protected)
PUT    /api/auth/profile           - Update profile (protected)
```

### Restaurants (Public)
```
GET    /api/restaurants            - Get all approved restaurants
GET    /api/restaurants/:id        - Get single restaurant
GET    /api/restaurants/:id/menu   - Get restaurant menu
```

### Restaurant Dashboard (Protected - Restaurant Role)
```
GET    /api/restaurants/my/restaurant              - Get my restaurant
PUT    /api/restaurants/my/restaurant              - Update my restaurant
POST   /api/restaurants/my/menu                    - Add food item
PUT    /api/restaurants/my/menu/:itemId            - Update food item
DELETE /api/restaurants/my/menu/:itemId            - Delete food item
GET    /api/restaurants/my/orders                  - Get my orders
PUT    /api/restaurants/my/orders/:orderId/status  - Update order status
```

### Orders (Protected - Customer Role)
```
POST   /api/orders              - Create order
GET    /api/orders              - Get my orders
GET    /api/orders/:id          - Get order details
POST   /api/orders/:id/cancel   - Cancel order
```

### Admin (Protected - Admin Role)
```
GET    /api/admin/dashboard              - Get dashboard stats
GET    /api/admin/restaurants            - Get all restaurants
PUT    /api/admin/restaurants/:id/approve - Approve restaurant
PUT    /api/admin/restaurants/:id/reject  - Reject restaurant
GET    /api/admin/riders                 - Get all riders
PUT    /api/admin/riders/:id/approve     - Approve rider
GET    /api/admin/orders                 - Get all orders (paginated)
```

---

## 🔌 Real-Time Features (Socket.IO)

### Events

#### Client → Server
```javascript
socket.emit('joinUser', userId);
socket.emit('joinRestaurant', restaurantId);
socket.emit('joinCustomer', customerId);
```

#### Server → Client
```javascript
// New order notification to restaurant
io.to(`restaurant_${restaurantId}`).emit('newOrder', { orderId, orderNumber });

// Order status update to customer
io.to(`customer_${customerId}`).emit('orderStatusUpdated', { orderId, status });

// Order cancellation
io.to(`restaurant_${restaurantId}`).emit('orderCancelled', { orderId });
```

---

## 🔄 Order Lifecycle

```
Customer places order
    ↓
Payment pending (if online) / Order placed (if COD)
    ↓
Restaurant receives order (Socket.IO)
    ↓
Restaurant accepts → restaurant_accepted
    ↓
Restaurant prepares → preparing
    ↓
Ready for pickup → ready_for_pickup
    ↓
Rider assigned → rider_assigned
    ↓
Rider picks up → picked_up
    ↓
Out for delivery → out_for_delivery
    ↓
Delivered (OTP verified) → delivered
```

### Cancellation Paths
- Customer cancels (before restaurant accepts)
- Restaurant rejects (with reason)
- Payment failure (if online payment)

---

## 🛡️ Security Features

### Backend
- ✅ JWT authentication with expiration
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Role-based access control middleware
- ✅ Resource ownership validation
- ✅ Input validation and sanitization
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Protected sensitive fields (password not returned)

### Frontend
- ✅ Token stored in localStorage
- ✅ Protected routes based on role
- ✅ Automatic logout on token expiration
- ✅ Role-based UI rendering

---

## 🧪 Testing the Application

### 1. Customer Flow
1. Login as `demo@cravings.app`
2. Browse restaurants
3. View restaurant menu
4. Add items to cart
5. Place order (COD)
6. View order in history

### 2. Restaurant Flow
1. Login as `restaurant@cravings.app`
2. View incoming orders
3. Accept order
4. Mark as preparing
5. Mark as ready for pickup

### 3. Admin Flow
1. Login as `admin@cravings.app`
2. View dashboard stats
3. Approve/reject restaurants
4. View all orders
5. Manage riders

---

## 📦 Production Deployment

### Backend (Render/Railway/AWS)
1. Set environment variables
2. Use MongoDB Atlas connection string
3. Change JWT_SECRET to strong random value
4. Set NODE_ENV=production
5. Update CLIENT_URL to production frontend URL

### Frontend (Vercel/Netlify)
1. Set VITE_API_URL to production backend URL
2. Build: `npm run build`
3. Deploy dist folder

### MongoDB Atlas
1. Create cluster
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for development)
4. Get connection string

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# Or use MongoDB Atlas
# Update MONGODB_URI in .env
```

### CORS Errors
```javascript
// Ensure CLIENT_URL in server/.env matches frontend URL
CLIENT_URL=http://localhost:5173
```

### Port Already in Use
```bash
# Change PORT in server/.env
PORT=5001
```

### Authentication Issues
```bash
# Clear localStorage in browser
# Re-login
```

---

## 📚 API Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@cravings.app","password":"demo123"}'
```

### Get Restaurants (with token)
```bash
curl http://localhost:5000/api/restaurants \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [{"foodItemId":"ITEM_ID","quantity":2}],
    "deliveryAddress": {"fullAddress":"123 MG Road, Bangalore"},
    "paymentMethod":"cod"
  }'
```

---

## 🎯 Next Steps

### Implemented ✅
- Unified authentication system
- Real MongoDB persistence
- JWT-based session management
- Role-based access control
- Restaurant management
- Order lifecycle
- Admin dashboard
- Socket.IO integration

### Future Enhancements ⏳
- Rider dashboard with real-time location
- Payment gateway integration (Razorpay)
- Image uploads (Cloudinary)
- Reviews and ratings
- Push notifications
- Advanced analytics
- Mobile app

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review API documentation
3. Check server logs: `npm run dev`
4. Check browser console for frontend errors

---

**Version:** 2.0.0  
**Last Updated:** January 2026  
**Status:** Production-Ready (Backend + Frontend Integration Complete)
