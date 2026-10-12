import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bike, MapPin, Phone, MessageCircle, CheckCircle, XCircle, Wallet, Star, TrendingUp, Clock, Navigation, Package, ShieldCheck } from 'lucide-react';
import { riderRequests, riderStats } from '../data/dashboardData';

export default function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'deliveries' | 'earnings'>('dashboard');
  const [acceptedDelivery, setAcceptedDelivery] = useState<string | null>(null);

  const handleAccept = (id: string) => {
    setAcceptedDelivery(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Rider Dashboard</h1>
          <p className="text-gray-500">Welcome back, Rahul K.</p>
        </div>
        <button
          onClick={() => setIsOnline(!isOnline)}
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

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(['dashboard', 'deliveries', 'earnings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors relative ${
              activeTab === tab ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package size={18} className="text-blue-600" />
                </div>
                <span className="text-xs text-gray-500">Deliveries</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{riderStats.todayDeliveries}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wallet size={18} className="text-green-600" />
                </div>
                <span className="text-xs text-gray-500">Earnings</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">₹{riderStats.todayEarnings}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star size={18} className="text-yellow-600" />
                </div>
                <span className="text-xs text-gray-500">Rating</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{riderStats.rating}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp size={18} className="text-purple-600" />
                </div>
                <span className="text-xs text-gray-500">Acceptance</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{riderStats.acceptanceRate}%</p>
            </div>
          </div>

          {/* Active Delivery */}
          {riderStats.activeDelivery && (
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bike size={20} />
                  <span className="font-bold">Active Delivery</span>
                </div>
                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  #{riderStats.activeDelivery.orderNumber}
                </span>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-white/20 rounded-full mt-0.5">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-orange-100">Pickup</p>
                    <p className="font-medium">{riderStats.activeDelivery.restaurantName}</p>
                  </div>
                </div>
                <div className="ml-2 border-l-2 border-dashed border-white/40 h-4" />
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-white/20 rounded-full mt-0.5">
                    <Navigation size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-orange-100">Drop-off</p>
                    <p className="font-medium">{riderStats.activeDelivery.customerName}</p>
                    <p className="text-sm text-orange-100">{riderStats.activeDelivery.customerAddress}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div>
                  <p className="text-xs text-orange-100">Delivery OTP</p>
                  <p className="text-2xl font-bold tracking-wider">{riderStats.activeDelivery.otp}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                    <Phone size={18} />
                  </button>
                  <button className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                    <MessageCircle size={18} />
                  </button>
                  <button className="px-4 py-2.5 bg-white text-orange-600 rounded-full font-medium text-sm hover:bg-orange-50 transition-colors flex items-center gap-1">
                    <ShieldCheck size={16} /> Verify
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Requests */}
          {!isOnline ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-5xl mb-4">💤</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">You're Offline</h3>
              <p className="text-gray-500">Go online to receive delivery requests</p>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-orange-500" />
                New Delivery Requests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {riderRequests.map(request => (
                  <div key={request.id} className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-orange-400">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-gray-800">{request.restaurantName}</p>
                        <p className="text-sm text-gray-500">{request.restaurantAddress}</p>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
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
                          <Navigation size={12} /> {request.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package size={12} /> {request.items} items
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {request.estimatedTime}
                        </span>
                      </div>
                    </div>

                    {acceptedDelivery === request.id ? (
                      <div className="flex items-center justify-center gap-2 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                        <CheckCircle size={16} /> Accepted! Navigate to restaurant
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(request.id)}
                          className="flex-1 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={14} /> Accept
                        </button>
                        <button className="flex-1 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                          <XCircle size={14} /> Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Deliveries Tab */}
      {activeTab === 'deliveries' && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Delivery History</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { order: 'CRV20260114012', restaurant: 'Pizza Palace', amount: 55, time: 'Today, 1:30 PM', status: 'delivered' },
              { order: 'CRV20260114011', restaurant: 'Burger Barn', amount: 45, time: 'Today, 12:15 PM', status: 'delivered' },
              { order: 'CRV20260114010', restaurant: 'The Spice Route', amount: 65, time: 'Today, 11:00 AM', status: 'delivered' },
              { order: 'CRV20260114009', restaurant: 'Dragon Wok', amount: 40, time: 'Yesterday, 8:45 PM', status: 'delivered' },
              { order: 'CRV20260114008', restaurant: 'Green Bowl', amount: 55, time: 'Yesterday, 7:30 PM', status: 'delivered' },
            ].map((delivery, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">#{delivery.order}</p>
                    <p className="text-xs text-gray-500">{delivery.restaurant} • {delivery.time}</p>
                  </div>
                </div>
                <span className="font-bold text-green-600">+₹{delivery.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Earnings Tab */}
      {activeTab === 'earnings' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white">
              <p className="text-sm text-green-100 mb-1">Today's Earnings</p>
              <p className="text-3xl font-bold">₹{riderStats.todayEarnings}</p>
              <p className="text-xs text-green-100 mt-2">{riderStats.todayDeliveries} deliveries</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white">
              <p className="text-sm text-blue-100 mb-1">This Week</p>
              <p className="text-3xl font-bold">₹{riderStats.weeklyEarnings.reduce((a, b) => a + b.earnings, 0).toLocaleString()}</p>
              <p className="text-xs text-blue-100 mt-2">62 deliveries</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-5 text-white">
              <p className="text-sm text-purple-100 mb-1">Incentives Earned</p>
              <p className="text-3xl font-bold">₹500</p>
              <p className="text-xs text-purple-100 mt-2">Complete 10 more for bonus</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">Weekly Earnings</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={riderStats.weeklyEarnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
