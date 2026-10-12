import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useFavouritesStore } from '../store/favouritesStore';

export default function Favourites() {
  const favourites = useFavouritesStore(state => state.favourites);
  const removeFavourite = useFavouritesStore(state => state.removeFavourite);

  const restaurantFavourites = favourites.filter(f => f.type === 'restaurant');
  const foodFavourites = favourites.filter(f => f.type === 'food');

  if (favourites.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">💝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No favourites yet</h2>
          <p className="text-gray-500 mb-6">Save your favorite restaurants and dishes for quick access!</p>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Favourites</h1>
        <p className="text-gray-500">Your saved restaurants and dishes</p>
      </div>

      {/* Restaurant Favourites */}
      {restaurantFavourites.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Heart size={20} className="text-red-500" fill="currentColor" />
            Restaurants ({restaurantFavourites.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restaurantFavourites.map(fav => (
              <div key={fav.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex">
                <Link to={`/restaurant/${fav.itemId}`} className="flex-1 flex items-center gap-3 p-4">
                  {fav.image && (
                    <img
                      src={fav.image}
                      alt={fav.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{fav.name}</h3>
                    <p className="text-xs text-gray-500">Restaurant</p>
                  </div>
                </Link>
                <button
                  onClick={() => removeFavourite(fav.itemId)}
                  className="p-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Food Favourites */}
      {foodFavourites.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Heart size={20} className="text-red-500" fill="currentColor" />
            Dishes ({foodFavourites.length})
          </h2>
          <div className="space-y-3">
            {foodFavourites.map(fav => (
              <div key={fav.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex">
                <Link to={`/restaurant/${fav.itemId.split('-')[0]}`} className="flex-1 flex items-center gap-3 p-4">
                  {fav.image && (
                    <img
                      src={fav.image}
                      alt={fav.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{fav.name}</h3>
                    <p className="text-xs text-gray-500">Food Item</p>
                  </div>
                </Link>
                <button
                  onClick={() => removeFavourite(fav.itemId)}
                  className="p-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
