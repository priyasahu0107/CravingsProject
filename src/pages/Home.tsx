import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, ChevronRight, Truck, Shield, Zap } from 'lucide-react';
import { restaurants, categories, banners } from '../data/mockData';

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Banner Carousel */}
      <section className="relative mb-8 rounded-2xl overflow-hidden">
        <div className="relative h-48 sm:h-64 md:h-80">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentBanner ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
                <div className="px-6 sm:px-12">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                    {banner.title}
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-200 mb-4">{banner.subtitle}</p>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white text-sm font-medium">Use code: {banner.code}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Banner Dots */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentBanner ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Zap size={20} className="text-orange-600" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">Lightning Fast</p>
            <p className="text-xs text-gray-500">Delivery in 30 min</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield size={20} className="text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">Safe & Hygienic</p>
            <p className="text-xs text-gray-500">Contactless delivery</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Truck size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">Live Tracking</p>
            <p className="text-xs text-gray-500">Real-time order updates</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">What are you craving?</h2>
          <Link to="/restaurants" className="text-orange-500 text-sm font-medium flex items-center gap-1 hover:text-orange-600">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/search?q=${category.name}`}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Popular Restaurants</h2>
          <Link to="/restaurants" className="text-orange-500 text-sm font-medium flex items-center gap-1 hover:text-orange-600">
            See All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurants.slice(0, 6).map(restaurant => (
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
                {restaurant.isOpen && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                      Open
                    </span>
                  </div>
                )}
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
                  <span>{restaurant.priceRange}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 sm:p-12 text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Hungry? We've got you covered!
        </h2>
        <p className="text-orange-100 mb-6 max-w-md mx-auto">
          Order from 1000+ restaurants and get your food delivered in minutes.
        </p>
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-6 py-3 rounded-full hover:bg-orange-50 transition-colors"
        >
          Order Now
          <ChevronRight size={18} />
        </Link>
      </section>
    </div>
  );
}
