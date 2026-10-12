import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Clock, ChefHat, Package, TrendingUp, DollarSign, Star, Timer } from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

interface Order {
  _id: string;
  orderNumber: string;
  customerId: { name: string };
  items: Array<{ name: string; quantity: number; price: number }>;
  pricing: { total: number };
  orderStatus: string;
  createdAt: string;
  payment: { method: string };
}

export default function RestaurantDashboard() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, ordersRes] = await Promise.all([
        api.getRestaurantDashboard(),
        api.getRestaurantOrders(),
      ]);

      if (dashboardRes.success && dashboardRes.data) {
        setStats((dashboardRes.data as any).stats);
      }
      if (ordersRes.success && ordersRes.data) {
        setOrders((ordersRes.data as any).orders || []);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    const response = await api.acceptOrder(orderId);
    if (response.success) {
      fetchData();
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    const reason = prompt('Reason for rejection:');
    if (reason) {
      const response = await api.rejectOrder(orderId, reason);
      if (response.success) {
        fetchData();
      }
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    const response = await api.updateOrderStatus(orderId, status);
    if (response.success) {
      fetchData();
    }
  };

  const newOrders = orders.filter(o => o.orderStatus === 'order_placed');
  const activeOrders = orders.filter(o => ['restaurant_accepted', 'preparing', 'ready_for_pickup'].includes(o.orderStatus));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'order_placed': return 'bg-red-100 text-red-700 border-red-200';
      case 'restaurant_accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'preparing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'ready_for_pickup': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-gray-700 mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Restaurant Dashboard</h1>
          <p className="text-gray-500">Welcome, {user?.name || 'Restaurant Owner'}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Accepting Orders
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Clock size={18} className="text-red-600" />
            </div>
            <span className="text-xs text-gray-500">New Orders</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{newOrders.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ChefHat size={18} className="text-yellow-600" />
            </div>
            <span className="text-xs text-gray-500">Preparing</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{activeOrders.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign size={18} className="text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Today's Revenue</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">₹{(stats?.todayRevenue || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package size={18} className="text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Total Orders</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.todayOrders || 0}</p>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Incoming Orders</h2>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {orders.slice(0, 6).map(order => (
              <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.customerId?.name || 'Customer'}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-1.5 mb-4">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.quantity}x {item.name}</span>
                      <span className="text-gray-800 font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-bold text-gray-800">₹{order.pricing.total}</p>
                  </div>
                  <div className="flex gap-2">
                    {order.orderStatus === 'order_placed' && (
                      <>
                        <button
                          onClick={() => handleAcceptOrder(order._id)}
                          className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order._id)}
                          className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {order.orderStatus === 'restaurant_accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'preparing')}
                        className="px-3 py-1.5 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.orderStatus === 'preparing' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'ready_for_pickup')}
                        className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600"
                      >
                        Mark Ready
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
