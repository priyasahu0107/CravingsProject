import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Platform Analytics</h1>
        <p className="text-gray-500">View platform-wide performance metrics</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Analytics Dashboard</h3>
        <p className="text-gray-500 mb-4">View analytics from the admin dashboard.</p>
        <Link to="/admin/dashboard" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
