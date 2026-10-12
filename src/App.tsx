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
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import OrderHistory from './pages/OrderHistory';
import Favourites from './pages/Favourites';
import Addresses from './pages/Addresses';
import Profile from './pages/Profile';

// Role Dashboards
import RestaurantDashboard from './pages/RestaurantDashboard';
import RiderDashboard from './pages/RiderDashboard';
import AdminDashboard from './pages/AdminDashboard';

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
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/orders" element={<OrderHistory />} />
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
        </Route>

        {/* Rider Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['rider']}>
            <RiderLayout />
          </ProtectedRoute>
        }>
          <Route path="/rider/dashboard" element={<RiderDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
