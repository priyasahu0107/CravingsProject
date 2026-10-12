import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';

export default function AdminOrders() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        <p className="text-gray-500">Monitor all platform orders</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Management</h3>
        <p className="text-gray-500 mb-4">Monitor orders from the admin dashboard.</p>
        <Link to="/admin/dashboard" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
