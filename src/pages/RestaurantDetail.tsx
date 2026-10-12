import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, MapPin, ArrowLeft, Plus, Minus, ShoppingBag, Leaf, Egg, Drumstick } from 'lucide-react';
import { restaurants } from '../data/mockData';
import { useCartStore } from '../store/cartStore';

export default function RestaurantDetail() {
  const { id } = useParams();
  const restaurant = restaurants.find(r => r.id === id);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const items = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const totalItems = useCartStore(state => state.getTotalItems());

  if (!restaurant) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">😕</p>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Restaurant not found</h2>
        <Link to="/restaurants" className="text-orange-500 hover:underline">Browse restaurants</Link>
      </div>
    );
  }

  const categories = ['all', ...new Set(restaurant.menu.map(item => item.category))];
  const filteredMenu = activeCategory === 'all'
    ? restaurant.menu
    : restaurant.menu.filter(item => item.category === activeCategory);

  const getItemQuantity = (foodItemId: string) => {
    const cartItem = items.find(i => i.foodItem.id === foodItemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getFoodTypeIcon = (type: string) => {
    switch (type) {
      case 'veg': return <Leaf size={14} className="text-green-600" />;
      case 'non_veg': return <Drumstick size={14} className="text-red-600" />;
      case 'egg': return <Egg size={14} className="text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 md:h-80">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <Link
          to="/restaurants"
          className="absolute top-4 left-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
            <p className="text-gray-200 text-sm sm:text-base mb-3">{restaurant.cuisine.join(' • ')}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400" fill="currentColor" />
                <span className="font-semibold text-white">{restaurant.rating}</span>
                <span>({restaurant.totalReviews.toLocaleString()}+ ratings)</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{restaurant.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info Bar */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span className="font-medium text-gray-800">₹{restaurant.deliveryFee}</span> delivery
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:flex items-center gap-1">
              Min order <span className="font-medium text-gray-800">₹{restaurant.minimumOrder}</span>
            </span>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            restaurant.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {restaurant.isOpen ? '🟢 Open Now' : '🔴 Closed'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Section */}
          <div className="flex-1">
            {/* Description */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <p className="text-gray-600 text-sm">{restaurant.description}</p>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {cat === 'all' ? 'All Items' : cat}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              {filteredMenu.map(item => {
                const quantity = getItemQuantity(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 shadow-sm flex gap-4 hover:shadow-md transition-shadow"
                  >
                    {/* Item Image */}
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        {getFoodTypeIcon(item.foodType)}
                        <h3 className="font-bold text-gray-800 truncate">{item.name}</h3>
                      </div>
                      {item.isFeatured && (
                        <span className="inline-block text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mb-1">
                          ⭐ Bestseller
                        </span>
                      )}
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-bold text-gray-800">₹{item.price}</span>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star size={12} className="text-yellow-400" fill="currentColor" />
                          <span>{item.rating}</span>
                        </div>
                        <span className="text-xs text-gray-400">• {item.prepTime}</span>
                      </div>

                      {/* Add to Cart */}
                      {quantity === 0 ? (
                        <button
                          onClick={() => addItem(item, restaurant.id, restaurant.name)}
                          className="flex items-center gap-1 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          <Plus size={14} />
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center font-bold text-gray-800">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/cart"
              className="flex items-center justify-between bg-orange-500 text-white px-6 py-4 rounded-xl shadow-lg hover:bg-orange-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <span className="font-medium">{totalItems} item{totalItems > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">View Cart</span>
                <span className="text-orange-200">→</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
