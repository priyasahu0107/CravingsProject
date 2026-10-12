import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export default function RestaurantAnalytics() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-500">View your restaurant's performance metrics</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Analytics Dashboard</h3>
        <p className="text-gray-500 mb-4">View detailed analytics from the main dashboard.</p>
        <Link to="/restaurant/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
