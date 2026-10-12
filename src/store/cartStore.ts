import { create } from 'zustand';
import { FoodItem } from '../data/mockData';

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (foodItem: FoodItem, restaurantId: string, restaurantName: string) => void;
  removeItem: (foodItemId: string) => void;
  updateQuantity: (foodItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (foodItem, restaurantId, restaurantName) => {
    const { items } = get();
    const existingItem = items.find(item => item.foodItem.id === foodItem.id);

    if (existingItem) {
      set({
        items: items.map(item =>
          item.foodItem.id === foodItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      // Check if cart has items from different restaurant
      if (items.length > 0 && items[0].restaurantId !== restaurantId) {
        // Clear cart and add new item
        set({
          items: [{ foodItem, quantity: 1, restaurantId, restaurantName }],
        });
      } else {
        set({
          items: [...items, { foodItem, quantity: 1, restaurantId, restaurantName }],
        });
      }
    }
  },

  removeItem: (foodItemId) => {
    const { items } = get();
    set({ items: items.filter(item => item.foodItem.id !== foodItemId) });
  },

  updateQuantity: (foodItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(foodItemId);
      return;
    }
    const { items } = get();
    set({
      items: items.map(item =>
        item.foodItem.id === foodItemId ? { ...item, quantity } : item
      ),
    });
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.foodItem.price * item.quantity, 0);
  },

  getDeliveryFee: () => {
    const { items } = get();
    if (items.length === 0) return 0;
    return 29;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const deliveryFee = get().getDeliveryFee();
    const platformFee = 5;
    const tax = Math.round(subtotal * 0.05);
    return subtotal + deliveryFee + platformFee + tax;
  },
}));
