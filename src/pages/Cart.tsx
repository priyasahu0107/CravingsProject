import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, Tag, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function Cart() {
  const items = useCartStore(state => state.items);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const clearCart = useCartStore(state => state.clearCart);
  const getSubtotal = useCartStore(state => state.getSubtotal);
  const getDeliveryFee = useCartStore(state => state.getDeliveryFee);
  const getTotal = useCartStore(state => state.getTotal);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const platformFee = 5;
  const tax = Math.round(getSubtotal() * 0.05);
  const discount = couponApplied ? 50 : 0;
  const finalTotal = getTotal() - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME50' || couponCode.toUpperCase() === 'CRAVINGS100') {
      setCouponApplied(true);
    }
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Order Placed Successfully!</h2>
        <p className="text-gray-500 mb-8">Your delicious food is being prepared. Track your order in real-time.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/order-tracking"
            className="px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors"
          >
            Track Order
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some delicious items to get started!</p>
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors"
        >
          <ShoppingBag size={18} />
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
          <p className="text-sm text-gray-500">
            From <span className="font-medium text-gray-700">{items[0]?.restaurantName}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {items.map((item, index) => (
              <div key={item.foodItem.id}>
                <div className="flex items-center gap-4 p-4">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.foodItem.image}
                      alt={item.foodItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{item.foodItem.name}</h3>
                    <p className="text-sm text-gray-500">₹{item.foodItem.price} each</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.foodItem.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={14} className="text-gray-600" />
                    </button>
                    <span className="w-6 text-center font-bold text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.foodItem.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
                    >
                      <Plus size={14} className="text-orange-600" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-gray-800">₹{item.foodItem.price * item.quantity}</p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.foodItem.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {index < items.length - 1 && <div className="border-t border-gray-100 mx-4" />}
              </div>
            ))}
          </div>

          {/* Coupon Section */}
          <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={16} className="text-orange-500" />
              <span className="font-medium text-gray-800">Apply Coupon</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Apply
              </button>
            </div>
            {couponApplied && (
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                ✅ Coupon applied! You saved ₹{discount}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">Try: WELCOME50 or CRAVINGS100</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span>₹{getSubtotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>₹{getDeliveryFee()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (5%)</span>
                <span>₹{tax}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-gray-800 text-base">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mt-5 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Delivering to</p>
              <p className="text-sm font-medium text-gray-800">Home</p>
              <p className="text-xs text-gray-500">123, MG Road, Bangalore - 560001</p>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              className="w-full mt-5 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              Place Order • ₹{finalTotal}
            </button>

            <p className="text-xs text-center text-gray-400 mt-3">
              By placing order, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
