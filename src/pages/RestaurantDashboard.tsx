import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Check, X, Clock, ChefHat, Package, TrendingUp, DollarSign, Star, Timer } from 'lucide-react';
import { restaurantOrders, restaurantAnalytics } from '../data/dashboardData';
import type { RestaurantOrder } from '../data/dashboardData';

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState(restaurantOrders);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'analytics' | 'reviews' | 'settings'>('orders');

  const updateOrderStatus = (id: string, status: RestaurantOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const newOrders = orders.filter(o => o.status === 'new');
  const activeOrders = orders.filter(o => ['accepted', 'preparing', 'ready'].includes(o.status));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-700 border-red-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'preparing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'ready': return 'bg-green-100 text-green-700 border-green-200';
      case 'picked_up': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Restaurant Dashboard</h1>
          <p className="text-gray-500">The Spice Route • Open Now</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Accepting Orders
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        {(['orders', 'menu', 'analytics', 'reviews', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors relative whitespace-nowrap ${
              activeTab === tab ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {tab === 'orders' && newOrders.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {newOrders.length}
              </span>
            )}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
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
              <p className="text-2xl font-bold text-gray-800">₹{restaurantAnalytics.todayRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package size={18} className="text-blue-600" />
                </div>
                <span className="text-xs text-gray-500">Total Orders</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{restaurantAnalytics.todayOrders}</p>
            </div>
          </div>

          {/* Order Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-orange-400">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.customerName} • {order.time}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1.5 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.quantity}x {item.name}</span>
                      <span className="text-gray-800 font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-bold text-gray-800">₹{order.total}</p>
                    <p className="text-xs text-gray-400">{order.paymentMethod}</p>
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'new' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'accepted')}
                          className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                        >
                          <Check size={14} /> Accept
                        </button>
                        <button className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1">
                          <X size={14} /> Reject
                        </button>
                      </>
                    )}
                    {order.status === 'accepted' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="px-3 py-1.5 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-1"
                      >
                        <ChefHat size={14} /> Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                      >
                        <Package size={14} /> Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg">
                        Waiting for rider
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Tab */}
      {activeTab === 'menu' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-800">Menu Management</h2>
            <button className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
              + Add Item
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Butter Chicken', price: 349, category: 'Main Course', available: true, rating: 4.7 },
              { name: 'Chicken Biryani', price: 329, category: 'Biryani', available: true, rating: 4.8 },
              { name: 'Paneer Tikka Masala', price: 299, category: 'Main Course', available: true, rating: 4.5 },
              { name: 'Dal Makhani', price: 249, category: 'Main Course', available: false, rating: 4.4 },
              { name: 'Garlic Naan', price: 59, category: 'Breads', available: true, rating: 4.3 },
              { name: 'Gulab Jamun', price: 129, category: 'Desserts', available: true, rating: 4.6 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Star size={12} className="text-yellow-400" fill="currentColor" />
                    <span className="text-gray-600">{item.rating}</span>
                  </div>
                  <span className="font-bold text-gray-800">₹{item.price}</span>
                  <button className="text-sm text-orange-600 hover:underline">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-orange-500" />
                <span className="text-xs text-gray-500">Avg Prep Time</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{restaurantAnalytics.avgPrepTime}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Star size={18} className="text-yellow-500" />
                <span className="text-xs text-gray-500">Avg Rating</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{restaurantAnalytics.avgRating}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Timer size={18} className="text-blue-500" />
                <span className="text-xs text-gray-500">Orders Today</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{restaurantAnalytics.todayOrders}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-green-500" />
                <span className="text-xs text-gray-500">Revenue Today</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">₹{(restaurantAnalytics.todayRevenue / 1000).toFixed(1)}K</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4">Weekly Orders</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={restaurantAnalytics.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4">Weekly Revenue</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={restaurantAnalytics.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5 lg:col-span-2">
              <h3 className="font-bold text-gray-800 mb-4">Top Selling Items</h3>
              <div className="space-y-3">
                {restaurantAnalytics.topItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{item.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{item.orders} orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab - Restaurant Only */}
      {activeTab === 'reviews' && (
        <div>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white mb-6">
            <h3 className="text-xl font-bold mb-2">⭐ Customer Reviews</h3>
            <p className="text-blue-100">What customers say about your restaurant</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 shadow-sm text-center">
              <p className="text-4xl font-bold text-gray-800 mb-1">4.5</p>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={16} className={star <= 4 ? 'text-yellow-400' : 'text-gray-300'} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-gray-500">2,340 reviews</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Food Quality</p>
              <p className="text-2xl font-bold text-gray-800">4.6/5</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Delivery Speed</p>
              <p className="text-2xl font-bold text-gray-800">4.3/5</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Recent Reviews</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { name: 'Priya S.', rating: 5, comment: 'Amazing biryani! Best I have had in Bangalore. Will order again.', time: '2 hours ago' },
                { name: 'Rahul V.', rating: 4, comment: 'Good food but delivery took a bit long. Taste was excellent though.', time: '5 hours ago' },
                { name: 'Anita D.', rating: 5, comment: 'Butter chicken is to die for! Perfectly cooked and flavorful.', time: '1 day ago' },
                { name: 'Vikram S.', rating: 4, comment: 'Great taste and portion size. Naan could be fresher.', time: '2 days ago' },
              ].map((review, idx) => (
                <div key={idx} className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                        {review.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{review.name}</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} size={12} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{review.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-13">{review.comment}</p>
                  <button className="mt-2 text-sm text-orange-500 hover:underline ml-13">Reply</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab - Restaurant Only */}
      {activeTab === 'settings' && (
        <div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white mb-6">
            <h3 className="text-xl font-bold mb-2">🏪 Restaurant Settings</h3>
            <p className="text-green-100">Manage your restaurant profile and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Restaurant Name</label>
                  <input type="text" defaultValue="The Spice Route" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Description</label>
                  <textarea defaultValue="Authentic North Indian flavors with a modern twist..." className="w-full px-3 py-2 border border-gray-200 rounded-lg" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Phone</label>
                    <input type="text" defaultValue="+91 98765 43210" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Email</label>
                    <input type="email" defaultValue="spiceroute@example.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4">Operating Hours</h3>
              <div className="space-y-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{day}</span>
                    <div className="flex items-center gap-2">
                      <input type="time" defaultValue="10:00" className="px-2 py-1 border border-gray-200 rounded text-sm" />
                      <span className="text-gray-400">to</span>
                      <input type="time" defaultValue="22:00" className="px-2 py-1 border border-gray-200 rounded text-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Settings */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4">Delivery Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Delivery Radius (km)</label>
                  <input type="number" defaultValue="5" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Minimum Order (₹)</label>
                  <input type="number" defaultValue="149" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Delivery Fee (₹)</label>
                  <input type="number" defaultValue="29" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Prep Time (min)</label>
                  <input type="number" defaultValue="20" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
              </div>
            </div>

            <button className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
