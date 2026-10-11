import { Link, useSearchParams } from 'react-router-dom';
import { Search, Star, Clock, X } from 'lucide-react';
import { restaurants } from '../data/mockData';
import { useState, useEffect, useMemo } from 'react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [recentSearches] = useState(['Biryani', 'Pizza', 'Burger', 'Chinese', 'Healthy']);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const results = useMemo(() => {
    if (!query.trim()) return { restaurants: [], foods: [] };

    const q = query.toLowerCase();

    const matchedRestaurants = restaurants.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.cuisine.some(c => c.toLowerCase().includes(q)) ||
      r.description.toLowerCase().includes(q)
    );

    const matchedFoods = restaurants.flatMap(r =>
      r.menu
        .filter(item =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        )
        .map(item => ({ ...item, restaurantId: r.id, restaurantName: r.name }))
    );

    return { restaurants: matchedRestaurants, foods: matchedFoods };
  }, [query]);

  const hasResults = results.restaurants.length > 0 || results.foods.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-300">
          <Search size={20} className="ml-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for restaurants, dishes, cuisines..."
            className="flex-1 px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-2 mr-2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* No query - show suggestions */}
      {!query.trim() && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map(search => (
              <button
                key={search}
                onClick={() => setQuery(search)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>

          <h3 className="text-lg font-bold text-gray-800 mt-8 mb-4">Trending Now 🔥</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restaurants.slice(0, 4).map(restaurant => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{restaurant.name}</h4>
                  <p className="text-xs text-gray-500">{restaurant.cuisine.join(', ')}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Star size={10} className="text-yellow-400" fill="currentColor" />
                      {restaurant.rating}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={10} />
                      {restaurant.deliveryTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {query.trim() && (
        <div>
          {!hasResults ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500">Try searching for something else</p>
            </div>
          ) : (
            <>
              {/* Restaurant Results */}
              {results.restaurants.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Restaurants ({results.restaurants.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results.restaurants.map(restaurant => (
                      <Link
                        key={restaurant.id}
                        to={`/restaurant/${restaurant.id}`}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                      >
                        <div className="relative h-32">
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                              {restaurant.deliveryTime}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-bold text-gray-800">{restaurant.name}</h4>
                          <p className="text-xs text-gray-500">{restaurant.cuisine.join(', ')}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1 text-xs">
                              <Star size={10} className="text-yellow-400" fill="currentColor" />
                              <span className="font-medium">{restaurant.rating}</span>
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">₹{restaurant.deliveryFee} delivery</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Food Results */}
              {results.foods.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Dishes ({results.foods.length})
                  </h3>
                  <div className="space-y-3">
                    {results.foods.map((food, index) => (
                      <Link
                        key={`${food.id}-${index}`}
                        to={`/restaurant/${food.restaurantId}`}
                        className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800">{food.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{food.restaurantName}</p>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{food.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="font-bold text-gray-800">₹{food.price}</span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Star size={10} className="text-yellow-400" fill="currentColor" />
                              {food.rating}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
