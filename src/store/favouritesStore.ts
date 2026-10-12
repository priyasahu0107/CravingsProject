import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavouriteItem {
  id: string;
  type: 'restaurant' | 'food';
  itemId: string;
  name: string;
  image?: string;
  addedAt: string;
}

interface FavouritesStore {
  favourites: FavouriteItem[];
  addFavourite: (item: Omit<FavouriteItem, 'addedAt'>) => void;
  removeFavourite: (id: string) => void;
  isFavourite: (itemId: string) => boolean;
  getFavouritesByType: (type: 'restaurant' | 'food') => FavouriteItem[];
  clearFavourites: () => void;
}

export const useFavouritesStore = create<FavouritesStore>()(
  persist(
    (set, get) => ({
      favourites: [],

      addFavourite: (item) => {
        const existing = get().favourites.find(f => f.itemId === item.itemId);
        if (existing) return;

        set(state => ({
          favourites: [
            { ...item, addedAt: new Date().toISOString() },
            ...state.favourites,
          ],
        }));
      },

      removeFavourite: (itemId) => {
        set(state => ({
          favourites: state.favourites.filter(f => f.itemId !== itemId),
        }));
      },

      isFavourite: (itemId) => {
        return get().favourites.some(f => f.itemId === itemId);
      },

      getFavouritesByType: (type) => {
        return get().favourites.filter(f => f.type === type);
      },

      clearFavourites: () => {
        set({ favourites: [] });
      },
    }),
    {
      name: 'cravings-favourites',
    }
  )
);
