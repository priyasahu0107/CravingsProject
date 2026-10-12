import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Store, Bike, ShoppingBag, DollarSign, TrendingUp, AlertCircle, CheckCircle2, Clock, BarChart3, Activity } from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminDashboard();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
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
          <button onClick={fetchDashboard} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">Platform Overview • {user?.name || 'Admin'}</p>
        </div>
        <div className="flex items-center gap-3">
          {stats?.pendingApprovals?.restaurants > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm">
              <AlertCircle size={14} />
              <span>{stats.pendingApprovals.restaurants} restaurants pending</span>
            </div>
          )}
          {stats?.pendingApprovals?.riders > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">
              <AlertCircle size={14} />
              <span>{stats.pendingApprovals.riders} riders pending</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users size={18} className="text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Customers</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{(stats?.totalCustomers || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Store size={18} className="text-orange-600" />
            </div>
            <span className="text-xs text-gray-500">Restaurants</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{stats?.totalRestaurants || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bike size={18} className="text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">Riders</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{stats?.totalRiders || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingBag size={18} className="text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Today's Orders</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{(stats?.todayOrders || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign size={18} className="text-emerald-600" />
            </div>
            <span className="text-xs text-gray-500">Revenue Today</span>
          </div>
          <p className="text-xl font-bold text-gray-800">₹{((stats?.todayRevenue || 0) / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/admin/users" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <Users size={24} className="text-blue-500 mb-2" />
          <p className="font-medium text-gray-800">Manage Users</p>
          <p className="text-xs text-gray-500">View and manage all users</p>
        </Link>
        <Link to="/admin/restaurants" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <Store size={24} className="text-orange-500 mb-2" />
          <p className="font-medium text-gray-800">Restaurants</p>
          <p className="text-xs text-gray-500">Approve and manage restaurants</p>
        </Link>
        <Link to="/admin/riders" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <Bike size={24} className="text-purple-500 mb-2" />
          <p className="font-medium text-gray-800">Riders</p>
          <p className="text-xs text-gray-500">Verify and manage riders</p>
        </Link>
        <Link to="/admin/orders" className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <ShoppingBag size={24} className="text-green-500 mb-2" />
          <p className="font-medium text-gray-800">Orders</p>
          <p className="text-xs text-gray-500">Monitor all orders</p>
        </Link>
      </div>

      {/* Pending Approvals */}
      {(stats?.pendingApprovals?.restaurants > 0 || stats?.pendingApprovals?.riders > 0) && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Pending Approvals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.pendingApprovals.restaurants > 0 && (
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Restaurant Applications</p>
                  <p className="text-sm text-gray-500">{stats.pendingApprovals.restaurants} awaiting review</p>
                </div>
                <Link to="/admin/restaurants?status=pending" className="px-3 py-1.5 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600">
                  Review
                </Link>
              </div>
            )}
            {stats.pendingApprovals.riders > 0 && (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Rider Applications</p>
                  <p className="text-sm text-gray-500">{stats.pendingApprovals.riders} awaiting verification</p>
                </div>
                <Link to="/admin/riders?verificationStatus=pending" className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
                  Review
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
