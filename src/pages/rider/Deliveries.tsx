import React from 'react';
import { Link } from 'react-router-dom';
import { Bike } from 'lucide-react';

export default function RiderDeliveries() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Deliveries</h1>
        <p className="text-gray-500">View your active and past deliveries</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Bike size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Delivery Management</h3>
        <p className="text-gray-500 mb-4">Manage your deliveries from the dashboard.</p>
        <Link to="/rider/dashboard" className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
