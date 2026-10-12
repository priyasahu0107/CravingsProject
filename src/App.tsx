import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import CustomerLayout from './components/layouts/CustomerLayout';
import RestaurantLayout from './components/layouts/RestaurantLayout';
import RiderLayout from './components/layouts/RiderLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Public Pages (No Auth Required)
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderHistory from './pages/customer/OrderHistory';
import OrderTracking from './pages/customer/OrderTracking';
import Favourites from './pages/customer/Favourites';
import Addresses from './pages/customer/Addresses';
import Profile from './pages/customer/Profile';

// Restaurant Pages
import RestaurantDashboard from './pages/restaurant/Dashboard';
import RestaurantOrders from './pages/restaurant/Orders';
import RestaurantMenu from './pages/restaurant/Menu';
import RestaurantAnalytics from './pages/restaurant/Analytics';
import RestaurantSettings from './pages/restaurant/Settings';

// Rider Pages
import RiderDashboard from './pages/rider/Dashboard';
import RiderDeliveries from './pages/rider/Deliveries';
import RiderEarnings from './pages/rider/Earnings';
import RiderProfile from './pages/rider/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminRestaurants from './pages/admin/Restaurants';
import AdminRiders from './pages/admin/Riders';
import AdminOrders from './pages/admin/Orders';
import AdminAnalytics from './pages/admin/Analytics';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user && user.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - No Auth Required */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Customer Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerLayout />
          </ProtectedRoute>
        }>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:id/tracking" element={<OrderTracking />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Restaurant Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['restaurant']}>
            <RestaurantLayout />
          </ProtectedRoute>
        }>
          <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurant/orders" element={<RestaurantOrders />} />
          <Route path="/restaurant/menu" element={<RestaurantMenu />} />
          <Route path="/restaurant/analytics" element={<RestaurantAnalytics />} />
          <Route path="/restaurant/settings" element={<RestaurantSettings />} />
        </Route>

        {/* Rider Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['rider']}>
            <RiderLayout />
          </ProtectedRoute>
        }>
          <Route path="/rider/dashboard" element={<RiderDashboard />} />
          <Route path="/rider/deliveries" element={<RiderDeliveries />} />
          <Route path="/rider/earnings" element={<RiderEarnings />} />
          <Route path="/rider/profile" element={<RiderProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/restaurants" element={<AdminRestaurants />} />
          <Route path="/admin/riders" element={<AdminRiders />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Route>

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="text-6xl mb-4">🚫</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
              <button 
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
