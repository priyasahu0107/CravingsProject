import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, TrendingUp, Heart, MapPin, User } from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

interface Order {
  id: string;
  orderNumber: string;
  restaurantName: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getOrders();
      if (response.success && response.data) {
        setOrders((response.data as any).orders || []);
      }
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const recentOrders = orders.slice(0, 3);
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back, {user?.name || 'User'}!</h1>
        <p className="text-gray-500">Here's what's happening with your orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingBag size={20} className="text-orange-600" />
            </div>
            <span className="text-sm text-gray-500">Total Orders</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock size={20} className="text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Active Orders</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{activeOrders.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Total Spent</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">₹{totalSpent.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">🍽️</div>
          <p className="font-medium text-gray-800">Order Food</p>
          <p className="text-xs text-gray-500">Browse restaurants</p>
        </Link>
        <Link to="/orders" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">📦</div>
          <p className="font-medium text-gray-800">My Orders</p>
          <p className="text-xs text-gray-500">View order history</p>
        </Link>
        <Link to="/favourites" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">❤️</div>
          <p className="font-medium text-gray-800">Favourites</p>
          <p className="text-xs text-gray-500">Saved items</p>
        </Link>
        <Link to="/addresses" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-center">
          <div className="text-3xl mb-2">📍</div>
          <p className="font-medium text-gray-800">Addresses</p>
          <p className="text-xs text-gray-500">Manage addresses</p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
          <Link to="/orders" className="text-sm text-orange-500 hover:underline">View All</Link>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-gray-500 mb-3">{error}</p>
            <button onClick={fetchOrders} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Retry
            </button>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 mb-3">No orders yet. Start ordering!</p>
            <Link to="/" className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-800">#{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.restaurantName || 'Restaurant'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">₹{order.total}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
