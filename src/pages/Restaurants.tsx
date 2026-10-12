import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Filter, SlidersHorizontal } from 'lucide-react';
import { restaurants } from '../data/mockData';

export default function Restaurants() {
  const [sortBy, setSortBy] = useState('rating');
  const [filterCuisine, setFilterCuisine] = useState('all');

  const cuisines = ['all', 'Indian', 'American', 'Italian', 'Chinese', 'Healthy', 'South Indian'];

  const filteredRestaurants = restaurants
    .filter(r => filterCuisine === 'all' || r.cuisine.includes(filterCuisine))
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'deliveryTime') return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
      if (sortBy === 'deliveryFee') return a.deliveryFee - b.deliveryFee;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">All Restaurants</h1>
        <p className="text-gray-500">Discover the best restaurants near you</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <SlidersHorizontal size={16} />
          <span className="font-medium">Filters:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {cuisines.map(cuisine => (
            <button
              key={cuisine}
              onClick={() => setFilterCuisine(cuisine)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCuisine === cuisine
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
              }`}
            >
              {cuisine === 'all' ? 'All' : cuisine}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {filteredRestaurants.length} restaurants found
        </p>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <option value="rating">Top Rated</option>
            <option value="deliveryTime">Fastest Delivery</option>
            <option value="deliveryFee">Low Delivery Fee</option>
          </select>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRestaurants.map(restaurant => (
          <Link
            key={restaurant.id}
            to={`/restaurant/${restaurant.id}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700">
                  {restaurant.deliveryTime}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  restaurant.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {restaurant.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {restaurant.name}
                </h3>
                <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                  <Star size={10} fill="white" />
                  {restaurant.rating}
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">{restaurant.cuisine.join(', ')}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {restaurant.deliveryTime}
                </span>
                <span>•</span>
                <span>₹{restaurant.deliveryFee} delivery</span>
                <span>•</span>
                <span>Min ₹{restaurant.minimumOrder}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🍽️</p>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No restaurants found</h3>
          <p className="text-gray-500">Try changing your filters</p>
        </div>
      )}
    </div>
  );
}
