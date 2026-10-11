import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Store, Bike, ShoppingBag, DollarSign, TrendingUp, AlertCircle, CheckCircle2, Clock, BarChart3, Activity } from 'lucide-react';
import { adminStats } from '../data/dashboardData';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users' | 'analytics' | 'management'>('overview');

  const orderStatusData = [
    { name: 'Delivered', value: 1247, color: '#10b981' },
    { name: 'In Progress', value: 342, color: '#f59e0b' },
    { name: 'Cancelled', value: 58, color: '#ef4444' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">Platform Overview • January 2026</p>
        </div>
        <div className="flex items-center gap-3">
          {adminStats.pendingApprovals.restaurants > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm">
              <AlertCircle size={14} />
              <span>{adminStats.pendingApprovals.restaurants} restaurants pending</span>
            </div>
          )}
          {adminStats.pendingApprovals.riders > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm">
              <AlertCircle size={14} />
              <span>{adminStats.pendingApprovals.riders} riders pending</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        {(['overview', 'orders', 'users', 'analytics', 'management'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors relative whitespace-nowrap ${
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users size={18} className="text-blue-600" />
                </div>
                <span className="text-xs text-gray-500">Customers</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{adminStats.totalCustomers.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+12% this month</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Store size={18} className="text-orange-600" />
                </div>
                <span className="text-xs text-gray-500">Restaurants</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{adminStats.totalRestaurants}</p>
              <p className="text-xs text-green-600 mt-1">+8 this month</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Bike size={18} className="text-purple-600" />
                </div>
                <span className="text-xs text-gray-500">Riders</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{adminStats.totalRiders}</p>
              <p className="text-xs text-green-600 mt-1">+23 this month</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingBag size={18} className="text-green-600" />
                </div>
                <span className="text-xs text-gray-500">Today's Orders</span>
              </div>
              <p className="text-xl font-bold text-gray-800">{adminStats.todayOrders.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">+15% vs yesterday</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign size={18} className="text-emerald-600" />
                </div>
                <span className="text-xs text-gray-500">Revenue Today</span>
              </div>
              <p className="text-xl font-bold text-gray-800">₹{(adminStats.todayRevenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-green-600 mt-1">+18% vs yesterday</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Revenue Trend</h3>
                <span className="text-xs text-gray-500">Last 7 months</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={adminStats.monthlyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4">Order Status</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {orderStatusData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Recent Orders</h3>
              <button className="text-sm text-orange-500 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Order</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Restaurant</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Rider</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {adminStats.recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-sm font-medium text-gray-800">#{order.orderNumber}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{order.customer}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{order.restaurant}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{order.rider}</td>
                      <td className="px-5 py-3 text-sm font-medium text-gray-800">₹{order.amount}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {order.status === 'delivered' && <CheckCircle2 size={10} />}
                          {order.status === 'out_for_delivery' && <Bike size={10} />}
                          {order.status === 'preparing' && <Clock size={10} />}
                          {order.status === 'picked_up' && <Activity size={10} />}
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">All Orders</h3>
            <div className="flex gap-2">
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
                <option>All Status</option>
                <option>Delivered</option>
                <option>In Progress</option>
                <option>Cancelled</option>
              </select>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Restaurant</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Rider</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {adminStats.recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-800">#{order.orderNumber}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{order.customer}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{order.restaurant}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{order.rider}</td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-800">₹{order.amount}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button className="text-sm text-orange-500 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800">Customers</h3>
                <Users size={20} className="text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{adminStats.totalCustomers.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">Active: 9,840</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800">Restaurants</h3>
                <Store size={20} className="text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{adminStats.totalRestaurants}</p>
              <p className="text-sm text-gray-500 mt-1">Pending: {adminStats.pendingApprovals.restaurants}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800">Riders</h3>
                <Bike size={20} className="text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{adminStats.totalRiders}</p>
              <p className="text-sm text-gray-500 mt-1">Pending: {adminStats.pendingApprovals.riders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Top Restaurants</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {adminStats.topRestaurants.map((restaurant, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">{restaurant.name}</p>
                      <p className="text-xs text-gray-500">{restaurant.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">₹{restaurant.revenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="text-orange-500" />
                <h3 className="font-bold text-gray-800">Monthly Orders</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={adminStats.monthlyData}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} fill="url(#colorOrders)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-green-500" />
                <h3 className="font-bold text-gray-800">Monthly Revenue</h3>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={adminStats.monthlyData}>
                  <defs>
                    <linearGradient id="colorRev2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="url(#colorRev2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">Platform Performance</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Avg Order Value</p>
                <p className="text-xl font-bold text-gray-800">₹{(adminStats.todayRevenue / adminStats.todayOrders).toFixed(0)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
                <p className="text-xl font-bold text-gray-800">94.2%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Cancellation Rate</p>
                <p className="text-xl font-bold text-gray-800">2.9%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Avg Delivery Time</p>
                <p className="text-xl font-bold text-gray-800">28 min</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Management Tab - Admin Only */}
      {activeTab === 'management' && (
        <div>
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white mb-6">
            <h3 className="text-xl font-bold mb-2">⚙️ Platform Management</h3>
            <p className="text-red-100">Admin-only controls for platform-wide configuration</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Approvals */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-yellow-500" />
                Pending Approvals
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Restaurant Applications</p>
                    <p className="text-xs text-gray-500">{adminStats.pendingApprovals.restaurants} awaiting review</p>
                  </div>
                  <button className="px-3 py-1.5 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600">
                    Review
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Rider Applications</p>
                    <p className="text-xs text-gray-500">{adminStats.pendingApprovals.riders} awaiting verification</p>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
                    Review
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Settings */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4">Platform Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Platform Fee</p>
                    <p className="text-xs text-gray-500">Charged per order</p>
                  </div>
                  <span className="font-bold text-gray-800">₹5.00</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Commission Rate</p>
                    <p className="text-xs text-gray-500">From restaurant earnings</p>
                  </div>
                  <span className="font-bold text-gray-800">18%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Delivery Zones</p>
                    <p className="text-xs text-gray-500">Active zones</p>
                  </div>
                  <span className="font-bold text-gray-800">12</span>
                </div>
              </div>
            </div>

            {/* Coupons & Banners */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4">Active Coupons</h3>
              <div className="space-y-2">
                {[
                  { code: 'WELCOME50', discount: '50% OFF', usage: '2,340 / 10,000' },
                  { code: 'CRAVINGS100', discount: '₹100 OFF', usage: '1,890 / 5,000' },
                  { code: 'FREEDEL', discount: 'Free Delivery', usage: '4,560 / ∞' },
                ].map((coupon, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-mono font-bold text-orange-600">{coupon.code}</p>
                      <p className="text-xs text-gray-500">{coupon.discount} • {coupon.usage} used</p>
                    </div>
                    <button className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-orange-400 hover:text-orange-500">
                + Create New Coupon
              </button>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4">Food Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Pizza', 'Burgers', 'Biryani', 'Chinese', 'Desserts', 'Healthy', 'South Indian', 'Beverages'].map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{cat}</span>
                    <button className="text-xs text-gray-400 hover:text-gray-600">Edit</button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-orange-400 hover:text-orange-500">
                + Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
