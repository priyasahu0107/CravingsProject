import React, { useEffect, useState } from 'react';
import { Bike, MapPin, Phone, MessageCircle, CheckCircle, XCircle, Wallet, Star, TrendingUp, Clock, Navigation, Package, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

interface DeliveryRequest {
  orderId: string;
  orderNumber: string;
  restaurantName: string;
  restaurantAddress: string;
  customerAddress: string;
  items: number;
  total: number;
  earnings: number;
  estimatedTime: number;
}

export default function RiderDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, requestsRes] = await Promise.all([
        api.getRiderDashboard(),
        api.getDeliveryRequests(),
      ]);

      if (dashboardRes.success && dashboardRes.data) {
        const data = dashboardRes.data as any;
        setStats(data.stats);
        setIsOnline(data.profile?.isOnline || false);
      }
      if (requestsRes.success && requestsRes.data) {
        setRequests((requestsRes.data as any) || []);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    const response = await api.toggleRiderStatus();
    if (response.success) {
      setIsOnline(!isOnline);
    }
  };

  const handleAcceptDelivery = async (orderId: string) => {
    const response = await api.acceptDelivery(orderId);
    if (response.success) {
      fetchData();
    }
  };

  const handleRejectDelivery = async (orderId: string) => {
    const response = await api.rejectDelivery(orderId);
    if (response.success) {
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
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
          <button onClick={fetchData} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Rider Dashboard</h1>
          <p className="text-gray-500">Welcome, {user?.name || 'Rider'}</p>
        </div>
        <button
          onClick={handleToggleStatus}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
            isOnline
              ? 'bg-green-500 text-white shadow-lg shadow-green-200'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
          {isOnline ? 'Online' : 'Offline'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package size={18} className="text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Deliveries</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.todayDeliveries || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet size={18} className="text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Earnings</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">₹{stats?.todayEarnings || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star size={18} className="text-yellow-600" />
            </div>
            <span className="text-xs text-gray-500">Rating</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.rating || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp size={18} className="text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">Acceptance</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.acceptanceRate || 0}%</p>
        </div>
      </div>

      {/* Delivery Requests */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock size={18} className="text-purple-500" />
          Available Deliveries
        </h2>

        {!isOnline ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">💤</p>
            <p className="text-gray-500 mb-3">Go online to receive delivery requests</p>
            <button
              onClick={handleToggleStatus}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Go Online
            </button>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500">No delivery requests available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map(request => (
              <div key={request.orderId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800">{request.restaurantName}</p>
                    <p className="text-sm text-gray-500">{request.restaurantAddress}</p>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    ₹{request.earnings}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{request.customerAddress}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Navigation size={12} /> {request.estimatedTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Package size={12} /> {request.items} items
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptDelivery(request.orderId)}
                    className="flex-1 py-2 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 flex items-center justify-center gap-1"
                  >
                    <CheckCircle size={14} /> Accept
                  </button>
                  <button
                    onClick={() => handleRejectDelivery(request.orderId)}
                    className="flex-1 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 flex items-center justify-center gap-1"
                  >
                    <XCircle size={14} /> Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
