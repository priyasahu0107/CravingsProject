import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, CheckCircle2, Circle, Bike } from 'lucide-react';
import { mockOrderStatuses } from '../data/mockData';

export default function OrderTracking() {
  const [statuses, setStatuses] = useState(mockOrderStatuses);
  const [estimatedTime, setEstimatedTime] = useState(12);

  // Simulate order progress
  useEffect(() => {
    const timer = setInterval(() => {
      setStatuses(prev => {
        const firstIncomplete = prev.findIndex(s => !s.completed);
        if (firstIncomplete === -1) return prev;
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return prev.map((s, i) =>
          i === firstIncomplete ? { ...s, completed: true, timestamp: timeStr } : s
        );
      });
      setEstimatedTime(prev => Math.max(0, prev - 1));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const currentStep = statuses.filter(s => s.completed).length;
  const progressPercent = (currentStep / statuses.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Tracking</h1>
          <p className="text-sm text-gray-500">Order #CRV20260115001</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tracking Timeline */}
        <div className="flex-1">
          {/* Progress Bar */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">Order Progress</h3>
              <span className="text-sm text-orange-500 font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Clock size={16} className="text-orange-500" />
              <span className="text-sm text-gray-600">
                Estimated delivery in <span className="font-bold text-gray-800">{estimatedTime} min</span>
              </span>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-5">Status Updates</h3>
            <div className="space-y-0">
              {statuses.map((status, index) => (
                <div key={index} className="flex gap-4">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    {status.completed ? (
                      <CheckCircle2 size={22} className="text-green-500 flex-shrink-0" />
                    ) : index === currentStep ? (
                      <div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center flex-shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                      </div>
                    ) : (
                      <Circle size={22} className="text-gray-300 flex-shrink-0" />
                    )}
                    {index < statuses.length - 1 && (
                      <div className={`w-0.5 h-12 ${
                        status.completed ? 'bg-green-300' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-8">
                    <p className={`font-medium text-sm ${
                      status.completed ? 'text-gray-800' : index === currentStep ? 'text-orange-600 font-bold' : 'text-gray-400'
                    }`}>
                      {status.status}
                    </p>
                    {status.timestamp && (
                      <p className="text-xs text-gray-400 mt-0.5">{status.timestamp}</p>
                    )}
                    {index === currentStep && !status.completed && (
                      <p className="text-xs text-orange-500 mt-1 animate-pulse">In progress...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Details Sidebar */}
        <div className="lg:w-80">
          {/* Rider Info */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
            <h3 className="font-bold text-gray-800 mb-4">Delivery Partner</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Bike size={24} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Rahul K.</p>
                <p className="text-xs text-gray-500">⭐ 4.8 • 1,234 deliveries</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                <Phone size={14} />
                Call
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                <MessageCircle size={14} />
                Chat
              </button>
            </div>
          </div>

          {/* Delivery Location */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
            <h3 className="font-bold text-gray-800 mb-3">Delivery Address</h3>
            <div className="flex gap-3">
              <MapPin size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 text-sm">Home</p>
                <p className="text-xs text-gray-500 mt-1">
                  123, MG Road, Koramangala<br />
                  Bangalore - 560001
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-3">Order Items</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Chicken Biryani x1</span>
                <span className="text-gray-800 font-medium">₹329</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Butter Chicken x1</span>
                <span className="text-gray-800 font-medium">₹349</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Garlic Naan x2</span>
                <span className="text-gray-800 font-medium">₹118</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-sm">
                <span className="text-gray-800">Total</span>
                <span className="text-gray-800">₹846</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
