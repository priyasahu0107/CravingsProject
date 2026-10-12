import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function Checkout() {
  const items = useCartStore(state => state.items);
  const getTotal = useCartStore(state => state.getTotal);

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <p className="text-4xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Cart is empty</h2>
        <p className="text-gray-500 mb-6">Add items to your cart first</p>
        <Link to="/" className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
        <div className="space-y-3 mb-4">
          {items.map(item => (
            <div key={item.foodItem.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.quantity}x {item.foodItem.name}</span>
              <span className="font-medium">₹{item.foodItem.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{getTotal()}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-bold text-gray-800 mb-4">Payment Method</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300">
            <input type="radio" name="payment" defaultChecked className="text-orange-500" />
            <CreditCard size={20} className="text-gray-600" />
            <span className="font-medium">Cash on Delivery</span>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300">
            <input type="radio" name="payment" className="text-orange-500" />
            <CreditCard size={20} className="text-gray-600" />
            <span className="font-medium">Online Payment</span>
          </label>
        </div>
        <button className="w-full mt-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600">
          Place Order • ₹{getTotal()}
        </button>
      </div>
    </div>
  );
}
