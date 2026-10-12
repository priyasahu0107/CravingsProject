import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderHistory from './pages/OrderHistory';
import Favourites from './pages/Favourites';
import Addresses from './pages/Addresses';
import Profile from './pages/Profile';
import RestaurantDashboard from './pages/RestaurantDashboard';
import RiderDashboard from './pages/RiderDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/search" element={<Search />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/profile" element={<Profile />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Role Dashboards */}
          <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
          <Route path="/rider/dashboard" element={<RiderDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
