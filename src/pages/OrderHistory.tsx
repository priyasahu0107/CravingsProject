import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Package, Truck, AlertCircle } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';

export default function OrderHistory() {
  const orders = useOrderStore(state => state.orders);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'cancelled':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'out_for_delivery':
      case 'picked_up':
        return <Truck size={20} className="text-blue-500" />;
      default:
        return <Package size={20} className="text-orange-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'out_for_delivery':
      case 'picked_up':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-orange-100 text-orange-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start ordering from your favorite restaurants!</p>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Order History</h1>
        <p className="text-gray-500">View and track your past orders</p>
      </div>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(order.status)}
                    <h3 className="font-bold text-gray-800">#{order.orderNumber}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{order.restaurantName}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-gray-800 font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="text-xs text-gray-500">+{order.items.length - 3} more items</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="font-bold text-gray-800">₹{order.total}</p>
                </div>
                {order.status === 'delivered' && (
                  <Link
                    to={`/restaurant/${order.restaurantId}`}
                    className="px-4 py-2 bg-orange-50 text-orange-600 text-sm font-medium rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    Reorder
                  </Link>
                )}
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <Link
                    to="/order-tracking"
                    className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Track Order
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
